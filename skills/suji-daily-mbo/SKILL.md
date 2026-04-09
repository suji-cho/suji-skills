---
name: suji-daily-mbo
description: Obsidian 데일리 MBO 노트 생성·관리. 할일 수집(캐리오버+월간TODO), 마감 정리(공수 합산, projects 매칭), 월별 취합 리스트(ERP 참조용). Notion 캘린더 DB 대체.
---

# suji-daily-mbo

Obsidian 데일리 노트 기반 업무 시간 관리. ERP MBO 입력의 원본 데이터.

**scope: work only**

## 파이프라인 위치

```
/suji-daily-mbo (데일리 입력)
    ↓
Bases 월간요약.base (실시간 대시보드)
    ↓
/suji-daily-mbo review (월별 취합 → ERP 참조용)
    ↓
/suji-report (성과 리포트 소재)
/suji-cto-weekly-report (시간 배분 데이터)
```

## 설정

```
DAILY_BASE=~/Workspace/work/work_minutes/2026/daily_task
DAILY_PATH=$DAILY_BASE/YYYY Mon          # 월별 서브폴더 (예: "2026 Apr")
MONTHLY_TODO_PATH=~/Workspace/work/work_minutes/2026/monthly_task
PROJECT_TODO_PATH=~/Workspace/work/project_todo
REVIEW_PATH=~/Workspace/work/work_minutes/2026/ERP 공수 월별 리포트
```

## ERP 작업유형 (띄어쓰기 정확, 변경 불가)

- 프로젝트관리
- 회의
- 산출물 작성
- 리서치
- 교육
- 휴가
- 전사공통일정

## 커맨드

```
/suji-daily-mbo                → 오늘 노트 생성 + 할일 수집
/suji-daily-mbo yesterday      → 어제 노트 후속 입력
/suji-daily-mbo close          → 마감 정리 (공수 합산, projects 매칭)
/suji-daily-mbo review         → 이번 달 월별 취합 리스트
/suji-daily-mbo review 2026-03 → 특정 월 취합
```

## 데일리 노트 포맷

파일: `work/work_minutes/2026/daily_task/YYYY Mon/yyyymmdd.md`
예시: `work/work_minutes/2026/daily_task/2026 Apr/20260408.md`

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
| 6 | 프로젝트관리 | 미디움 자동화, KB 구축 |

## 메모

```

**규칙:**
- 컬럼명 = ERP 컬럼명 그대로 (작업공수, 작업유형, 작업내용)
- 작업공수 비어있음 = 할일 (미완료)
- 작업공수 채워짐 = 한일 (완료)
- 작업유형은 반드시 위 ERP 목록 중 하나 사용
- 월별 서브폴더: `2026 Jan`, `2026 Feb`, ... `2026 Apr`

## 기존 Notion 데이터

Notion에서 가져온 데일리 노트는 월별 폴더에 `Nth, Mon.md` 형식으로 존재 (예: `1st, Apr.md`).
테이블 헤더: `| 공수 | 유형 | 내용 |` (ERP 컬럼명과 다름).
새로 생성하는 노트만 ERP 컬럼명(`작업공수`, `작업유형`, `작업내용`) 사용.
review 시 두 포맷 모두 파싱 가능해야 함.

## 워크플로우

### `/suji-daily-mbo` — 아침 호출

1. **날짜 확인**: 오늘 `yyyymmdd`, 월 폴더명 결정 (예: `2026 Apr`)
2. **파일 존재 확인**: `work/work_minutes/2026/daily_task/YYYY Mon/yyyymmdd.md`
   - 없으면 → 템플릿에서 생성 (date, 제목 치환)
   - 있으면 → 읽기
3. **할일 자동 수집**:
   - 어제 데일리 노트에서 작업공수 비어있는 행 (캐리오버)
   - 현재 월간 TODO (`work/work_minutes/2026/monthly_task/YYYY Mon TODO.md`) 미완료 항목
   - 프로젝트 카드 (`work/project_todo/*.md`, done/ 제외) 미완료 항목
3.5. **의존성 상태 확인**:
   - `~/Workspace/work/scripts/dep-check-output.json` 읽기 (없으면 스킵)
   - 수집된 프로젝트 카드에 어노테이션 추가:
     - 🟢 Ready — 의존성 없거나 모두 완료, 바로 착수 가능
     - 🔴 Blocked (← reason) — 선행 작업 미완료
   - Step 4 정렬: 🟢 Ready 먼저, 🔴 Blocked 하단
4. **수집 결과 보여주기**: 테이블 형태로 후보 제시
5. **사용자 선택**: 오늘 할일 선택
6. **변경 내용 보여주고 승인 후 저장**

### 업무 중 — 사용자 직접 편집

사용자가 Obsidian에서 직접:
- 새 행 추가
- 작업공수 채움 (완료 표시)
- 작업유형, 작업내용 입력

### `/suji-daily-mbo close` — 마감 정리

1. **오늘 데일리 노트 읽기**
2. **테이블 파싱**: 작업공수가 채워진 행만 추출
3. **total_hours 계산**: 작업공수 합산 → frontmatter 업데이트
4. **projects 매칭**: 작업내용 텍스트 → 월간 TODO/프로젝트 카드 매칭 → frontmatter 업데이트
5. **8시간 미만 경고**: total_hours < 8 이면 알림
6. **월간 TODO 크로스 업데이트 제안**: 완료된 항목이 월간 TODO에 있으면 체크 제안
7. **미완료 항목 확인**: 작업공수 비어있는 행 목록 보여주기 (내일 캐리오버 대상)
8. **변경 내용 보여주고 승인 후 저장**

### `/suji-daily-mbo review` — 월별 취합

1. **기간 결정**: 인자 없으면 이번 달, `2026-03` 형식이면 해당 월
2. **해당 월 데일리 노트 전체 읽기**: `work/work_minutes/2026/daily_task/YYYY Mon/*.md` glob
3. **테이블 파싱**: 각 파일에서 작업공수 채워진 행 추출
   - 새 포맷: `| 작업공수 | 작업유형 | 작업내용 |`
   - Notion 포맷: `| 공수 | 유형 | 내용 |`
4. **취합 리스트 생성**:

```markdown
# 2026년 04월

📊 누적 공수: 22.0h

⚠️ 8시간 미만 입력 날짜
  • 2026-04-03 — 6.0h

| 작업일 | 작업공수(ManHour) | 작업유형 | 작업내용 |
|--------|-----------------|--------|--------|
| 2026-04-01 | 2 | 회의 | 팀회의, 기술전략팀 회의 |
| 2026-04-01 | 6 | 프로젝트관리 | 미디움 자동화, 회의록 작성 업데이트, KB 구축 |
| 2026-04-02 | 6 | 프로젝트관리 | KB 구축, 회의록 자동화 구축 |
| 2026-04-02 | 2 | 회의 | 팀회의 |
```

5. **미입력 영업일 경고**: 해당 월에 데일리 노트가 없는 평일 목록
6. **파일 저장**: `work/work_minutes/2026/ERP 공수 월별 리포트/yyyymm_월간요약.md`에 저장
7. **변경 내용 보여주고 승인 후 저장**

## 테이블 파싱 규칙

마크다운 테이블에서 데이터 추출 시:
1. 헤더행 찾기: `| 작업공수 |` 또는 `| 공수 |`
2. 구분선(`|---|---|---|`) 건너뛰기
3. 데이터 행 파싱: `|` 기준 split → trim
4. 작업공수/공수가 빈 문자열이면 미완료 (할일)
5. 작업공수/공수가 숫자면 완료 (한일)

## 관련

- `/suji-report`: KB briefs 기반 성과 리포트 (이 스킬의 데이터를 참조 가능)
- `/suji-meeting-refine`: 회의록 정리 (회의 항목의 작업내용과 연결)
- `work/work_minutes/2026/monthly_task/`: 월간 TODO (할일 수집 소스)
- `work/project_todo/`: 프로젝트 태스크 카드 (할일 수집 소스)
- `work/work_minutes/2026/ERP 공수 월별 리포트/월간요약.base`: Bases 실시간 대시보드
