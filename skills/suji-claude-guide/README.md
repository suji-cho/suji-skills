# suji-claude-guide

Claude Code의 프로젝트 관리 체계에 대해 물어볼 때 사용하는 스킬. `.claude` 폴더 구조, 메모리, 스킬, 설정, 플랜 모드 등을 안내한다.

문서 네이밍/폴더 구조 관련 질문은 `/suji-doc-structure` 참조.

## When to use

- "메모리가 뭐야?", "CLAUDE.md는 어디에?"
- "스킬 어떻게 만들어?", "settings.json 뭐 바꿔?"
- ".claude 폴더 구조 알려줘"
- "플랜 모드 어떻게 써?"

## .claude 폴더 맵

```
~/.claude/
├── settings.json          # 전역 설정 (권한, 허용 도구, MCP 등)
├── settings.local.json    # 로컬 전용 설정 (git에 안 올라감)
├── skills/                # 스킬 폴더
│   ├── suji-doc-structure/#   문서 구조화 스킬
│   ├── suji-claude-guide/ #   이 스킬
│   ├── gstack/            #   gstack 스킬 모음
│   └── ...                #   외부 스킬들
├── projects/              # 프로젝트별 세션 + 메모리
│   └── {project-path}/
│       └── memory/        #   이 워크스페이스의 메모리
│           ├── MEMORY.md  #     메모리 인덱스 (항상 로드됨)
│           └── *.md       #     개별 메모리 파일
└── plans/                 # 플랜 모드에서 생성된 계획 파일

~/Workspace/
├── CLAUDE.md              # 프로젝트 지시사항 (모든 세션에서 로드)
└── work/                  # 실제 작업 폴더
```

## CLAUDE.md

`~/Workspace/CLAUDE.md` — 모든 세션에서 자동 로드되는 프로젝트 지시사항.

- 사용할 스킬 목록
- 금지 도구 (예: mcp__claude-in-chrome 사용 금지)
- 프로젝트 전체 규칙
- 하위 디렉토리에도 CLAUDE.md를 둘 수 있음 (해당 폴더에서만 적용)

## 메모리 시스템

`~/.claude/projects/{project-path}/memory/` — 대화 간 지속되는 기억.

### 메모리 유형

| 유형 | 용도 | 예시 |
|---|---|---|
| `user_*.md` | 사용자 역할, 선호, 지식 수준 | Git 계정 구분 |
| `feedback_*.md` | 작업 방식 교정. "이렇게 해라/하지 마라" | 변경 전 확인 요청, 문서 네이밍 가이드 |
| `project_*.md` | 진행 중인 프로젝트 맥락 | portfolio 고도화 상태 |
| `reference_*.md` | 외부 시스템 위치 정보 | Confluence 리서치 경로 |
| `doc_*.md` | 아키텍처/인벤토리 문서 | i18n 구조, 이미지 목록 |

### MEMORY.md

인덱스 파일. 항상 컨텍스트에 로드된다. 200줄 이내로 유지. 각 항목은 한 줄: `- [제목](파일명.md) — 한줄 설명`

### 저장 기준

메모리에 저장하면 좋은 것:
- 사용자가 직접 "기억해줘"라고 한 것
- 같은 교정을 두 번 하지 않기 위한 피드백
- 코드에서 읽을 수 없는 비즈니스 맥락

메모리에 저장하지 않는 것:
- 코드 패턴, 파일 구조 (코드를 읽으면 됨)
- git 이력 (git log로 확인)
- 임시 작업 상태 (HANDOFF.md에 쓴다)

## 스킬 시스템

`~/.claude/skills/{skill-name}/SKILL.md` — 재사용 가능한 작업 지침.

- **호출**: `/skill-name` 으로 호출
- **커스텀 스킬 네이밍**: `/suji-` 접두사. 폴더명: `~/.claude/skills/suji-{skill-name}/`
- **내 스킬 확인**: `ls ~/.claude/skills/ | grep suji-`
- **frontmatter 지원 필드**: `name` (필수), `description` (필수). `version`, `author`, `date`는 미지원 — 필요하면 본문에 기재.

### 주요 스킬 모음
- **gstack**: /office-hours, /plan-ceo-review, /plan-eng-review, /review, /ship, /browse, /qa 등
- **커스텀**: /suji-doc-structure, /suji-claude-guide

## 플랜 모드

복잡한 작업 전 계획을 먼저 세울 수 있다.

- `/plan` 으로 진입
- 계획 파일은 `~/.claude/plans/`에 저장
- 사용자 승인 후 구현 시작
- 큰 작업 흐름: 플랜 → CEO 리뷰(`/plan-ceo-review`) → 구현

## settings.json

| 항목 | 역할 |
|---|---|
| `permissions.allow` | 자동 허용되는 도구/명령어 목록 |
| `permissions.defaultMode` | 기본 권한 모드 |
| `permissions.additionalDirectories` | 추가 허용 디렉토리 |

설정 변경은 `/update-config` 스킬 사용. `settings.local.json`은 git에 올라가지 않는 로컬 전용 설정.

## 질문 유형별 안내

| 질문 | 안내할 섹션 |
|---|---|
| "메모리가 뭐야?" | 메모리 시스템 |
| "CLAUDE.md 어디에?" | CLAUDE.md |
| "스킬 어떻게 만들어?" | 스킬 시스템 + `/skill-creator` 안내 |
| "설정 바꾸고 싶어" | settings.json + `/update-config` 안내 |
| "플랜 모드 어떻게?" | 플랜 모드 |
| ".claude 뭐가 있어?" | .claude 폴더 맵 |
| "문서 만들 때 이름?" | → `/suji-doc-structure`로 안내 |

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-doc-structure` | 프로젝트 문서 네이밍. claude-guide는 .claude 체계 안내 |
| `/suji-kb` | KB 시스템 운영. claude-guide에서 스킬 설명 시 참조 |
