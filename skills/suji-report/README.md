# suji-report

KB logbooks 기반 업무 성과 리포트. 주간/월간/분기 3개 파일을 동시 생성하여 drafts/에 저장하고 Confluence에 자동 업데이트한다.

**scope: work only** — personal 프로젝트는 제외.

## When to use

- "리포트 만들어줘", "이번 주 성과 정리", "3월 리포트"
- `/suji-report`

## 파이프라인 위치

```
/suji-kb (원본)
    ↓
/suji-report (집계·정리) ←→ /suji-insights (패턴 감지)
    ↓                           ↓
/suji-pitch (설득)         Memory/CLAUDE.md 승격
```

## 커맨드

| 커맨드 | 용도 |
|--------|------|
| `/suji-report` | 주간 + 월간 + 분기 3개 파일 동시 생성 |
| `/suji-report 2026-Q1` | 명시적 범위 지정 (1개 파일) |
| `/suji-report 2026-03` | 명시적 월 지정 (1개 파일) |

## 트리거

- **자동**: 매일 08:00 (launchd) — 사용자 확인 없이 생성·덮어쓰기 + Confluence 업데이트
- **수동**: `/suji-report` 호출 — 사용자 협업 수정 가능

## 데이터 소스

| 소스 | 수집 항목 |
|------|----------|
| SQLite logbooks 테이블 | 프로젝트별 세션 수, 비용, 토큰, 등급 |
| logbook.md 본문 | decisions, 성과 태그, 다음 단계 |
| insights 테이블 | 미반영 패턴 (severity 순) |
| Memory | 프로젝트 맥락, 진행 중 이슈 |
| Git log | 주요 커밋 |
| dep-check-output.json | Task Pipeline (ready/blocked/backlog/done) |

## 리포트 구조

```
# 업무 성과 리포트: {기간}
## 요약              ← 세션 수, 프로젝트 수, 핵심 성과 top 3
## 프로젝트별 성과    ← 의사결정, 성과 태그, 산출물, 비용
## Task Pipeline     ← dep-check 있을 경우
## 인사이트          ← insights 테이블 미처리 + 신규 발견
## AI 활용 지표      ← 총 세션, 비용, 등급 분포
## 다음 단계         ← 미완료 항목 집계
```

## 저장

```
~/Workspace/work/outputs/drafts/yyyymmdd_업무성과리포트_W{nn}.md     (주간)
~/Workspace/work/outputs/drafts/yyyymmdd_업무성과리포트_{MM}월.md     (월간)
~/Workspace/work/outputs/drafts/yyyymmdd_업무성과리포트_{Q}분기.md    (분기)
```

- `yyyymmdd`는 기간 **시작일**. 이미 존재하면 덮어쓰기.

## Confluence

- 폴더 ID: `2078082368` (Space: `~suji.cho`)
- 레이아웃: 500px 중앙 + 테이블 왼쪽 정렬

## 주의사항

- 수동 호출 시 리포트 초안은 반드시 사용자에게 보여주고 확인받을 것
- 콘텐츠(텍스트/수치/강조점) 사용자 확인 없이 변경 불가 (수동 호출 시)
- 데이터가 없는 기간은 "데이터 없음" 명시, 빈 리포트도 생성

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-kb` | logbooks 원본 데이터 |
| `/suji-insights` | 양방향 — insights→report 포함, report→insights 축적 |
| `/suji-pitch` | report 소재 → 경영진 설득 덱 |
| `/suji-daily-mbo` | 시간 배분 데이터 참조 |
| `/suji-confluence-publish` | Confluence 레이아웃 규칙 공유 |
