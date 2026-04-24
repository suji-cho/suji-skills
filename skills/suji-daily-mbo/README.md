# suji-work-minute

Obsidian 데일리 노트 기반 업무 시간 관리. ERP MBO 입력의 원본 데이터.

**scope: work only**

## When to use

- "오늘 할일 정리해줘", "데일리 마감", "이번 달 공수 정리"
- `/suji-work-minute`

## 파이프라인 위치

```
/suji-work-minute (데일리 입력)
    ↓
Bases 월간요약.base (실시간 대시보드)
    ↓
/suji-work-minute mbo (월별 취합 → ERP 참조용)
    ↓
/suji-report (성과 리포트 소재)
/suji-cto-weekly-report (시간 배분 데이터)
```

## 커맨드

| 커맨드 | 용도 |
|--------|------|
| `/suji-work-minute` | 오늘 노트 생성 + 할일 수집 (캐리오버+월간TODO+프로젝트카드) |
| `/suji-work-minute yesterday` | 어제 노트 후속 입력 |
| `/suji-work-minute close` | 마감 정리 (공수 합산, projects 매칭, 8h 미만 경고) |
| `/suji-work-minute mbo` | 이번 달 월별 취합 리스트 |
| `/suji-work-minute mbo 2026-03` | 특정 월 취합 |

## 경로

```
DAILY_BASE=~/Workspace/work/hand-ons/work_minutes/2026/daily_task
DAILY_PATH=$DAILY_BASE/YYYY Mon          # 월별 서브폴더 (예: "2026 Apr")
MONTHLY_TODO_PATH=~/Workspace/work/hand-ons/work_minutes/2026/monthly_task
PROJECT_TODO_PATH=~/Workspace/work/project/project_todo
REVIEW_PATH=~/Workspace/work/hand-ons/work_minutes/2026/ERP 공수 월별 리포트
```

## 데일리 노트 포맷

파일: `work/hand-ons/work_minutes/2026/daily_task/YYYY Mon/yyyymmdd.md`

```markdown
---
tags: [daily]
scope: work
date: YYYY-MM-DD
total_hours: 0
projects: []
---

# YYYYMMDD Daily

| 작업공수 | 작업유형 | 작업내용 |
|--------|--------|--------|
|  | 리서치 | 접근성 법 리서치 |
| 2 | 회의 | 팀회의, 기술전략팀 회의 |
```

- 작업공수 비어있음 = 할일 (미완료)
- 작업공수 채워짐 = 한일 (완료)

## ERP 작업유형 (변경 불가)

프로젝트관리, 회의, 산출물 작성, 리서치, 교육, 휴가, 전사공통일정

## 워크플로우 요약

- **아침**: `/suji-work-minute` → 어제 캐리오버 + 월간TODO + 프로젝트카드에서 할일 수집 → 의존성 상태 표시 (🟢 Ready / 🔴 Blocked)
- **업무 중**: 사용자가 Obsidian에서 직접 편집
- **마감**: `/suji-work-minute close` → 공수 합산, projects 매칭, 8h 미만 경고, 미완료 확인
- **월말**: `/suji-work-minute mbo` → 전체 취합 리스트 생성

## 관련

- `/suji-report`: KB logbooks 기반 성과 리포트 (이 스킬의 데이터를 참조 가능)
- `/suji-meeting-refine`: 회의록 정리 (회의 항목의 작업내용과 연결)
- `/suji-cto-weekly-report`: 시간 배분 데이터 참조
