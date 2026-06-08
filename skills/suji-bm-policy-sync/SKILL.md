---
name: suji-bm-policy-sync
description: ODL BM 정책·라벨 정의 동기화 (정책 미러 전담). Confluence 가이드라인 페이지 「비즈니스 흐름」·「사업성 및 우선순위 평가 기준」을 SoT로, 승인된 정책 변경을 두 페이지에 publish(🛡️ 매크로 보존)하고 BM CRM 코드(labels.ts)·로컬 문서(HANDOFF·SPEC·cases.json)·인포그래픽에 단방향 미러한다. 점수 산정·메일 분류 없음(BM CRM 앱 담당). 수동 호출.
---

# /suji-bm-policy-sync (v1.0)

ODL BM 거버넌스 **정책·라벨 정의**를 단일하게 유지하기 위한 동기화 스킬.
가이드라인 Confluence 2개 페이지(「비즈니스 흐름」·「사업성 및 우선순위 평가 기준」)를 SoT로 두고,
정책 변경이 발생하면 **10영역 동기화 사이클**을 따라 전파한다.

> **구 `/suji-bm-sync`에서 분리·역할 축소 (2026-06-08):**
> - ❌ **제거:** Gmail OSS/BIZ contact 메일 수집·분류 · 점수 산정(운영 v2.1 + 사업성 v1.2 계산) · 케이스 데이터 write
>   → 모두 **BM CRM 앱(Phase 0b: Gmail OAuth · DB 점수 로직)**으로 이전.
> - ✅ **유지·강화:** 정책·라벨 정의 미러 · C·D publish · 🛡️ 인포그래픽 매크로 보존 · 10영역 동기화.
> - 구 `/suji-bm-sync`(v2.1)는 제거하지 않고 동결(Phase 0b 완성 전 fallback). 이 스킬과 병행 존재.

## 트리거

| 모드 | 진입 조건 | 동작 |
|---|---|---|
| **수동** | `/suji-bm-policy-sync` 직접 호출 | 정책 변경 감지 → diff → 승인 → 10영역 전파. 단계마다 사용자 응답 |
| (자동) | — | 자동 cron 미등록. 정책 변경은 빈번하지 않아 수동 호출 원칙 |

## SoT 모델 (재배치 후)

| 영역 | SoT | 이 스킬의 역할 |
|---|---|---|
| **C·D 가이드라인** (정책·라벨 정의) | **Confluence** | ✅ publish + 미러 (본 스킬 핵심) |
| **A·B·E 운영 데이터** (케이스·현황) | **DB** (BM CRM 앱) | ❌ 범위 밖 — 앱이 DB→Confluence publish |
| **코드 라벨** `src/lib/labels.ts` | Confluence C·D mirror | ✅ 미러 대상 |

> 케이스 데이터는 DB 단일 SoT. 이 스킬은 **정책·라벨 정의만** 다룬다. 케이스 점수·상태·메일은 건드리지 않는다.

## 대상 페이지

| 페이지 | 페이지 ID | 제목 | 본 스킬 |
|---|---|---|---|
| **C** | `2151056014` | 비즈니스 흐름 | ✅ 정책 변경 시 publish (매크로 보존, att 첨부됨) |
| **D** | `2151187100` | 사업성 및 우선순위 평가 기준 | ✅ 정책 변경 시 publish (매크로 보존, att 첨부됨) |
| A·B·E | 2151612650 · 2151023092 · 2151056039 | 현황·보고·매핑 | ❌ BM CRM 앱(DB→publish) |

- **Cloud ID:** `https://hancom.atlassian.net` · **Space:** OSS1 (`1342242976`) · **폴더:** `2131364742`
- 기존 페이지 `2068480560`(팀장님 사용)는 **건드리지 않음**.

## 10영역 동기화 사이클 (정책 변경 시 의무 체크리스트)

정책·라벨 정의가 바뀌면 아래 10개를 **모두** 정합시킨다. (HANDOFF FOLLOWUP 기준)

1. [ ] **Confluence C 「비즈니스 흐름」** publish (🛡️ 매크로 보존, PUT 후 검증)
2. [ ] **Confluence D 「사업성 및 우선순위 평가 기준」** publish (🛡️ 매크로 보존, PUT 후 검증)
3. [ ] **HANDOFF.md** (`dashboard/HANDOFF.md`) — 라벨·상태
4. [ ] **SPEC.md** (`dashboard/SPEC.md`) — enum + zod + §2 표 + 변경 이력
5. [ ] **cases.json** (`dashboard/src/lib/seed/cases.json`) — prefix·group·stage
6. [ ] **본 스킬** `/suji-bm-policy-sync` (라벨 사전 갱신)
7. [ ] **`/suji-confluence-publish`** 스킬 (구 라벨 잔존 확인)
8. [ ] **`src/lib/labels.ts`** (BM CRM 레포 — 코드 SoT 미러)
9. [ ] **페이지 C·D 인포그래픽 PNG** 재렌더 + 캐노니컬 교체 + Confluence 첨부 재업로드
10. [ ] **BM CRM 앱 화면** — 신 라벨 선별 치환 + 톤 가드 통과

## 워크플로

### Step 1. 정책 변경 입력 식별
변경 출처를 명확히 한다: (a) 거버넌스 결재 패키지(예: #8) · (b) Confluence C·D 직접 수정 · (c) 로컬 정의 문서 갱신.
변경 항목을 라벨/흐름 단위로 나열 (Stage·Status·Group·Prefix·B2X·Priority·Cold Gate·임계일).

### Step 2. 현재 상태 파싱 + diff 생성
- C·D 본문(`body.storage`) GET → 현재 정의 추출.
- labels.ts·SPEC enum·cases.json prefix와 대조.
- 변경 diff를 **파일로** 생성([feedback_bm_sync_display] — 팝업에 긴 줄글 X). 영역별 before→after.

### Step 3. 사용자 승인
`AskUserQuestion` selectable UI로 받는다 (전체 승인 / 항목별 조정 / 항목별 거부 / 전체 거부).
**라벨·비즈니스 흐름 임의 변경 금지** — 승인된 정의만 반영. SoT를 거꾸로 침범하지 않는다.

### Step 4. Confluence C·D publish (🛡️ 매크로 보존)
승인된 정의 텍스트만 교체. 인포그래픽 `<ac:image>` 매크로는 **그대로 보존** (아래 보존 룰 의무 적용).
PUT 후 `<ac:image>` 잔존 검증. 회귀 시 즉시 복구.

### Step 5. 코드·문서·시드 미러
labels.ts·HANDOFF·SPEC·cases.json에 신 라벨 단방향 반영. 버전 스탬프 갱신(C vN·D vN).

### Step 6. 인포그래픽 PNG 재렌더 (필요 시)
정의 변경이 인포그래픽에 영향을 주면 HTML+Playwright 재렌더 → attachment 새 버전 업로드. (본문 매크로는 변경 X)

## 🛡️ 인포그래픽 매크로 보존 룰 (구 bm-sync v2.1.1 계승 — 절대 준수)

페이지 C·D 본문 갱신 시 **첨부된 인포그래픽 매크로가 placeholder로 회귀되는 사고**를 방지한다.

**보존 워크플로 (의무):** C·D body PUT 전,
1. **GET body.storage** — 현재 본문 가져오기
2. **인포그래픽 섹션 식별** — `<h2>🎨 인포그래픽</h2>` 다음 첫 단락
3. **첨부 판정:** `<ac:image>` + `<ri:attachment ri:filename=...>` → **실제 첨부됨, 보존** / panel·placeholder → 갱신 대상
4. **본문 갱신:** 정의 텍스트(11단계 표·cold 게이트·Partnership/Marketing 트랙·점수 모델)만 교체. 인포그래픽 헤더 다음 단락은 원본 그대로 재삽입
5. **PUT 후 검증:** `<ac:image>` 잔존 확인. 회귀 시 즉시 복구

```python
import re
m = re.search(
    r'(<h2>[^<]*인포그래픽</h2>)(<p>[^<]*<ac:image[^<]*<ri:attachment[^<]*</ac:image>[^<]*</p>)',
    body, flags=re.DOTALL)
if m:
    image_section = m.group(2)  # 보존, 최종 PUT 시 그대로 삽입
```

**금지 (회귀 유발):** ❌ body 전체 새로 만들어 PUT · ❌ 이미지 자리에 placeholder 텍스트 · ❌ 인포그래픽 헤더 다음 빈 단락
**예외:** 인포그래픽 신규 생성(첨부 없음) → placeholder 가능 · PNG 자체 갱신은 attachment 새 버전(`POST /child/attachment/{id}/data`, body 변경 X)

## 라벨 사전 (가이드라인 라벨 — 임의 명명 금지)

> 정의 SoT = Confluence C·D. 아래는 #8 거버넌스 결재(2026-06-04) 반영 현행 라벨. 변경은 결재 후에만.

- **Stage 4그룹:** 인입·평가 / 기초 검증 / 협상·증명 / 계약·운영 (+ cold + Partnership 별도 트랙)
- **Cold 통합 (#8):** 구 "이탈" → **cold** rename · 구 Group "종료(배제)" → **cold** 통합 · 게이트 → **cold 게이트** (#1~#4) · "실패" 프레이밍 전면 제거(중립화)
- **Cold sub-prefix 5종:** `[Cold-1차판단]` · `[Cold-무응답]` · `[Cold-PoC]` · `[Cold-MSA]` · `[주요 콜드 라인업]`
- **Prefix 재정의:** `[콜드 메일 라인업]` → `[주요 콜드 대상]` · `[이어갈 요구사항 없음]` → `[일반 cold]`
- **종료 2축:** 계약 전 퍼널 종료(Closed Lost) = **cold** / 계약 후 종료(Churn) = **계약 종료**
- **임계일:** B2G·B2E **120일** (구 180) · SaaS B2B 90일 · SMB 60일
- **점수 모델 v1.3 (정의만 미러, 계산은 앱):** 4축 — 수익률 30 · 네임밸류 35 · 확산력 15 · 실행 가능성 20
- **MSA → 주계약서(Master Service Agreement)** 풀어쓰기

🛡️ **보존(변경 금지):** "모든 이탈은"(동사 문맥) · Closed Lost(영문 표준) · 종료(동사: 통보/임계/무응답) · 역사 changelog · ExitGate 코드 타입

## 주의 사항

- **변경 전 확인 필수.** 모든 정의 변경은 diff 파일 + 사용자 승인 후에만 Confluence·코드 반영.
- **라벨·비즈니스 흐름 임의 변경 금지.** 시안·기획 작업이 SoT를 거꾸로 침범하지 않는다.
- **매크로 보존이 최우선.** C·D publish 시 보존 룰 위반 = 회귀 사고. PUT 후 항상 검증.
- **점수·메일은 범위 밖.** 케이스 점수 산정·메일 분류 요청이 오면 BM CRM 앱(Phase 0b)으로 안내.
- **수동 작업 투명성.** 인포그래픽 PNG 재렌더 등 자동화 안 되는 항목은 미리 알리고 사유 설명.
- **모르면 모른다.** 정의가 불명확하면 추정하지 말고 Confluence C·D 원문 또는 결재 패키지 확인.

## 참조 자료

- **BM CRM 프로젝트 SoT:** `~/Workspace/work/outputs/odl_business/dashboard/{HANDOFF,SPEC,TODO,README}.md`
- **구축 레포(labels.ts):** `~/Workspace/work/project/project_todo/bm-crm/`
- **DB 스키마:** `dashboard/db/SCHEMA_DESIGN.md`
- **구 스킬(동결):** `/suji-bm-sync` (v2.1, 메일·점수 포함 — Phase 0b 전 fallback)
- **publish 공통 규칙:** `/suji-confluence-publish`
- **거버넌스 결재 #8:** `dashboard/HANDOFF.md` "FOLLOWUP 트랙"

## 변경 이력

### v1.0 (2026-06-08) — `/suji-bm-sync`에서 분리·신규
- 정책 미러 전담으로 신설. 메일 수집·분류 + 점수 산정 제거(BM CRM 앱 이전).
- C·D publish + 🛡️ 매크로 보존 룰 계승 + 10영역 동기화 사이클 명문화.
- #8 거버넌스(cold 통합·sub-prefix 5종·120일·점수 v1.3) 라벨 사전 반영.
