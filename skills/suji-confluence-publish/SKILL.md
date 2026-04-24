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
