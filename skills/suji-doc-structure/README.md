# suji-doc-structure

프로젝트 폴더의 문서 네이밍과 구조를 가이드하는 스킬. 문서 이름만 보고 역할을 알 수 있는 구조를 유지한다.

## When to use

- 프로젝트 폴더에 새 문서를 만들 때
- "HANDOFF 작성해줘", "디자인 문서 만들어줘", "이 폴더 정리해줘"
- 새 프로젝트 폴더를 세팅할 때
- 문서 이름이 모호하거나 역할이 겹칠 때

Claude 프로젝트 체계(.claude 구조, 메모리, 스킬, 설정) 질문은 `/suji-claude-guide` 참조.

## 표준 문서 이름

| 파일명 | 뉘앙스 | 한줄 설명 |
|---|---|---|
| `HANDOFF.md` | "새 세션에 넘겨주는 인수인계서" | 배경 + 현재 상태 + 다음 할 일 + 시작 프롬프트 |
| `design.md` | "어떻게 만들 것인가" | 아키텍처, 데이터 흐름, 제약조건, 결정사항 |
| `STATUS.md` | "지금 이 시스템의 건강 상태" | 동작 중인 것, 깨진 것, 핵심 지표 |
| `TODO.md` | "아직 안 한 것들" | 체크박스 중심, 맥락 최소 |
| `NEXT.md` | "지금 당장 이것만" | 바로 다음 1-2개 작업. 초집중용 |
| `CHANGELOG.md` | "과거에 무엇을 했는가" | 날짜별 변경 이력 |
| `RUNBOOK.md` | "문제 생기면 이렇게 해라" | 장애 대응, 수동 작업 절차 |
| `BRIEF.md` | "이 프로젝트가 뭔지 30초 설명" | 배경 + 목적 + 범위 요약. 팀 공유용 |

## 선택 기준

```
주 독자가 "다음 세션의 나/AI"인가?
  → YES → HANDOFF.md
  → NO →
    설계/아키텍처 → design.md
    할 일 목록    → TODO.md
    운영 상태     → STATUS.md
    운영 절차     → RUNBOOK.md
    변경 이력     → CHANGELOG.md
    프로젝트 요약  → BRIEF.md
```

## 문서 생성 규칙 (non-negotiable)

1. **이름 추천 먼저.** 위 테이블에서 맞는 이름과 뉘앙스를 제시하고 확인받는다.
2. **하나의 역할에 하나의 파일.** HANDOFF.md 안에 TODO 섹션은 OK. 하지만 주 목적이 할 일 관리면 TODO.md를 별도로 만든다.
3. **중복 검사.** 같은 폴더에 비슷한 역할의 파일이 있으면 새로 만들지 말고 기존 파일에 추가.
4. **날짜 접두사(`yyyymmdd_`)는 리서치/초안 파일에만 사용.** 표준 문서에는 붙이지 않는다.

## 문서 간 연결 규칙

- **HANDOFF.md → 나머지 전부.** "관련 파일" 섹션에 같은 폴더의 다른 표준 문서를 링크. HANDOFF.md가 진입점.
- **design.md → CHANGELOG.md.** 설계 변경 시 CHANGELOG.md에 기록, design.md 상단에 "Last reviewed: 날짜" 표시.
- **TODO.md → design.md.** 할 일 항목이 설계 결정에서 파생됐다면 "출처: design.md CEO Review" 같이 근거 명시.
- **RUNBOOK.md → STATUS.md.** 운영 절차 문서는 현재 상태 문서를 참조한다.

## 안티패턴

| 실수 | 올바른 방법 |
|---|---|
| HANDOFF.md에 할 일을 20개 나열 | TODO 섹션은 "다음 3개"만. 나머지는 TODO.md로 분리 |
| design.md에 운영 상태를 기록 | 운영 상태는 STATUS.md, 설계는 설계만 |
| 같은 역할의 파일 2개 (TODO.md + NEXT.md) | 하나만 남기고 합치기 |
| 표준 문서에 날짜 접두사 | `20260327_HANDOFF.md`는 잘못됨 |
| 문서 생성 후 HANDOFF.md에 링크 안 함 | HANDOFF.md "관련 파일"에 항상 추가 |

## 폴더 구조

```
~/Workspace/work/
├── drafts/              # [공용] Confluence 업로드용 초안 (yyyymmdd_제목.md)
├── research/            # [공용] 리서치 파일 (yyyymmdd_filename.ext)
├── project_todo/        # [공용] 프로젝트별 작업 지시서 (yyyymmdd_name.md)
├── weekly_report/       # [공용] 주간 리포트
└── {project_name}/      # [프로젝트] 하나의 프로젝트에 속하는 모든 파일
    ├── HANDOFF.md       #   필수. 세션 이어받기 진입점.
    ├── design.md        #   선택. 설계 문서.
    └── ...
```

## 프로젝트 lifecycle별 필요 문서

| 단계 | 필수 | 추가 권장 |
|---|---|---|
| 설계중 | `HANDOFF.md` | `design.md` |
| 구현중 | `HANDOFF.md` | `design.md`, `TODO.md` |
| 운영중 | `HANDOFF.md` | `STATUS.md`, `RUNBOOK.md`, `CHANGELOG.md` |
| 완료/아카이브 | `BRIEF.md` | (나머지 삭제 또는 보관) |

## 실행 가이드

### 문서 생성 요청 시

1. 대상 폴더 확인 (존재 여부)
2. 기존 문서 목록 확인 (역할 중복 검사)
3. 테이블에서 맞는 이름 + 뉘앙스 제시
4. 안티패턴 테이블과 대조
5. 사용자 확인 후 생성
6. HANDOFF.md가 있으면 "관련 파일"에 새 문서 링크 추가

### 폴더 진단 요청 시

1. 폴더 내 파일 목록 조회
2. 진단 리포트 출력 (현재 단계 추정, 있는 것/없는 것/문제점/문서 간 연결 상태)
3. 각 문제에 대해 수정 제안 (이름 + 뉘앙스 표시)
4. 사용자 확인 후 적용

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-claude-guide` | Claude Code 체계(.claude 구조, 메모리, 스킬). doc-structure는 프로젝트 문서 |
| `/suji-confluence-publish` | drafts/ 파일 → Confluence 업로드 |
