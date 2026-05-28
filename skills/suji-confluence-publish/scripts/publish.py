#!/usr/bin/env python3
"""
publish.py — 마크다운을 Confluence 페이지로 일괄 생성/업데이트 (원샷)

전체 흐름을 단일 명령으로:
  1. md_to_confluence.py로 변환 (storage format)
  2. confluence_postprocess.py로 후처리 (panel + task-list + spacer + layout)
  3. CQL로 동일 제목 페이지 검색
  4. 존재 시 PUT (version GET → +1), 없으면 POST
  5. 결과 URL 출력

환경 변수 (~/.zshrc):
  HNC_JIRA_URL    예: https://hancom.atlassian.net
  HNC_JIRA_EMAIL  인증 이메일
  HNC_JIRA_TOKEN  API 토큰

Usage:
  python3 publish.py input.md \\
    --title "20260528_제목" \\
    --space OSS1 \\
    --parent 1902903831 \\
    [--sidebar "<p>...</p>"] \\
    [--sidebar-file /path/to/sidebar.html] \\
    [--layout two_equal] \\
    [--no-toc] \\
    [--force-create]
"""

import argparse
import base64
import json
import os
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
POST_SCRIPT = SCRIPT_DIR / "confluence_postprocess.py"

MD2CONF_CANDIDATES = [
    Path.home() / ".claude/plugins/marketplaces/odl-agent-skills/skills/odl-jira/scripts/md_to_confluence.py",
    Path.home() / ".claude/plugins/marketplaces/bundo-agent-skills/skills/bundo-jira/scripts/md_to_confluence.py",
]


def find_md_to_confluence() -> Path:
    for p in MD2CONF_CANDIDATES:
        if p.exists():
            return p
    sys.exit("Error: md_to_confluence.py not found in odl-jira or bundo-jira skills")


def env(key: str) -> str:
    v = os.environ.get(key)
    if not v:
        sys.exit(f"Error: 환경 변수 {key} 미설정 — ~/.zshrc 확인")
    return v


def http_request(method: str, url: str, headers: dict = None, data: str = None):
    req = urllib.request.Request(url, method=method, headers=headers or {})
    body_bytes = data.encode("utf-8") if isinstance(data, str) else data
    try:
        with urllib.request.urlopen(req, data=body_bytes) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def cql_search(jira_url: str, auth: str, space: str, title: str) -> list:
    """CQL로 동일 제목 페이지 검색."""
    cql = f'space="{space}" AND title="{title}" AND type=page'
    qs = urllib.parse.urlencode({"cql": cql, "limit": 5})
    url = f"{jira_url}/wiki/rest/api/content/search?{qs}"
    status, body = http_request(
        "GET",
        url,
        {"Authorization": f"Basic {auth}", "Accept": "application/json"},
    )
    if status == 200:
        return json.loads(body).get("results", [])
    return []


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("input", help="입력 마크다운 파일")
    parser.add_argument("--title", required=True, help="페이지 제목 (yyyymmdd_제목)")
    parser.add_argument("--space", required=True, help="Confluence 스페이스 키 (예: OSS1)")
    parser.add_argument("--parent", required=True, help="부모 페이지 또는 폴더 ID")
    parser.add_argument("--sidebar", default="", help="사이드 셀 HTML 직접 입력")
    parser.add_argument("--sidebar-file", help="사이드 셀 HTML 파일 경로 (긴 콘텐츠용)")
    parser.add_argument("--layout", default="two_equal",
                        help="layout 타입 (기본 two_equal, none으로 비활성)")
    parser.add_argument("--no-toc", action="store_true", help="TOC 매크로 비활성화")
    parser.add_argument("--force-create", action="store_true",
                        help="중복 검색 건너뛰고 무조건 새로 생성")
    args = parser.parse_args()

    jira_url = env("HNC_JIRA_URL").rstrip("/")
    email = env("HNC_JIRA_EMAIL")
    token = env("HNC_JIRA_TOKEN")
    auth = base64.b64encode(f"{email}:{token}".encode()).decode()

    # 사이드 셀 콘텐츠 결정 (파일 > 직접 > 빈)
    sidebar = args.sidebar
    if args.sidebar_file:
        sidebar = Path(args.sidebar_file).read_text(encoding="utf-8")

    # 1. md → storage format
    md_to_conf = find_md_to_confluence()
    step1 = Path("/tmp/publish_step1.html")
    cmd1 = ["python3", str(md_to_conf), args.input, str(step1)]
    if not args.no_toc:
        cmd1.append("--toc")
    print(f"[1/4] 변환 — {args.input} → {step1}")
    subprocess.run(cmd1, check=True)

    # 2. 후처리 — panel + task + spacer + layout
    final = Path("/tmp/publish_final.html")
    cmd2 = ["python3", str(POST_SCRIPT), str(step1), str(final),
            f"--layout={args.layout}"]
    if sidebar:
        cmd2.append(f"--sidebar={sidebar}")
    print(f"[2/4] 후처리 — layout={args.layout}, sidebar={'있음' if sidebar else '없음'}")
    subprocess.run(cmd2, check=True)

    body = final.read_text(encoding="utf-8")

    # 3. CQL 사전 검색
    print(f"[3/4] CQL 검색 — space={args.space}, title=\"{args.title}\"")
    existing = []
    if not args.force_create:
        existing = cql_search(jira_url, auth, args.space, args.title)

    # 4. PUT (존재) 또는 POST (신규)
    if existing:
        page_id = existing[0]["id"]
        print(f"      기존 페이지 발견: id={page_id} → PUT 업데이트")
        status, ver_body = http_request(
            "GET",
            f"{jira_url}/wiki/rest/api/content/{page_id}?expand=version",
            {"Authorization": f"Basic {auth}", "Accept": "application/json"},
        )
        if status != 200:
            sys.exit(f"version GET 실패: HTTP {status}\n{ver_body}")
        current_version = json.loads(ver_body)["version"]["number"]
        new_version = current_version + 1

        data = {
            "version": {
                "number": new_version,
                "message": "publish.py 자동 업데이트",
            },
            "title": args.title,
            "type": "page",
            "body": {"storage": {"value": body, "representation": "storage"}},
        }
        print(f"[4/4] PUT — version {current_version} → {new_version}")
        status, resp = http_request(
            "PUT",
            f"{jira_url}/wiki/rest/api/content/{page_id}",
            {
                "Authorization": f"Basic {auth}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json.dumps(data, ensure_ascii=False),
        )
        action = "업데이트"
    else:
        print("      기존 페이지 없음 → POST 신규 생성")
        data = {
            "type": "page",
            "title": args.title,
            "space": {"key": args.space},
            "ancestors": [{"id": args.parent}],
            "body": {"storage": {"value": body, "representation": "storage"}},
        }
        print(f"[4/4] POST — {args.title}")
        status, resp = http_request(
            "POST",
            f"{jira_url}/wiki/rest/api/content",
            {
                "Authorization": f"Basic {auth}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json.dumps(data, ensure_ascii=False),
        )
        action = "생성"

    if status == 200:
        d = json.loads(resp)
        print()
        print(f"✅ 페이지 {action} 성공")
        print(f"   제목: {d['title']}")
        print(f"   ID: {d['id']}")
        print(f"   Version: {d['version']['number']}")
        print(f"   URL: {d['_links']['base']}{d['_links']['webui']}")
    else:
        print()
        print(f"❌ HTTP {status}")
        print(resp)
        sys.exit(1)


if __name__ == "__main__":
    main()
