# suji-cto-weekly-report

매주 CTO에게 보고하는 연구소 주간보고를 자동으로 생성한다. 데이터 자동 수집 → 템플릿 채우기 → 사용자 보완 → Confluence 업로드.

## When to use

- "CTO 주간보고 작성해줘"
- "주간보고 만들어줘"
- `/suji-cto-weekly-report`

## Confluence 정보

- **Cloud ID:** hancom.atlassian.net
- **Space ID:** 1342242976 (OSS1)
- **주간보고 폴더 ID:** 1957232878
- **페이지 제목 형식:** `yyyymmdd 연구소 주간보고` (예: `20260330 연구소 주간보고`)

## 워크플로우

### Step 1. 직전 주 보고서 읽기

Confluence CQL로 직전 주 보고서를 조회하여 기준값 확보:

```
CQL: ancestor = 1957232878 AND type = page ORDER BY created DESC
```

추출 항목: GitHub Stars, Forks, Open Issues, PyPI 수치

### Step 2. 데이터 자동 수집

| 소스 | 경로/방법 | 수집 항목 |
|---|---|---|
| competitor_tracker | `~/Workspace/work/competitor_tracker/history.json` | GitHub Stars, Forks, Watchers, Open Issues (7개 레포) |
| PyPI | `/browse` → pypistats.org/packages/opendataloader-pdf | Last day, Last week, Last month 다운로드 (기준일: 2026-03-12 v2.0 배포) |
| X 포스트 | `history.json`의 `x_post_metrics` 섹션 | Views, Likes, Bookmarks, Reposts, Replies |
| BM 보고서 | Confluence MCP (page 2068480560) | 컨택 리스트, Status(진행/대기), 회신 대기 일수, 의사결정 요청사항 |

대상 레포: opendataloader-pdf, docling, Unstructured, pdfplumber, pypdf, PyMuPDF, liteparse

### Step 3. 보고서 초안 생성

```
## 1. OpenDataLoader v2.0 트래픽 추이 보고
  - 트래픽 테이블 [자동]
  - v2.0 출시 이후 인사이트 [자동 + 사용자 보완]

## 2. 경쟁사 조사 및 대응 예정 방안
  - 시장 배경 [사용자 입력]
  - 경쟁사 지표 테이블 [자동]
  - 위협 분석 / X 포스트 추이 [자동 + 사용자 보완]
  - 대응 방안 [사용자 입력]

## 3. 비즈니스 대응 상황
  - 컨택 리스트 + Status (진행/대기) [자동 - BM 보고서]
  - 회신 대기 일수 [자동 - BM 보고서]
  - 의사결정 요청사항 [자동 - BM 보고서]
  - 추가 코멘트 [사용자 보완]

## 4. 홍보 진행
  - HN / PR / 유튜버 등 [사용자 입력]

## 5. 외주 개발
  - 스프린트 현황 [사용자 입력]
```

### Step 4. 사용자 확인 및 보완

자동 생성된 초안을 보여주고, 수동 입력 항목을 순서대로 질문:
1. "비즈니스 섹션을 BM 보고서에서 자동으로 가져왔습니다. 추가 코멘트가 있나요?"
2. "경쟁사 대응 관련 추가할 내용이 있나요?"
3. "홍보 진행 상황 업데이트가 있나요?"
4. "외주개발 스프린트 현황을 알려주세요."
5. "추가할 섹션이나 수정할 내용이 있나요?"

### Step 5. Confluence 업로드

사용자 승인 후:
- 페이지가 이미 존재하면: `updateConfluencePage`
- 페이지가 없으면: `createConfluencePage` (parentId: 1957232878, spaceId: 1342242976)

## 테이블 형식

### 트래픽 테이블

```markdown
| **항목** | **직전주 날짜** | **금주 날짜** | **변화** |
| --- | --- | --- | --- |
| **GitHub Stars** | {prev} | **{curr}** | {delta} ({pct}%) |
| **Forks** | {prev} | **{curr}** | {delta} ({pct}%) |
| **Open Issues** | {prev} | {curr} | {delta} |
| **PyPI 다운로드 (월간)** | {prev} | **{curr}** (최근 30일) | 일간 {daily} / 주간 {weekly} |
```

### 경쟁사 테이블

Stars 내림차순 정렬. opendataloader-pdf는 볼드 + 표시.

```markdown
| **#** | **Repository** | **Stars** | **주간 변화** | **비고** |
| --- | --- | --- | --- | --- |
| {rank} | {repo_name} | {stars} | {delta} | {note} |
```

## 주의사항 (non-negotiable)

- **변경 전 항상 사용자에게 초안을 보여주고 승인받을 것**
- **디자인/콘텐츠(텍스트/수치) 사용자 확인 없이 변경 불가**
- **수치는 반드시 데이터 소스에서 가져올 것.** 추정값 사용 시 명시
- **주간보고는 전체폭 레이아웃** (700px 제한 미적용)

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-bm-sync` | BM 보고서에서 섹션 3 데이터 자동 수집 |
| `/suji-confluence-publish` | Confluence 업로드 규칙 (주간보고는 전체폭 예외) |
| `/suji-daily-mbo` | 시간 배분 데이터 참조 가능 |
