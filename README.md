# Suji Agent Skills

Claude Code 업무 자동화 스킬 — Confluence 퍼블리싱, 주간보고, BM 동기화, 프로젝트 문서 관리.

## Install

```
/plugin marketplace add suji-cho/suji-skills
```

```
/plugin install suji-skills@suji-skills
```

Or browse and install interactively:
1. Run `/plugin` and select `Browse and install plugins`
2. Select `suji-skills`
3. Select `Install now`

## Usage

```
/suji-confluence-publish   # ~/work/drafts 파일을 Confluence에 업로드
/suji-cto-weekly-report    # CTO 주간보고 자동 수집 → 초안 생성 → 업로드
/suji-bm-sync              # BM 보고서에 Gmail·GitHub 현황 동기화
/suji-biz-weekly           # 제품 문의 대응 주간 현황 리스트 갱신 (Gmail 확인→v1.3 점수→코드블록 출력)
/suji-competitor-sync      # ODL 경쟁사 지표 Confluence 페이지 즉시 갱신
/suji-medium-sync          # ODL Medium+Github 페이지 즉시 갱신
/suji-doc-structure        # 프로젝트 문서 생성·정리·진단
/suji-claude-guide         # Claude Code 프로젝트 체계 안내
/suji-ppt-light-purple     # 라이트 배경 + 인디고(#200066) 액센트 한컴 공식 톤 PPTX 생성
/suji-ppt-dark-orange      # 다크 배경 + 주황(#FC5E20) 단독 액센트 + 그레이 모노톤 CEO 보고용 PPTX 생성
/suji-ppt-dark-trio        # 다크 배경 + 주황(#DD5C28) 주조 + 블루·에메랄드 서브 2색 글로벌 파트너 제안용 PPTX 생성
/suji-ppt-light-trio       # 라이트 배경 + 주황(#E8500F) 주조 + 블루·에메랄드 서브 2색 글로벌 파트너 제안용 PPTX 생성
/suji-ppt-dark-premium     # 다크 프리미엄(Linear/Notion 톤) PPTX — HTML 렌더 배경 + 네이티브 편집 하이브리드, 인디고(#A9B2FF) 단일 액센트
/suji-ppt-light-premium    # 라이트 프리미엄(29CM/Stripe 톤) PPTX — dark-premium의 라이트 변종, 인디고(#5B63D6) 단일 액센트
```

## Auto-Update

```
/plugin marketplace update suji-skills
```

Or enable auto-update permanently in `~/.claude/settings.json`:

```json
{
  "marketplaceAutoUpdate": {
    "suji-skills": true
  }
}
```

## Uninstall

```
/plugin uninstall suji-skills@suji-skills
/plugin marketplace remove suji-skills
```

## Skills

| Skill | Description |
|:------|:------------|
| [suji-confluence-publish](./skills/suji-confluence-publish) | ~/work/drafts 파일을 Confluence에 업로드 — 제목 컨벤션, 500px 중앙 레이아웃, frontmatter 제거 자동 적용 |
| [suji-cto-weekly-report](./skills/suji-cto-weekly-report) | CTO 주간보고 작성 — competitor_tracker·PyPI·BM 보고서 데이터 자동 수집, 템플릿 기반 초안, Confluence 업로드 |
| [suji-bm-sync](./skills/suji-bm-sync) | BM 보고서 동기화 — Gmail BIZ contact 신규 메일, GitHub Issues 미대응 현황, 회신 대기 일수를 Confluence에 자동 반영 |
| [suji-biz-weekly](./skills/suji-biz-weekly) | 제품 문의 대응 주간 현황 리스트 갱신 — Gmail OSS/BIZ contact 라벨 확인, 신규 문의·회신 반영, criteria v1.3 점수 산정, 대기일 재계산, 고정 코드블록 양식 출력 |
| [suji-competitor-sync](./skills/suji-competitor-sync) | ODL 경쟁사 지표 페이지 즉시 갱신 — competitor_tracker GitHub Actions 수동 trigger + watch + 결과 보고 |
| [suji-medium-sync](./skills/suji-medium-sync) | ODL Medium+Github 페이지 즉시 갱신 — medium_confluence_sync GitHub Actions 수동 trigger + watch + 결과 보고 |
| [suji-doc-structure](./skills/suji-doc-structure) | 프로젝트 문서 관리 — HANDOFF/design/TODO 등 표준 문서명 선택, 폴더 구조 세팅, 문서 간 연결 규칙 적용 |
| [suji-claude-guide](./skills/suji-claude-guide) | Claude Code 체계 안내 — .claude 폴더 구조, 메모리 시스템, 스킬 만들기, settings.json, 플랜 모드 가이드 |
| [suji-ppt-light-purple](./skills/suji-ppt-light-purple) | 라이트 배경 + 딥 인디고(#200066) 액센트의 한컴 공식 톤 PPTX 생성 — Pretendard 폰트, 패턴 A~T 카탈로그, Phase 1/2 게이트 |
| [suji-ppt-dark-orange](./skills/suji-ppt-dark-orange) | 다크 배경 + 주황(#FC5E20) 단독 액센트 + 그레이 4단조의 CEO·임원 보고용 모노톤 PPTX 생성 — Pretendard, 거대 타이포 표지·PART 챕터 디바이더·수치 비교 행 시그니처 패턴 |
| [suji-ppt-dark-trio](./skills/suji-ppt-dark-trio) | 다크 배경 + 주황(#DD5C28) 주조 + 스카이블루(#4A8FE0)·에메랄드(#34C77B) 서브 2색의 글로벌 파트너 제안용 PPTX — 중첩 보더 카드 시그니처, 패턴 A~T 공유 + trio 고유 U~Z |
| [suji-ppt-light-trio](./skills/suji-ppt-light-trio) | 라이트 배경 + 주황(#E8500F) 주조 + 스카이블루(#2E72C8)·에메랄드(#1FA968) 서브 2색의 글로벌 파트너 제안용 PPTX — dark-trio의 라이트 변종, 색·명도 토큰만 반전 |
| [suji-ppt-dark-premium](./skills/suji-ppt-dark-premium) | 다크 프리미엄(Linear·Notion 톤) PPTX — **하이브리드**: HTML/CSS 렌더 다크 글로우 배경(에셋) + pptxgenjs 네이티브 텍스트·차트(PowerPoint 편집 가능). 큰 타이포 + 인디고(#A9B2FF) 단일 액센트, waterfall·price ladder·동심원 컴포넌트. 경영 보고·임팩트 |
| [suji-ppt-light-premium](./skills/suji-ppt-light-premium) | 라이트 프리미엄(29CM·Stripe 톤) PPTX — dark-premium의 라이트 변종(색·배경·로고만 반전). 흰 배경 + 미세 그림자 + 인디고(#5B63D6) 단일 액센트. 공식 보고·인쇄 친화 |

### suji-confluence-publish

~/work/drafts 마크다운 파일을 Confluence에 퍼블리싱하는 파이프라인.

- 제목 컨벤션: 파일명에서 `.md`만 제거 (`yyyymmdd_제목`)
- 500px 중앙 레이아웃 + 테이블 왼쪽 정렬 자동 적용
- Frontmatter·HTML 주석 자동 제거
- `[확인 필요]` 플레이스홀더 체크
- 업로드 전 사용자 승인 필수

### suji-cto-weekly-report

CTO 주간보고를 데이터 수집부터 Confluence 업로드까지 자동화.

- 이전 주 보고서 자동 참조 (Confluence folder ID 기반)
- BM 보고서, competitor_tracker/history.json, PyPI 통계, X 포스트 지표 자동 수집
- 5개 섹션 템플릿: 트래픽, 경쟁사, 비즈니스, PR, 외주
- 사용자 검토·보완 후 Confluence 업로드
- 제목 형식: `yyyymmdd 연구소 주간보고`

### suji-bm-sync

Confluence BM 보고서에 최신 비즈니스 현황을 동기화.

- Gmail BIZ contact 라벨에서 신규 메일 확인
- GitHub Issues 미대응 현황 수집
- 회신 대기 일수 자동 계산
- 변경 사항 표시 → 사용자 승인 → Confluence 업데이트
- 6단계 워크플로우, 쓰기 전 승인 게이트 포함

### suji-competitor-sync

OpenDataLoader+PDF 경쟁사 지표 Confluence 페이지를 즉시 최신 상태로 동기화.

- 스케줄(매일 KST 09:00) 안 기다리고 당장 갱신
- `gh workflow run competitor-tracker.yml` → watch → 결과 보고
- 페이지 lastModified 확인 + 핵심 수치(ODL stars 증감) 발췌
- 실패 시 에러 라인 자동 추출 + 진단 진행 여부 확인

### suji-medium-sync

OpenDataLoader Medium 발행 내역과 Github 상관관계 페이지를 즉시 최신 상태로 동기화.

- 스케줄(매일 KST 10:00) 안 기다리고 당장 갱신
- `gh workflow run sync-medium.yml` → watch → 결과 보고
- daily/init 모드 지원 (기본 daily, 전체 재수집 시 init)
- 실패 시 에러 라인 자동 추출 (Medium RSS·Confluence API 문제 식별)

### suji-doc-structure

프로젝트 폴더의 문서를 생성·정리·진단.

- 8개 표준 문서명 (HANDOFF, design, STATUS, TODO, NEXT, CHANGELOG, RUNBOOK, BRIEF)
- 문서 선택 플로우차트 + 문서 간 연결 규칙
- `~/Workspace/work/` 폴더 구조 정의 (drafts/research/todo/weekly_report)
- 프로젝트 라이프사이클별 문서 요구사항
- 폴더 진단 리포트 생성

### suji-claude-guide

Claude Code 프로젝트 체계에 대한 레퍼런스 가이드.

- `.claude` 폴더 구조 맵
- CLAUDE.md 역할과 작성법
- 메모리 시스템 (user/feedback/project/reference/doc 타입, MEMORY.md 인덱스)
- 스킬 시스템 (`suji-` 접두사, frontmatter 규격)
- 플랜 모드, settings.json 설정

### suji-ppt-light-purple

라이트 배경 + 딥 인디고(#200066) 액센트의 한국 기업·공식 컨퍼런스 톤 PPTX 생성.

- LAYOUT_WIDE (13.33"×7.5") 캔버스, Pretendard 폰트 5단계
- 인디고/진보라/라일락/그레이 4톤 팔레트, 본문 텍스트 #000000 기본
- 패턴 A~T 카탈로그 (`references/layout-patterns.md`) — 표지/섹션/그리드/카드/넘버/비교/목업 망라
- 한컴 deck 분석 기반 두 가지 고유 패널 추가: 3컬럼 환경 진단 카드, Pain Point/Workflow/Key Feature 패널
- 자매 스킬 `bundo-skills:bundo-ppt-ember`(다크+주황)와 패턴 호환, 토큰만 다름
- Phase 1(시나리오 설계) ↔ Phase 2(PPTX 생성) 사이 사용자 확인 게이트 필수

### suji-ppt-dark-orange

다크 배경 + 주황(#FC5E20) 단독 액센트 + 그레이 4단조의 CEO·임원 보고용 모노톤 PPTX 생성.

- LAYOUT_WIDE (13.33"×7.5") 캔버스, Pretendard ExtraBold/Regular 2-tone 중심
- 흑(#000000) + 카드 다크(#1A1A22/#2A2A33/#3A3A45) + 주황 단독 + 그레이 4단(#B0BEC5/#8A8F99/#5A5F69) — 다채로움 절제, 모노톤 정체성
- 한컴 CEO deck 분석 기반 4가지 시그니처 패턴 추가:
  - 거대 타이포 표지 (THE 30pt + SHIFT 64pt 겹침)
  - PART 챕터 디바이더 (전면 다크 + 작은 주황 PART 라벨 + 거대 44pt 흰 제목)
  - 수치 비교 행 (현재값 그레이 → 화살표 주황 → 미래값 주황 + CAGR 알약 칩)
  - 카테고리 카드 3단 (영문 9ptB + 한글 20ptB + 설명 14pt 세로 스택)
- 챕터 칩 헤더 (좌상단 #2A2A33 박스 + 번호 + "PART N ┃ 섹션명" 라벨) 시그니처
- 자매 스킬 ember(다채로움) / light-purple(라이트 인디고)와 패턴 카탈로그(A~T) 공유, 토큰만 다름
- QA: 본문 텍스트가 흰색/B0BEC5만 사용했는지, 주황 객체가 슬라이드당 3개 이하인지 우선 검수

### suji-ppt-dark-trio

다크 배경 + 주황(#DD5C28) 주조색 + 스카이블루(#4A8FE0)·에메랄드(#34C77B) 서브 2색의 글로벌 파트너 제안용 PPTX 생성.

- 한컴 정체성(주황) 유지 + 서브 2색으로 듀얼 비교·KPI·노드 카테고리 색-코딩
- **중첩 보더 카드** 시그니처 패턴 (외곽 보더 + 내부 컨텐츠 카드 구조)
- 모듈러 스케일 1.25 기반 폰트 (표지 70pt, THANK YOU 88pt, 디바이더 56pt)
- 자매 스킬과 패턴 카탈로그 A~T 공유 + trio 고유 패턴 U~Z 추가
- 3-Phase Cycle (Double Diamond) + Gate별 자가 비평 루틴(I Like/I Wish/What If)
- 자매 스킬: `dark-orange`(CEO 단정 보고), `light-purple`(공식 기업 제안), `bundo-ppt-ember`(컨퍼런스 활기)

### suji-ppt-light-trio

`suji-ppt-dark-trio`의 라이트 버전 — 밝고 신뢰감 있는 흰 배경 글로벌 파트너 제안용 PPTX 생성.

- 같은 3색 시스템·중첩 보더·이탤릭 금지 정체성 유지, 흰 배경 가독성을 위해 3색을 살짝 진하게 조정 (#E8500F / #2E72C8 / #1FA968)
- dark-trio와 패턴(A~T, U~Z)·구조를 100% 공유, 색·명도 토큰만 라이트로 반전
- 동일한 3-Phase Cycle + Gate 자가 비평 루틴 적용

## More

- [What are skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [How to create custom skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Agent Skills standard](http://agentskills.io)

## License

MIT
