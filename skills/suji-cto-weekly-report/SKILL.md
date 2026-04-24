---
name: suji-cto-weekly-report
description: CTO 주간보고 작성 요청 시 사용. competitor_tracker·PyPI·BM 보고서에서 데이터를 자동 수집하고, 템플릿 기반 초안 생성 → 사용자 보완 → Confluence 업로드까지 자동화한다.
---

# CTO 연구소 주간보고 자동 생성

## When to Trigger
- "CTO 주간보고 작성해줘"
- "주간보고 만들어줘"
- "/suji-cto-weekly-report"

## 개요

매주 CTO에게 보고하는 연구소 주간보고를 자동으로 생성한다.
데이터 자동 수집 → 템플릿 채우기 → 사용자 보완 → Confluence 업로드.

## Confluence 정보

- Cloud ID: `hancom.atlassian.net`
- Space ID: `1342242976` (OSS1)
- 주간보고 폴더 ID: `1957232878`
- 페이지 제목 형식: `yyyymmdd 연구소 주간보고` (예: `20260330 연구소 주간보고`)

## 워크플로우

### Step 1. 직전 주 보고서 읽기

Confluence에서 직전 주 보고서를 읽어 기준값을 확보한다.

```
CQL: ancestor = 1957232878 AND type = page ORDER BY created DESC
```

- 가장 최근 페이지를 markdown으로 읽기
- 직전 주 GitHub Stars, Forks, Open Issues, PyPI 수치 추출

### Step 2. 데이터 자동 수집

**2-1. BM 보고서 (Confluence)**

Confluence MCP API로 BM 보고서를 읽어 비즈니스 섹션 데이터를 추출한다.

```
mcp__claude_ai__getConfluencePage
  cloudId: https://hancom.atlassian.net
  pageId: 2068480560
  contentFormat: markdown
```

추출 항목:
- 컨택 리스트 + Status (진행/대기)
- 각 리드별 회신 대기 일수
- 의사결정 요청사항 (미완료 건)

**2-2. competitor_tracker**

파일 경로: `~/Workspace/work/project/competitor_tracker/history.json`

- 최신 스냅샷의 GitHub Stars, Forks, Watchers, Open Issues 추출
- 대상 레포: opendataloader-pdf, docling, Unstructured, pdfplumber, pypdf, PyMuPDF, liteparse
- 직전 주 대비 변화량 계산

**2-3. PyPI 다운로드**

`/browse`로 `https://pypistats.org/packages/opendataloader-pdf` 접속하여 수집:
- Last day, Last week, Last month 다운로드 수
- **기준일: 2026-03-12 (v2.0 배포일).** v2.0 출시 이후 누적/추이를 보고하므로, 배포일 기준으로 데이터를 해석한다.

**2-4. X 포스트 engagement (해당 시)**

파일 경로: `~/Workspace/work/project/competitor_tracker/history.json`의 `x_post_metrics` 섹션
- Views, Likes, Bookmarks, Reposts, Replies 추이
- 신규 저격 포스트가 있으면 `config.py`의 `X_POST_REGISTRY` 확인

### Step 3. 보고서 초안 생성

아래 템플릿 구조로 초안을 생성한다. 자동 수집 데이터는 바로 채우고, 수동 항목은 비워둔다.

**보고서 구조:**

```
## 1. OpenDataLoader v2.0 트래픽 추이 보고
  - 트래픽 테이블 (Stars, Forks, Open Issues, PyPI) [자동]
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

자동 생성된 초안을 사용자에게 보여주고, 각 수동 입력 항목에 대해 질문한다.

질문 순서:
1. "비즈니스 섹션을 BM 보고서에서 자동으로 가져왔습니다. 추가 코멘트가 있나요?"
2. "경쟁사 대응 관련 추가할 내용이 있나요?"
3. "홍보 진행 상황 업데이트가 있나요?"
4. "외주개발 스프린트 현황을 알려주세요."
5. "추가할 섹션이나 수정할 내용이 있나요?"

사용자가 내용을 제공하면 보고서에 반영하고, 최종본을 보여준다.

### Step 5. Confluence 업로드

사용자 승인 후 Confluence에 페이지를 생성한다.

- 페이지가 이미 존재하면: updateConfluencePage
- 페이지가 없으면: createConfluencePage
  - parentId: `1957232878`
  - spaceId: `1342242976`
  - contentFormat: markdown
  - title: `yyyymmdd 연구소 주간보고`

## 트래픽 테이블 형식

```markdown
| **항목** | **직전주 날짜** | **금주 날짜** | **변화** |
| --- | --- | --- | --- |
| **GitHub Stars** | {prev_stars} | **{curr_stars}** | {delta} ({pct}%) |
| **Forks** | {prev_forks} | **{curr_forks}** | {delta} ({pct}%) |
| **Open Issues** | {prev_issues} | {curr_issues} | {delta} |
| **PyPI 다운로드 (월간)** | {prev_pypi} | **{curr_pypi}** (최근 30일) | 일간 {daily} / 주간 {weekly} |
```

## 경쟁사 테이블 형식

Stars 내림차순 정렬. opendataloader-pdf는 볼드 + 🔵 표시.

```markdown
| **#** | **Repository** | **Stars** | **주간 변화** | **비고** |
| --- | --- | --- | --- | --- |
| {rank} | {repo_name} | {stars} | {delta} | {note} |
```

## 주의사항

- 변경 전 항상 사용자에게 초안을 보여주고 승인받을 것
- 디자인·콘텐츠(텍스트/수치) 사용자 확인 없이 변경 불가
- Confluence 업로드 시 700px 중앙 레이아웃 적용 불필요 (주간보고는 전체폭)
- 수치는 반드시 데이터 소스에서 가져올 것. 추정값 사용 시 명시
