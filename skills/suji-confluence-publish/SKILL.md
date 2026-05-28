---
name: suji-confluence-publish
description: "Confluence 페이지의 공통 규칙을 관리하는 스킬. 제목 컨벤션(yyyymmdd), 500px 중앙 레이아웃, md_to_confluence.py 변환 도구 사용법을 정의한다. 다른 suji-* 스킬들이 Confluence 업로드 시 이 규칙을 참조한다."
---

# /suji-confluence-publish

Confluence 페이지의 **공통 규칙**을 정의하는 스킬.
제목, 레이아웃, 변환 도구 사용법을 한곳에서 관리하여 모든 Confluence 업로드가 동일한 품질 기준을 따르게 한다.

## 역할 분담

| 스킬 | 역할 |
|------|------|
| **suji-confluence-publish** (이 스킬) | 공통 규칙 (제목, 레이아웃, 변환) |
| `/suji-research` | 드래프트/리서치 파일 경로, 업로드 대상, 출처 기준 |
| `/suji-meeting-refine` | 회의록 전용 구조, 대상 폴더 |
| `/suji-cto-weekly-report` | 주간보고 전용 (전체폭 레이아웃 예외) |
| `/suji-bm-sync` | BM 보고서 전용 (고정 페이지) |
| `/suji-report` | 성과 리포트 전용 (주간/월간/분기) |
| `/bundo-jira` | API 실행 (curl, 버전 관리, 이미지 순서, 409 처리, 페이지 폭) |

---

## 1. 페이지 제목 컨벤션

`yyyymmdd_제목` (파일명에서 `.md`만 제거)

**이미지 포함 초안**: `outputs/drafts/yyyymmdd_제목/yyyymmdd_제목.md` 형태. 이미지는 같은 폴더의 `images/` 하위. 제목은 내부 `.md` 파일명 기준.

| 로컬 파일명 | Confluence 페이지 제목 |
|---|---|
| `20260313_해외보도자료_배포_효용성_분석.md` | `20260313_해외보도자료_배포_효용성_분석` |
| `20260320_SaaS_구독_비용_정리.md` | `20260320_SaaS_구독_비용_정리` |

규칙:
- 로컬 파일명에서 `.md` 확장자만 제거
- 날짜는 8자리 `yyyymmdd`
- 별도 변환 불필요 (로컬 = Confluence 동일)

---

## 2. 레이아웃 (non-negotiable)

1. **콘텐츠 500px 너비 제한 + 중앙 배치** — `section > column(500px)` 매크로로 전체 래핑
2. **테이블 왼쪽 정렬** — 모든 `<table>`에 `style="margin-left: 0;"` 적용

Why: 기본 레이아웃은 가로 무한 확장되어 가독성이 떨어지고, 테이블이 가운데 정렬되어 텍스트 시작점과 불일치.

**예외:** `/suji-cto-weekly-report`는 전체폭 레이아웃 사용.

---

## 3. 변환 도구: md_to_confluence.py

`scripts/md_to_confluence.py`로 마크다운 → Confluence Storage Format 변환.

```bash
# 기본 변환
python3 scripts/md_to_confluence.py input.md output.html

# TOC + 이미지 폭 지정
python3 scripts/md_to_confluence.py input.md output.html --toc --image-width 721

# curl용 PUT body JSON 생성
python3 scripts/md_to_confluence.py input.md --json /tmp/confluence_update.json \
  --title "페이지 제목" --version 10 --message "업데이트 메시지" --toc --image-width 721

# 이미지 참조 추출
python3 scripts/md_to_confluence.py input.md --list-images

# 테이블 열 너비 측정용 HTML 추출
python3 scripts/md_to_confluence.py input.md --list-tables > /tmp/tables.json

# 측정값 반영
python3 scripts/md_to_confluence.py input.md --json /tmp/confluence_update.json \
  --title "제목" --version 10 --col-widths '{"0":[59,496,74]}'
```

주요 동작:
- YAML frontmatter 자동 제거
- `--toc`: 본문 최상단에 목차(TOC) 매크로 삽입
- `--image-width N`: 이미지에 `ac:width="N"` 속성 추가
- `--col-widths`: Playwright 측정 열 너비 반영 (셀당 +20px 보정, 합계 ≤760이면 760으로 스케일업)

---

## 4. 변환 규칙

| 제거 (로컬 전용) | 유지 (Confluence에 포함) |
|---|---|
| YAML frontmatter | 본문 마크다운 전체 |
| `<!-- LOCAL: ... -->` HTML 주석 | 테이블, 리스트, 헤딩 |
| `[확인 필요]` 플레이스홀더 | 확인 완료된 수치만 |

---

## 5. 후처리: confluence_postprocess.py (필수)

`md_to_confluence.py` 출력만으로는 매크로·체크리스트가 평탄한 blockquote / 일반 list로 떨어진다. 후처리로 Confluence 네이티브 매크로 변환 + **폭·여백 일관성**.

### 깨짐 방지 — 구조적 해결책 (v2)

| 문제 | 원인 | 해결 (스크립트 내장) |
|---|---|---|
| **폭** 매번 다름 | `--layout` 옵션 빠뜨림 | **기본값 `two_equal` 강제** (생략 가능) |
| **여백** 사라짐 | Confluence가 연속 빈 줄 압축 | **`<hr/>` 뒤 빈 단락 자동 삽입** |
| **매크로** 평탄 | md_to_confluence 미지원 | 패널·task-list 변환 |

```bash
# 1단계: 기본 변환
python3 scripts/md_to_confluence.py input.md /tmp/step1.html --toc

# 2단계: 후처리 (기본 layout=two_equal + spacer 자동)
python3 scripts/confluence_postprocess.py /tmp/step1.html /tmp/final.html

# 사이드바 메타 정보 포함
python3 scripts/confluence_postprocess.py /tmp/step1.html /tmp/final.html \
  --sidebar="$SIDEBAR_HTML"

# 다른 layout 명시
python3 scripts/confluence_postprocess.py /tmp/step1.html /tmp/final.html \
  --layout=two_right_sidebar

# layout 비활성 (full-width)
python3 scripts/confluence_postprocess.py /tmp/step1.html /tmp/final.html \
  --layout=none
```

### 변환 룰

| 마크다운 원본 | 변환 결과 (Confluence) |
|---|---|
| `> Info 매크로\n> 본문` | `<div data-type="panel-info">` |
| `> Note 매크로\n> 본문` | `<div data-type="panel-note">` |
| `> Warning 매크로\n> 본문` | `<div data-type="panel-warning">` |
| `> Tip 매크로\n> 본문` | `<div data-type="panel-success">` |
| `> Error 매크로\n> 본문` | `<div data-type="panel-error">` |
| `- [ ] 항목` | `<ul data-type="task-list"><li data-type="task-item"><input type="checkbox" /> 항목</li></ul>` |
| `- [x] 항목` | task-list + `data-task-state="DONE"` + `checked` |
| `---` (hr) | `<hr/>` + 빈 단락 spacer (여백 보존) |
| 전체 본문 | `<ac:layout-section ac:type="two_equal">` 안 래핑 (기본) |

### Confluence 디자인 한계 (정직한 명시)

| 항목 | 가능 | 불가능 |
|---|---|---|
| 폭 | `ac:layout` 매크로 단계 (single·two_equal·sidebar) | px·CSS `max-width` |
| 여백 | spacer 단락, hr | CSS `margin`·`padding` |
| 색·폰트 | 매크로 한정 | 자유 스타일 |

→ **정밀 디자인은 HTML/PDF, Confluence는 "읽기 좋은 수준"까지**. 둘은 용도 분리.

### 마크다운 작성 컨벤션

매크로 표기 — 다음 3가지 모두 지원:

```markdown
# 방식 1 — 한 줄에 라벨 + 본문
> Info 매크로 본문 내용

# 방식 2 — 라벨 + 빈 줄 + 본문 (권장)
> Info 매크로
>
> 본문 내용

# 방식 3 — 라벨 blockquote 따로 + 본문 blockquote
> Info 매크로

> 본문 내용
```

체크리스트는 마크다운 표준 `- [ ]` / `- [x]` 그대로 사용. **한 `<ul>` 안 모든 항목이 체크 형태**여야 task-list로 변환됨 (혼합 시 일반 list 유지).

### 호출 표준 흐름

```
1. md_to_confluence.py        → /tmp/step1.html  (기본 HTML)
2. confluence_postprocess.py  → /tmp/final.html  (매크로 변환)
3. curl POST 또는 mcp createConfluencePage → 페이지 생성
```

→ 모든 `suji-*` 스킬의 Confluence 업로드는 이 2단계 변환을 거쳐야 함.

---

## 6. 업로드 (v1 API + curl — MCP 우회)

MCP `createConfluencePage`는 storage format 매크로(`<ac:structured-macro>`, `<ac:layout>`) 거부. **`<ac:layout>` 매크로 사용하려면 v1 API 필수**. odl-jira 스킬과 동일 패턴.

### 6-1. 환경 변수 표준 — `HNC_JIRA_*` 통일

odl-jira와 공통. `~/.zshrc`에 영구 보존.

| 변수 | 값 |
|---|---|
| `HNC_JIRA_URL` | `https://hancom.atlassian.net` |
| `HNC_JIRA_EMAIL` | 인증 이메일 |
| `HNC_JIRA_TOKEN` | API 토큰 ([발급](https://id.atlassian.com/manage-profile/security/api-tokens)) |

활성:
```bash
source ~/.zshrc
JIRA_AUTH=$(echo -n "${HNC_JIRA_EMAIL}:${HNC_JIRA_TOKEN}" | base64)
JIRA_URL="${HNC_JIRA_URL}"
```

→ `ATLASSIAN_*` 별도 변수 사용 안 함 (이전 가이드 폐기).

### 6-2. CQL 사전 검색 — 중복 제목 회피

페이지 생성 전 동일 제목 존재 여부 확인. 중복 시 "title already exists" 오류 방지.

```bash
SPACE_KEY="OSS1"
TITLE_KEYWORD="가독성가이드"  # 부분 일치 검색

curl -s -o /tmp/cql_result.json -w "%{http_code}" -G \
  -H "Authorization: Basic ${JIRA_AUTH}" \
  -H "Accept: application/json" \
  --data-urlencode "cql=space=${SPACE_KEY} AND title~\"${TITLE_KEYWORD}\"" \
  --data-urlencode "limit=10" \
  "${JIRA_URL}/wiki/rest/api/content/search"

python3 -c "
import json
d = json.load(open('/tmp/cql_result.json'))
for r in d.get('results', []):
    print(f\"{r['id']} - {r['title']}\")
"
```

→ 결과 있으면 제목 조정 (`_v2`, `_test1` 등) 또는 기존 페이지 update 결정.

### 6-3. 페이지 생성 (POST)

```bash
# 변수
HTML_FILE="/tmp/final.html"
TITLE="yyyymmdd_제목"
PARENT_ID="<parent_page_or_folder_id>"
SPACE_KEY="OSS1"

# JSON body (Write 도구로 .py 파일 사용 권장 — 대용량 본문 처리)
python3 - <<EOF > /tmp/page_create.json
import json
body = open("$HTML_FILE").read()
json.dump({
    "type": "page",
    "title": "$TITLE",
    "space": {"key": "$SPACE_KEY"},
    "ancestors": [{"id": "$PARENT_ID"}],
    "body": {"storage": {"value": body, "representation": "storage"}}
}, open("/dev/stdout", "w"), ensure_ascii=False)
EOF

# POST
HTTP_CODE=$(curl -s -o /tmp/page_response.json -w "%{http_code}" -X POST \
  -H "Authorization: Basic ${JIRA_AUTH}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "${JIRA_URL}/wiki/rest/api/content" \
  -d @/tmp/page_create.json)

if [ "$HTTP_CODE" = "200" ]; then
  python3 -c "
import json
d = json.load(open('/tmp/page_response.json'))
print(f\"✅ 성공\")
print(f\"제목: {d['title']}\")
print(f\"ID: {d['id']}\")
print(f\"URL: {d['_links']['base']}{d['_links']['webui']}\")
"
else
  echo "❌ 실패 (HTTP $HTTP_CODE)"
  python3 -c "import json; print(json.load(open('/tmp/page_response.json')).get('message', ''))"
fi
```

### 6-4. 페이지 업데이트 (PUT) — version 충돌 회피

odl-jira 패턴:

```bash
PAGE_ID="2160099970"
TITLE="20260526_가독성가이드_v2.0_미니멀"

# 1. 최신 version GET
HTTP_CODE=$(curl -s -o /tmp/version.json -w "%{http_code}" \
  -H "Authorization: Basic ${JIRA_AUTH}" \
  "${JIRA_URL}/wiki/rest/api/content/${PAGE_ID}?expand=version")

CURRENT_VERSION=$(python3 -c "import json; print(json.load(open('/tmp/version.json'))['version']['number'])")
NEW_VERSION=$((CURRENT_VERSION + 1))

# 2. JSON build (Write 도구로 .py 파일 작성)
python3 /tmp/build_update.py  # body + title + version=NEW_VERSION

# 3. PUT
HTTP_CODE=$(curl -s -o /tmp/update_response.json -w "%{http_code}" -X PUT \
  -H "Authorization: Basic ${JIRA_AUTH}" \
  -H "Content-Type: application/json" \
  "${JIRA_URL}/wiki/rest/api/content/${PAGE_ID}" \
  -d @/tmp/page_update.json)

# 409 Conflict → 최신 version 재조회 후 1회 재시도
```

### 6-5. Curl 안전 패턴 (필수)

odl-jira "함정 & 필수 규칙":

```bash
# ✅ 올바름 — 파일 분리 + HTTP code 확인
HTTP_CODE=$(curl -s -o /tmp/response.json -w "%{http_code}" ...)
if [ "$HTTP_CODE" = "200" ]; then
  python3 -c "import json; d=json.load(open('/tmp/response.json'))"
fi

# ❌ 금지 — JSONDecodeError 위험
curl ... | python3 -c "..."

# ✅ 올바름 — 대용량 본문 .py 파일로
python3 /tmp/build_body.py  # 별도 스크립트
curl -d @/tmp/body.json ...

# ❌ 금지 — ARG_MAX, 이스케이프 문제
curl -d '{"body":{...}}' ...    # 인라인 큰 본문
python3 -c "..."                # 인라인 긴 코드
```

### 6-6. 흔한 오류

| 오류 | 진단 | 해결 |
|---|---|---|
| `401 Unauthorized` | 토큰 잘못/만료 | API 토큰 재발급 |
| `403 Forbidden` | 스페이스 권한 없음 | 권한 요청 |
| `400 title already exists` | 동일 제목 페이지 존재 | §6-2 CQL 사전 검색 사용 |
| `409 Conflict` | version 충돌 | 최신 version 재조회 후 1회 재시도 |
| `parentId not found` | parent ID 무효 | folder·page ID 재확인 |

---

## 7. 사이드 셀 컨벤션 (Suji 표준)

`--layout=two_equal` (또는 `two_right_sidebar`) 사용 시 사이드 셀에 들어갈 표준 메타 정보.

```html
<p><strong>작성자</strong>: Suji Cho</p>
<p><strong>작성일</strong>: yyyy-mm-dd</p>
<p><strong>버전</strong>: vN.M</p>
<p><strong>연관 문서</strong>:</p>
<ul>
  <li><a href="...">README</a></li>
  <li><a href="...">관련 자료</a></li>
</ul>
```

### 호출 예시

```bash
# 1. 변환
python3 scripts/md_to_confluence.py input.md /tmp/step1.html --toc

# 2. 후처리 + layout 래핑 (사이드 셀 메타 정보)
SIDEBAR='<p><strong>작성자</strong>: Suji Cho</p><p><strong>작성일</strong>: 2026-05-26</p><p><strong>버전</strong>: v2.0</p>'
python3 scripts/confluence_postprocess.py /tmp/step1.html /tmp/final.html \
  --layout=two_equal \
  --sidebar="$SIDEBAR"

# 3. 업로드 — §6-3 (POST) 또는 §6-4 (PUT)
```

---

## 전체 흐름 요약 (마크다운 → Confluence 페이지)

```
input.md (마크다운 원본)
   ↓
[1] python3 scripts/md_to_confluence.py
   ↓ /tmp/step1.html  (기본 storage format)
[2] python3 scripts/confluence_postprocess.py --layout=two_equal --sidebar="..."
   ↓ /tmp/final.html  (매크로 + task-list + ac:layout 래핑)
[3] §6-2 CQL 사전 검색 (중복 확인)
   ↓
[4] curl POST or PUT /wiki/rest/api/content
   ↓
Confluence 페이지 생성/업데이트
```

위 4단계를 항상 이 순서로 진행. 후처리(2단계)·CQL 검색(3단계)을 건너뛰면 매크로 누락 또는 중복 오류 발생.

→ 모든 `suji-*` 스킬의 Confluence 업로드는 이 표준 흐름을 따른다.

---

## 8. publish.py — 원샷 (권장 진입점)

위 4단계를 단일 명령으로 일괄 실행. 매번 동일 결과 보장.

```bash
python3 scripts/publish.py input.md \
  --title "20260528_가독성가이드_v2.1_미니멀" \
  --space OSS1 \
  --parent 1902903831
```

### 옵션

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `--title` | (필수) | 페이지 제목 (yyyymmdd_제목 컨벤션) |
| `--space` | (필수) | Confluence 스페이스 키 |
| `--parent` | (필수) | 부모 페이지 또는 폴더 ID |
| `--sidebar` | 빈 | 사이드 셀 HTML 직접 입력 |
| `--sidebar-file` | 없음 | 사이드 셀 HTML 파일 경로 (긴 콘텐츠) |
| `--layout` | `two_equal` | ac:layout 타입 (none으로 비활성) |
| `--no-toc` | off | TOC 매크로 비활성화 |
| `--force-create` | off | CQL 검색 건너뛰고 무조건 새 생성 |

### 동작

1. **변환** — md_to_confluence.py → /tmp/publish_step1.html
2. **후처리** — confluence_postprocess.py (panel · task-list · spacer · layout)
3. **CQL 검색** — 동일 제목 페이지 검색
4. **PUT / POST**
   - 존재 시: version GET → +1 → PUT (업데이트)
   - 없으면: POST (신규 생성)
5. 결과 URL 출력

### 의존성

- 환경 변수: `HNC_JIRA_URL`, `HNC_JIRA_EMAIL`, `HNC_JIRA_TOKEN` (~/.zshrc)
- md_to_confluence.py: odl-jira 또는 bundo-jira 스킬 (자동 탐색)
- confluence_postprocess.py: 같은 디렉토리

### 사이드 셀 (Suji 표준)

```bash
SIDEBAR='<p><strong>작성자</strong>: Suji Cho</p><p><strong>작성일</strong>: 2026-05-28</p><p><strong>버전</strong>: v2.1</p>'
python3 scripts/publish.py input.md \
  --title "..." --space OSS1 --parent 1902903831 \
  --sidebar="$SIDEBAR"
```

→ §7 사이드 셀 컨벤션 참조.

### 예시 — 가독성 가이드 업로드

```bash
python3 scripts/publish.py \
  ~/Workspace/work/outputs/methodology/readability_guide/confluence/minimal.md \
  --title "20260528_가독성가이드_v2.1_미니멀" \
  --space OSS1 \
  --parent 1902903831 \
  --sidebar="<p><strong>작성자</strong>: Suji Cho</p><p><strong>버전</strong>: v2.1</p>"
```

→ 결과: 페이지 생성/업데이트 + URL 출력.
