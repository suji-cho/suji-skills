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

`md_to_confluence.py` 출력만으로는 매크로·체크리스트가 평탄한 blockquote / 일반 list로 떨어진다. 후처리로 Confluence 네이티브 매크로 변환.

```bash
# 1단계: 기본 변환
python3 scripts/md_to_confluence.py input.md /tmp/step1.html --toc

# 2단계: 매크로·체크리스트 후처리
python3 scripts/confluence_postprocess.py /tmp/step1.html /tmp/final.html

# 또는 파이프
python3 scripts/md_to_confluence.py input.md /tmp/step1.html --toc \
  && python3 scripts/confluence_postprocess.py /tmp/step1.html > /tmp/final.html
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

## 6. 업로드 (curl 방식 — MCP 우회)

MCP Atlassian 인증이 만료되거나 사용 불가일 때 curl로 직접 업로드.

### 6-1. API 토큰 (한 번만)

발급: <https://id.atlassian.com/manage-profile/security/api-tokens>
→ Create API token → 이름 입력 → Copy → 안전한 곳 저장 (한 번만 표시).

### 6-2. 환경 변수 (세션 또는 영구)

세션:
```bash
export ATLASSIAN_EMAIL="suji.cho@hancom.com"
export ATLASSIAN_TOKEN="발급받은_토큰"
export DOMAIN="hancom.atlassian.net"
```

영구 보존: `~/.zshrc` 등에 추가. 단 git·KB 노출 주의.

토큰 확인:
```bash
echo "Email: $ATLASSIAN_EMAIL / Token 길이: ${#ATLASSIAN_TOKEN}"
# 보통 192자
```

### 6-3. 페이지 생성

```bash
# 변수 정의
HTML_FILE="/tmp/final.html"
TITLE="yyyymmdd_제목"
PARENT_ID="<folder_or_page_id>"
SPACE_KEY="<space_key>"

# JSON body
jq -n \
  --arg title "$TITLE" \
  --rawfile body "$HTML_FILE" \
  --arg parent "$PARENT_ID" \
  --arg space "$SPACE_KEY" \
  '{
    type: "page",
    title: $title,
    space: {key: $space},
    ancestors: [{id: $parent}],
    body: {storage: {value: $body, representation: "storage"}}
  }' > /tmp/page_create.json

# POST
curl -X POST -s \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  "https://$DOMAIN/wiki/rest/api/content" \
  -d @/tmp/page_create.json \
  > /tmp/page_response.json

# 결과
if grep -q '"id"' /tmp/page_response.json; then
  echo "✅ 성공"
  jq -r '"제목: \(.title)\nID: \(.id)\nURL: \(._links.base)\(._links.webui)"' /tmp/page_response.json
else
  echo "❌ 실패"
  jq -r '.message // .' /tmp/page_response.json
fi
```

### 6-4. 페이지 업데이트 (기존 페이지)

생성 대신 PUT — version 번호 필요:
```bash
PAGE_ID="<existing_page_id>"
NEW_VERSION="<current_version + 1>"

# md_to_confluence.py --json 옵션 활용 (버전 포함 JSON 생성)
python3 scripts/md_to_confluence.py input.md \
  --json /tmp/page_update.json \
  --title "$TITLE" \
  --version $NEW_VERSION \
  --message "v2.0 업데이트" \
  --toc

# 후처리는 별도 스텝 — JSON 안 body.storage.value만 후처리 필요 (TODO)

curl -X PUT -s \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_TOKEN" \
  -H "Content-Type: application/json" \
  "https://$DOMAIN/wiki/rest/api/content/$PAGE_ID" \
  -d @/tmp/page_update.json
```

> 자세한 PUT·409 충돌·이미지 순서는 `/bundo-jira` 스킬 참조.

### 6-5. 흔한 오류

| 오류 | 진단 | 해결 |
|---|---|---|
| `401 Unauthorized` | 토큰 잘못/만료 | API 토큰 재발급 |
| `403 Forbidden` | 스페이스 권한 없음 | 권한 요청 |
| `400 title already exists` | 동일 제목 페이지 존재 | TITLE 수정 (`_test` 추가 등) |
| `parentId not found` | parent ID 무효 | folder·page ID 재확인 |

---

## 전체 흐름 요약 (마크다운 → Confluence 페이지)

```
input.md (마크다운 원본)
   ↓
[1] python3 scripts/md_to_confluence.py
   ↓ /tmp/step1.html
[2] python3 scripts/confluence_postprocess.py
   ↓ /tmp/final.html  (매크로 + task-list 변환)
[3] curl POST /wiki/rest/api/content
   ↓
Confluence 페이지 생성
```

세 스크립트는 항상 이 순서. 후처리(2단계)를 건너뛰면 매크로·체크리스트가 평탄한 blockquote / 일반 list로 떨어진다.
