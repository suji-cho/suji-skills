---
name: suji-doc-structure
description: 프로젝트 폴더에 문서를 생성·정리·진단할 때 사용. HANDOFF/design/TODO 등 표준 문서명 선택, 폴더 구조 세팅, 문서 간 연결 규칙을 적용한다.
---

# /suji-doc-structure

문서를 만들거나 정리할 때 이 스킬을 사용한다.
목적은 하나: **문서 이름만 보고 역할을 알 수 있는 구조를 유지한다.**

## When to Trigger

- 프로젝트 폴더에 새 문서를 만들 때
- "HANDOFF 작성해줘", "디자인 문서 만들어줘", "이 폴더 정리해줘"
- 새 프로젝트 폴더를 세팅할 때
- 문서 이름이 모호하거나 역할이 겹칠 때

Claude 프로젝트 체계(.claude 구조, 메모리, 스킬, 설정)에 대한 질문은 `/suji-claude-guide` 참조.

---

## Part 1: 문서 네이밍 규칙

### 표준 문서 이름

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

### 선택 기준

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

### 문서 생성 시 규칙

1. **이름 추천 먼저.** 위 테이블에서 맞는 이름과 뉘앙스를 제시하고 확인받는다.
2. **하나의 역할에 하나의 파일.** HANDOFF.md 안에 TODO 섹션은 OK. 하지만 주 목적이 할 일 관리면 TODO.md를 별도로 만든다.
3. **중복 검사.** 같은 폴더에 비슷한 역할의 파일이 있으면 새로 만들지 말고 기존 파일에 추가.
4. **날짜 접두사(`yyyymmdd_`)는 리서치/초안 파일에만 사용.** 표준 문서에는 붙이지 않는다.

### 문서 간 연결 규칙

문서는 독립적이되, 서로를 참조한다.

- **HANDOFF.md → 나머지 전부.** "관련 파일" 섹션에 같은 폴더의 다른 표준 문서를 링크한다. HANDOFF.md가 진입점이다.
- **design.md → CHANGELOG.md.** 설계 변경이 발생하면 CHANGELOG.md에 기록하고, design.md 상단에 "Last reviewed: 날짜" 표시.
- **RUNBOOK.md → STATUS.md.** 운영 절차 문서는 현재 상태 문서를 참조한다.
- **TODO.md → design.md.** 할 일 항목이 설계 결정에서 파생됐다면 "출처: design.md CEO Review" 같이 근거를 명시.

### 안티패턴

이렇게 하지 마라:

| 실수 | 왜 문제인가 | 올바른 방법 |
|---|---|---|
| HANDOFF.md에 할 일을 20개 나열 | HANDOFF는 인수인계서지 할 일 목록이 아님 | TODO 섹션은 "다음 3개"만. 나머지는 TODO.md로 분리 |
| design.md에 운영 상태를 기록 | 설계 문서가 현재 상태와 섞이면 둘 다 stale해짐 | 운영 상태는 STATUS.md, 설계는 설계만 |
| 같은 역할의 파일 2개 (TODO.md + NEXT.md) | 어디를 봐야 하는지 모호해짐 | 하나만 남기고 합치기. 작업이 2개 이하면 NEXT.md, 많으면 TODO.md |
| STATUS.md를 HANDOFF.md 대신 사용 | STATUS는 시스템 건강 상태. 세션 이어받기 맥락이 빠짐 | 세션 이어받기가 목적이면 HANDOFF.md |
| 표준 문서에 날짜 접두사 | `20260327_HANDOFF.md`는 잘못됨 | 날짜 접두사는 리서치/초안 파일에만 |
| 문서 생성 후 HANDOFF.md에 링크 안 함 | 다음 세션에서 새 문서의 존재를 모름 | HANDOFF.md "관련 파일"에 항상 추가 |

---

## Part 2: 프로젝트 폴더 구조

### ~/work 폴더 패턴

```
~/Workspace/work/
├── drafts/              # [공용] Confluence 업로드용 초안 (yyyymmdd_제목.md)
├── research/            # [공용] 리서치 파일 (yyyymmdd_filename.ext)
├── todo/                # [공용] 프로젝트별 작업 지시서 (01_name.md 넘버링)
├── weekly_report/       # [공용] 주간 리포트
│
└── {project_name}/      # [프로젝트] 하나의 프로젝트에 속하는 모든 파일
    ├── HANDOFF.md       #   필수. 세션 이어받기 진입점.
    ├── design.md        #   선택. 설계 문서.
    └── ...              #   코드, 설정, 데이터 등
```

**공용 폴더** (drafts, research, todo, weekly_report):
- 여러 프로젝트가 공유하는 파일 저장소.
- 파일명에 `yyyymmdd_` 접두사 또는 넘버링(`01_`).

**프로젝트 폴더**:
- 하나의 프로젝트에 속하는 모든 파일.
- 내부에 HANDOFF.md 등 표준 문서 배치.
- GitHub 레포와 1:1 대응 가능.

### 프로젝트 lifecycle별 필요 문서

| 단계 | 필수 문서 | 추가 권장 |
|---|---|---|
| **설계중** | `HANDOFF.md` | `design.md` |
| **구현중** | `HANDOFF.md` | `design.md`, `TODO.md` |
| **운영중** | `HANDOFF.md` | `STATUS.md`, `RUNBOOK.md`, `CHANGELOG.md` |
| **완료/아카이브** | `BRIEF.md` | (나머지 삭제 또는 보관) |

단계 전환 시:
- 설계중 → 구현중: design.md에 "Status: REVIEWED" 표시, TODO.md 생성
- 구현중 → 운영중: TODO.md 정리, STATUS.md + RUNBOOK.md 생성
- 운영중 → 완료: BRIEF.md로 요약 후 나머지 아카이브

### 새 프로젝트 폴더 최소 구성

```
{project_name}/
└── HANDOFF.md    # 필수. 이것만 있으면 다음 세션에서 이어받을 수 있다.
```

---

## 실행 가이드

### 문서 생성 요청 시

1. 대상 폴더 확인 (존재 여부)
2. 기존 문서 목록 확인 (역할 중복 검사)
3. Part 1 테이블에서 맞는 이름 + 뉘앙스 제시
4. 안티패턴 테이블과 대조
5. 사용자 확인 후 생성
6. HANDOFF.md가 있으면 "관련 파일"에 새 문서 링크 추가

### 폴더 정리/진단 요청 시

1. 폴더 내 파일 목록 조회
2. 진단 리포트 출력:

```
📋 폴더 진단: ~/work/{project_name}/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
현재 단계: {설계중/구현중/운영중} (추정)

✅ 있는 것:
  - HANDOFF.md (세션 이어받기 — OK)
  - design.md (설계 문서 — OK)

⚠️ 없는 것:
  - TODO.md — 할 일이 HANDOFF.md에 15개 나열되어 있음. 분리 권장.

🔴 문제:
  - design.md가 운영 상태도 기록 중 (안티패턴: 역할 혼합)
  - 20260326_competitor_pdf_tracker.md — 역할 불명확. BRIEF.md로 리네이밍?

📎 문서 간 연결:
  - HANDOFF.md → design.md 참조 ✅
  - HANDOFF.md → 20260326_*.md 참조 ❌ (누락)
```

3. 각 문제에 대해 수정 제안 (이름 + 뉘앙스 표시)
4. 사용자 확인 후 적용
