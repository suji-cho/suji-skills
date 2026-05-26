#!/usr/bin/env python3
"""
confluence_postprocess.py — Confluence Storage Format HTML 후처리

`md_to_confluence.py` 출력 HTML을 받아 다음 변환 룰 적용:

1. Panel 매크로 — `> Info 매크로` / `> Note 매크로` / `> Warning 매크로` / `> Tip 매크로` blockquote
   → `<div data-type="panel-info|note|warning|success|error">`
2. Task list — `- [ ]` / `- [x]` 마크다운 체크리스트
   → `<ul data-type="task-list">` + `<input type="checkbox" />`

표준 라이브러리만 사용 (정규식). 외부 의존 없음.

Usage:
    python3 confluence_postprocess.py input.html output.html
    python3 confluence_postprocess.py input.html              # stdout

원본 마크다운 컨벤션:
    > Info 매크로
    >
    > **TL;DR** — 본문 내용

또는 (한 줄):
    > Info 매크로 본문 내용

또는 (라벨 따로):
    > Info 매크로

    > 본문 인용
    > 한 줄 더
"""

import re
import sys
from pathlib import Path

# 라벨 → Confluence panel type
PANEL_LABEL_MAP = {
    "Info 매크로": "panel-info",
    "Note 매크로": "panel-note",
    "Warning 매크로": "panel-warning",
    "Tip 매크로": "panel-success",
    "Error 매크로": "panel-error",
    "Success 매크로": "panel-success",
}


def transform_panels(html: str) -> str:
    """
    blockquote 매크로 라벨을 Confluence panel div로 변환.

    지원 패턴:
    - `<blockquote><p>Info 매크로 본문</p></blockquote>` (한 줄)
    - `<blockquote><p>Info 매크로</p></blockquote><p>></p><blockquote>본문</blockquote>` (md_to_confluence 출력 패턴)
    - `<blockquote><p>Info 매크로</p></blockquote><blockquote>본문</blockquote>` (인접)
    """
    label_alt = "|".join(re.escape(k) for k in PANEL_LABEL_MAP.keys())

    # 라벨 blockquote + 그 뒤에 이어지는 빈 인용·blockquote 묶음 매칭
    pattern = re.compile(
        r'<blockquote>\s*<p>\s*(?P<label>(?:' + label_alt + r'))\s*(?P<inline>.*?)\s*</p>\s*</blockquote>'
        r'(?P<followups>(?:\s*<p>></p>\s*|\s*<blockquote>.*?</blockquote>\s*)*)',
        re.DOTALL,
    )

    def replace(m: re.Match) -> str:
        label = m.group('label')
        inline = m.group('inline').strip()
        followups = m.group('followups') or ''
        panel_type = PANEL_LABEL_MAP[label]

        parts = []
        if inline:
            parts.append(f'<p>{inline}</p>')

        # followups에서 blockquote 안 내용만 추출
        for bq_match in re.finditer(r'<blockquote>\s*(.*?)\s*</blockquote>', followups, re.DOTALL):
            inner = bq_match.group(1).strip()
            if inner:
                parts.append(inner)

        body = ''.join(parts) if parts else '<p></p>'
        return f'<div data-type="{panel_type}">{body}</div>'

    return pattern.sub(replace, html)


def transform_task_list(html: str) -> str:
    """
    체크리스트 변환: <ul><li><p>[ ] 텍스트</p></li>...</ul>
    → <ul data-type="task-list"><li data-type="task-item"><input type="checkbox" /> 텍스트</li>...</ul>

    한 <ul> 안 모든 <li>가 [ ] 또는 [x]로 시작해야 task-list로 변환.
    (혼합되어 있으면 일반 list로 유지)
    """
    ul_pattern = re.compile(r'<ul>(.*?)</ul>', re.DOTALL)

    def replace_ul(m: re.Match) -> str:
        ul_content = m.group(1)
        li_items = re.findall(r'<li>\s*(.*?)\s*</li>', ul_content, re.DOTALL)
        if not li_items:
            return m.group(0)

        # 모든 li가 task 형태인지 검사
        task_check = re.compile(r'^\s*<p>\s*\[\s*[xX ]?\s*\]', re.DOTALL)
        all_task = all(task_check.match(item) for item in li_items)
        if not all_task:
            return m.group(0)

        new_items = []
        for item in li_items:
            m2 = re.match(
                r'^\s*<p>\s*\[(?P<check>[\sxX]?)\]\s*(?P<text>.*?)\s*</p>\s*$',
                item,
                re.DOTALL,
            )
            if not m2:
                new_items.append(f'<li data-type="task-item">{item}</li>')
                continue
            checked = m2.group('check').strip().lower() == 'x'
            text = m2.group('text').strip()
            if checked:
                input_tag = '<input type="checkbox" checked="checked" />'
                li_attrs = 'data-type="task-item" data-task-state="DONE"'
            else:
                input_tag = '<input type="checkbox" />'
                li_attrs = 'data-type="task-item"'
            new_items.append(f'<li {li_attrs}>{input_tag} {text}</li>')

        return '<ul data-type="task-list">' + ''.join(new_items) + '</ul>'

    return ul_pattern.sub(replace_ul, html)


def postprocess(html: str) -> str:
    """전체 후처리 파이프라인."""
    html = transform_panels(html)
    html = transform_task_list(html)
    return html


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] in ('-h', '--help'):
        print(__doc__)
        sys.exit(0 if len(sys.argv) >= 2 else 1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"Error: file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    html = input_path.read_text(encoding='utf-8')
    result = postprocess(html)

    if len(sys.argv) >= 3:
        output_path = Path(sys.argv[2])
        output_path.write_text(result, encoding='utf-8')
        print(f"Output saved: {output_path} ({len(result)} chars)")
    else:
        sys.stdout.write(result)


if __name__ == "__main__":
    main()
