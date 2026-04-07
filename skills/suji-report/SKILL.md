---
name: suji-report
description: KB briefs 기반 업무 성과 리포트. 매일 08:00 자동 + 수동 호출. 주간/월간/분기 3개 파일 동시 생성·덮어쓰기. drafts/ 저장 + Confluence 자동 업데이트. /suji-pitch 입력 소재, /suji-insights 양방향 연결.
---

# suji-report

KB에 축적된 briefs 데이터를 집계하여 **업무 성과 리포트**를 생성한다.
팀 주간보고, 개인 업무 정리용 리소스이며, `/suji-pitch`의 입력 소재로 사용된다.

**scope: work only** — personal 프로젝트는 리포트에서 제외. `WHERE scope = 'work'` 조건 필수.

설계 문서: `~/Workspace/sujicho-kb/design.md` (Phase 2)
CEO Plan: `~/.gstack/projects/suji-cho-sujicho-kb/ceo-plans/2026-04-02-knowledge-flywheel.md`

## 파이프라인 위치

```
/suji-kb (원본)
    ↓
/suji-report (집계·정리) ←→ /suji-insights (패턴 감지)
    ↓                           ↓
/suji-pitch (설득)         Memory/CLAUDE.md 승격
```

- **insights → report**: insights 테이블의 미처리 패턴을 리포트에 포함
- **report → insights**: 리포트 작성 중 발견한 패턴을 insights 테이블에 축적

## 커맨드

```
/suji-report              → 주간 + 월간 + 분기 3개 파일 동시 생성
/suji-report 2026-Q1      → 명시적 범위 지정 (해당 범위 1개 파일만)
/suji-report 2026-03      → 명시적 월 지정 (해당 월 1개 파일만)
```

## 설정

```
KB_PATH=~/Workspace/sujicho-kb
DB_PATH=$KB_PATH/index.db
DRAFTS_PATH=~/work/drafts

CONFLUENCE_CLOUD=hancom.atlassian.net
CONFLUENCE_SPACE=~suji.cho
CONFLUENCE_FOLDER_ID=2078082368
```

## 트리거

- **자동**: 매일 08:00 (launchd) — 사용자 확인 없이 3개 파일 생성·덮어쓰기 + Confluence 업데이트
- **수동**: `/suji-report` 호출 — 동일 워크플로우 + 사용자 협업 수정 가능

## 워크플로우

### Step 1: 인덱스 최신화

```bash
python3 ~/Workspace/sujicho-kb/scripts/build-index.py
```

### Step 2: 기간 산정

기본 실행(`/suji-report`) 시 3개 기간을 동시 산정:

| 단위 | 범위 |
|------|------|
| 주간 | 이번 주 월요일 ~ 오늘 (또는 금요일) |
| 월간 | 이번 달 1일 ~ 오늘 |
| 분기 | 이번 분기 시작일 ~ 오늘 |

중간 과정이라도 우선 생성. 다음 실행 시 덮어쓰기.

### Step 3: 데이터 수집

**3-1. 정량 — SQLite briefs 테이블**

```sql
-- 프로젝트별 집계
SELECT project, scope, grade, COUNT(*) as sessions,
       SUM(cost_usd) as cost, SUM(input_tokens) as input_t,
       SUM(output_tokens) as output_t
FROM briefs
WHERE scope = 'work' AND date BETWEEN :start AND :end
GROUP BY project, scope, grade
ORDER BY sessions DESC;
```

**3-2. 정성 — briefs 본문**

기간 내 briefs의 brief.md에서 추출:
- `decisions:` frontmatter → 주요 의사결정
- `## 성과` 섹션 → 성과 태그 ([절감], [대체], [수치] 등)
- `## 다음 단계` → 진행 중/예정 작업

**3-3. insights 연동 (insights → report)**

```sql
-- 미반영 insights 가져오기
SELECT date, type, detail, severity
FROM insights
WHERE actioned = 0
  AND date BETWEEN :start AND :end
ORDER BY severity DESC, date DESC;
```

**3-4. 추가 소스 (보조)**

- Memory: 프로젝트 맥락, 진행 중 이슈
- Git log: `git log --since=:start --until=:end --oneline` (주요 커밋)
- ~/work/: drafts/, research/ 내 해당 기간 파일

### Step 4: 리포트 생성

```markdown
# 업무 성과 리포트: {기간 표시}

> 생성일: {오늘 날짜} | 범위: {start} ~ {end} | 데이터: {n}개 세션

## 요약
- 총 세션 {n}개, 프로젝트 {n}개
- 핵심 성과: {성과 태그에서 상위 3개}
- 주목 사항: {insights에서 severity=high 항목}

## 프로젝트별 성과

### {프로젝트명} ({scope})
- **세션**: {n}개 (Full {n} / Light {n} / Meta {n})
- **주요 의사결정**: {decisions에서 추출}
- **성과**: {성과 태그에서 추출}
- **산출물**: {artifacts에서 추출}
- **비용**: ${n} (input {n}K / output {n}K tokens)

(프로젝트별 반복)

## 인사이트
(insights 테이블 미처리 건 + 이번 리포트에서 새로 발견한 패턴)

## AI 활용 지표
| 항목 | 값 |
|------|---|
| 총 세션 | {n}개 |
| 총 비용 | ${n} |
| Full / Light / Meta | {n} / {n} / {n} |
| 평균 세션 비용 | ${n} |

## 다음 단계
(briefs의 '다음 단계' 섹션에서 미완료 항목 집계)
```

**자동 실행 시**: 초안 생성 → 바로 저장 + Confluence 업데이트 (사용자 확인 없음)
**수동 호출 시**: 초안을 사용자에게 보여주고 확인 → 수정 협업 → 확정 후 저장 + Confluence 업데이트

### Step 5: 저장 (덮어쓰기)

3개 파일 동시 저장:

```
~/work/drafts/yyyymmdd_업무성과리포트_W{nn}.md
~/work/drafts/yyyymmdd_업무성과리포트_{MM}월.md
~/work/drafts/yyyymmdd_업무성과리포트_{Q}분기.md
```

- `yyyymmdd`는 해당 기간의 **시작일**
- 이미 존재하면 덮어쓰기
- 명시적 범위 지정 시 해당 파일 1개만
- 데이터가 없는 기간은 "데이터 없음" 명시, 빈 리포트도 생성

### Step 6: Confluence 업데이트

3개 페이지를 폴더 `2078082368` 하위에 생성 또는 업데이트:

| 페이지 제목 | 대응 파일 |
|------------|----------|
| `업무성과리포트_W{nn}` | 주간 |
| `업무성과리포트_{MM}월` | 월간 |
| `업무성과리포트_{Q}분기` | 분기 |

- 페이지 존재 → `updateConfluencePage`
- 페이지 미존재 → `createConfluencePage` (parentId: `2078082368`)
- Confluence 레이아웃: 500px 중앙 + 테이블 왼쪽 정렬

### Step 7: insights 축적 (report → insights)

리포트 작성 중 발견한 패턴을 insights 테이블에 기록:

```sql
INSERT INTO insights (date, type, detail, severity, source_query)
VALUES (:today, :type, :detail, :severity, 'suji-report');
```

감지 대상:
- 특정 프로젝트 비용이 전체의 50% 이상 → `type: cost`
- 같은 프로젝트 3주 연속 최다 세션 → `type: pattern`
- 성과 태그 없는 Full brief 비율 30% 이상 → `type: trend`

**자동 실행 시**: 패턴 발견하면 insights 테이블에 바로 기록
**수동 호출 시**: 사용자에게 보고하고 저장 여부 확인

### Step 8: insights 반영 표시

리포트에 포함한 insights의 actioned 상태 업데이트:

```sql
UPDATE insights
SET actioned = 1, actioned_in = :report_slug
WHERE id IN (:included_ids);
```

### Step 9: 완료 보고 (수동 호출 시만)

```
✅ suji-report 완료
  📄 주간: drafts/20260331_업무성과리포트_W14.md
  📄 월간: drafts/20260301_업무성과리포트_03월.md
  📄 분기: drafts/20260101_업무성과리포트_Q1분기.md
  🌐 Confluence: 3개 페이지 업데이트
  📊 데이터: {n}개 세션, {n}개 프로젝트
  💡 인사이트: {n}개 발견, {n}개 반영
```

## 위임

- OKR/KR 성과 매핑 → `/suji-performance` (별도 스킬)
- 경영진 설득 덱 → `/suji-pitch`

## 주의사항

- 수동 호출 시 리포트 초안은 반드시 사용자에게 보여주고 확인받을 것
- 콘텐츠(텍스트/수치/강조점) 사용자 확인 없이 변경 불가 (수동 호출 시)
- 파일 저장 시 `~/work/drafts/` + `yyyymmdd_제목.md` 컨벤션 준수
- Confluence 레이아웃: 500px 중앙 + 테이블 왼쪽 정렬 필수
- 데이터가 없는 기간은 "데이터 없음" 명시, 빈 리포트도 생성
