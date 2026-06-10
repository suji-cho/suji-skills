---
name: suji-bm-sync
description: ODL BM 인바운드 리드 동기화. Gmail OSS/BIZ contact 라벨에서 신규·갱신 메일을 수집하고, 운영 기준 v2.2 + 사업성 v1.3을 적용해 5개 Confluence 페이지(A 대시보드·B 보고용·C 흐름·D 기준·E 매핑)를 갱신한다. 수동 호출 + 매일 08:00 cron 자동 실행.
---

# /suji-bm-sync (v2.2)

OpenDataLoader BM 인바운드 리드를 매일 아침 트리아지하기 위한 동기화 스킬.
Gmail OSS/BIZ contact 라벨을 단일 데이터 소스로 5개 Confluence 페이지(A·B·C·D·E)에 반영한다.
운영 기준 v2.2(Stage 11+Partnership · **Status 6값** · 프리픽스 12 + Cold sub-prefix · **cold 게이트 4** · **그룹 진행 중/주요 콜드/일반 cold**)와
사업성 v1.3(**4축 30/35/15/20 + 실행 가능성** + 자동 +1 룰 + 지역 보정)을 적용해 모든 자동 산정값은 🔍 검토 태그로 표기,
사용자 승인 후에만 Confluence를 갱신한다.

> **🗄️ DB SoT 전환 (2026-06-09):** 케이스 데이터의 SoT는 **BM CRM DB(Postgres·Prisma, repo `bm-crm`)**. Confluence A·B·E는 DB의 외부 publish target(미러). 이 스킬의 산정·전이 로직은 유지하되, 정본 카운트·status·group·active_deal은 **DB가 최종 기준**. (구 "Confluence A 파싱 = state" 모델 → DB read로 점진 전환. Phase 0b backend 연동 시 완성.)

## 트리거

| 모드 | 진입 조건 | 동작 |
|---|---|---|
| **자동** | cron 매일 08:00 | sync 후 변경 diff를 메모리/슬랙 push(가능 시), 승인 대기 큐 적재 |
| **수동** | `/suji-bm-sync` 직접 호출 | 인터랙티브 모드로 전체 단계 진행, 단계마다 사용자 응답 받음 |

## 대상 페이지 (5개)

| 페이지 | 페이지 ID | 제목 | 갱신 주기 |
|---|---|---|---|
| **A** | `2151612650` | [Live] 비즈니스 인바운드 현황 관리 | 매 sync (텍스트 + 섹션 0 ASCII art) |
| **B** | `2151023092` | [Live] 보고용 비즈니스 현황 요약 | 매 sync (텍스트) |
| **C** | `2151056014` | 비즈니스 흐름 | 정의 변경 시만 |
| **D** | `2151187100` | 사업성 및 우선순위 평가 기준 | 정의 변경 시만 |
| **E** | `2151056039` | 인바운드별 우선순위 매핑 상세 | 매 sync (텍스트·표) |

- **Cloud ID:** `https://hancom.atlassian.net`
- **Space:** OSS1, Space ID `1342242976`
- **폴더:** `2131364742`
- **기존 페이지 2068480560** (팀장님 사용)는 **건드리지 않음**.

## 데이터 소스

- **Gmail 라벨:** OSS/BIZ contact (Label ID `Label_4901978024770138907`) — ⚠️ 검색 쿼리는 **라벨명** `label:"OSS/BIZ contact"`만 동작. 라벨 ID 직접 쿼리는 빈 결과. (Step 2 참조)
- URL: `https://mail.google.com/mail/u/0/#label/OSS%2FBIZ+contact`
- **단일 소스**. GitHub Issues·대시보드 수치 등 다른 소스는 본 스킬에서 사용하지 않음 (BM 보고서 별도 흐름).

## 운영 기준 v2.1 (요약)

자세한 정의는 페이지 D 또는 `/Users/sujicho/Workspace/work/project/project_todo/bm-sync-redesign/HANDOFF.md` 섹션 3 참조.

### Stage (11 + Partnership 별도 트랙)

1. 인입(Prospecting) → 2. 1차 판단(Qualification) → 3. Sample(Free Sample Remediation) →
4. 기초 협상(Discovery) → 5. PoC → 6. Pilot 협상(Proposal) → 7. Pilot → 8. MSA 협상(Negotiation) →
9. Production → 10. Renewal·Upsell → 11. 이탈(Closed Lost·Churn)

Partnership 트랙: 인입 → 협의 → 합의 → 운영 (영업 깔때기 외)

### Status 6값 (2026-06-09)

DB enum `Status` 1:1. Stage(흐름 위치)와 별개의 "대화 상태" 축.

- **우리 차례** (ours · Blue 600) — 다음 외부 액션 우리
- **상대 차례** (theirs · Amber 600) — 우리 답신 후 상대 응답 대기. 임계 도달 시 자동 Cold
- **요구사항 확인 완료** (internal · Purple 600) — 외부 요구사항 파악 끝, 우리 내부 작업 중
- **우리 측 보류** (on_hold · Slate 400 · 2026-06-09 신규) — 고객 무응답 아님, 우리 측 로드맵·작업 대기로 정체
- **Cold** (cold · Cyan 600 · 2026-06-09 신규) — 계약 전 정체 (무응답·1차판단 등). 별도 종료 통보 X (Phase 0)
- **계약 종료** (closed · Slate 500) — **계약 후** 해지 전용. 계약 전엔 "종료" 없음 → 정체는 Cold, 우리 측 대기는 우리 측 보류 ([[feedback_odl_bm_cold_framing]])

> **active_deal(운영 중 딜):** 진행 중(active) 그룹에서 활발히 진전 중인 딜(샘플 평가→PoC·조건 합의→가격 결재 등)을 별도 boolean 플래그로 표시 — 임계 기다리는 수동 답변 대기와 구분. (예: Félix·Andrew Sauer)

### 프리픽스 12개 + Cold sub-prefix

진행 프리픽스 12개:
`[신규]` `[샘플처리 대기]` `[샘플 요청]` `[가격 답변 대기]` `[라이센스 답변 대기]`
`[기본 정보 요청]` `[기본 정보 답변 대기]` `[요구사항 논의 중]` `[스폰서십 제안 검토]`
`[요구사항 파악 완료]` `[PoC 응답 대기]` `[상세 정보 답변 대기]`

**Cold sub-prefix (사유 분류 · DB SoT 하이픈 표기):** `[Cold-1차판단]` `[Cold-무응답]` `[Cold-우리측보류]` `[Cold-PoC]` `[Cold-MSA]`
**cross-tag:** `[주요 콜드 대상]` (재engagement 가치 — 주요 콜드 분류)

> ⚠️ criteria v1.3·Cold 정책 v2 문서는 중점 표기(`[Cold·무응답]`)·`[주요 콜드 라인업]`을 사용 (표기 드리프트). DB·Confluence 정본 = 하이픈·`[주요 콜드 대상]`.

### cold 게이트 4개

- cold #1: 1차 판단 cold → 일반 cold 또는 미정
- cold #2: 기초 협상 cold (무응답 21일+ 페이지 A 가시화 → 산업·유형별 임계 도달 시 자동 cold)
- cold #3: PoC 평가 cold → 주요 콜드(재핑 가능)
- cold #4: 주계약서(MSA) 협상 cold → Lost·주요 콜드 후보

### 그룹 (DB CaseGroup 1:1 · 진행 중 / Cold 2-tier)

- **진행 중 (active)** — Stage 1~10 + Partnership. Status 우리/상대 차례·요구사항 확인 완료·우리 측 보류. active_deal 하위 플래그
- **주요 콜드 (major_cold)** — 재시도 후보 (`[주요 콜드 대상]`). 핵심 타겟·재engagement 가치
- **일반 cold (general_cold)** — `[Cold-1차판단]`·`[Cold-무응답]` (재engagement 가치 낮음)

## 사업성 v1.3 (요약)

자세한 산식은 페이지 D 또는 `/Users/sujicho/Workspace/work/outputs/odl_business/governance/criteria/v1.3_20260601/` 참조.

### 점수 모델 (100점 · cap 해제 시 100+)

- **수익률 30** (v1.2 45→30): 볼륨 15 + 조직 규모 15. *도입 긴급도·도입 의지는 축 4로 이전*
- **네임밸류 35** (유지): 조직 인지도 15 + 섹터 대표성 10 + 규제 시장 10
- **확산력 15** (v1.2 20→15): 섹터 파급 6 + 파트너 채널 5 + 규제 연쇄 4
- **실행 가능성 20** 🆕: 실현가능성 7 (6 sub-criteria — 규제·데이터통제·품질·처리량·비용) + 적극성 8 + 데드라인 5

> "지금 진행 가능한가?" 변별. 같은 사업성 점수라도 active_deal vs 보류 구분. `total_score`(v1.3 합산)는 cap 해제로 100+ 가능. `biz_score`(구모델)와 충돌 시 재산정 보류 = 운영 데이터 트랙(거버넌스).

### 컷오프

| 총점 | Priority | 대응 |
|---|---|---|
| 70~100 | 🟢 P1 | 24h 회신, PoC 즉시 검토 |
| 40~69 | 🟡 P2 | 48h 회신, 상세 파악 |
| 20~39 | ⚪ P3 | 1주 회신, 표준 안내 |
| <20 | ⚪ 미정 | 재질문 발송 |

### 자동 +1 단계 룰 (v1.2 신규)

조건: 섹터 대표성 ≥ 8 (ODL Phase 핵심 타겟) **AND** 총점 40~69 (P2 구간)
→ 자동 P2 → P1 상향, 사유 "ODL Phase 핵심 타겟 자동 상향"

**핵심 타겟:** B2E 미국 R1·중견 대학, B2G 미국 시·주·연방정부
**간접 핵심 타겟** (ADA SaaS·대학 SaaS 등)은 자동 룰 X, PM 수동 +1 가능

### 지역 보정 (v1.2 신규)

조직 인지도 산출 시:
- US·EU 일반 기업·기관 = 5점
- non-US/EU 일반 SMB (인도·동남아·중남미·중동 등) = 2점

### 비주류 섹터

출판, 법무, 일반 B2B SMB, non-US/EU 중소 조직 → 섹터 대표성 2점

## 데이터 모델 (케이스 단위)

```
id                  Thread ID
name                담당자
title               직무
country             국가
b2x                 B2B / B2G / B2E / B2C / Partnership / —
org                 소속명
phase               Phase 0/1/2/3 (사업 시간축, 헤더 표시용)
stage               11단계 + Partnership 트랙
status              우리 차례/상대 차례/요구사항 확인 완료/우리 측 보류/Cold/계약 종료 (6값)
prefixes            컨텍스트 프리픽스 list (12개 + Cold sub-prefix)
biz_priority        P1 / P2 / P3 / 미정 / Partnership
biz_score           0~100 (구모델 — head·list·KPI 표시용 유지)
total_score         v1.3 4축 합산 (cap 해제 100+) — 산정표·E 페이지 기준
auto_p_boost        자동 +1 적용 여부 (핵심 타겟 룰)
pm_p_adjust         PM +1 수동 조정 단계 (int) / pm_p_reason 사유
active_deal         운영 중 딜 (boolean · 진행 중 그룹 내 활발 진전)
key_cold_lineup     재engagement 가치 (boolean · 주요 콜드 cross-tag)
cold_reason         Cold 사유 (스트링)
last_inbound_date   상대 마지막 발신일
last_outbound_date  우리 마지막 발신일
last_action_date    max(둘 중)
waiting_days        오늘 - last_action_date
threshold_days      산업·유형별 자동 cold 임계 (B2G/B2E 120·SaaS 90·SMB 60)
threshold_remaining 임계까지 남은 일수 (도달 시 자동 cold)
context             1줄 컨텍스트 요약
next_action         우리 다음 액션
needs_review        🔍 검토 필요 여부
exit_gate           cold 시 #1/#2/#3/#4
group               진행 중(active) / 주요 콜드(major_cold) / 일반 cold(general_cold)
```

---

## 워크플로

### Step 1. 현재 페이지 파싱 (A · E)

```
mcp__claude_ai__getConfluencePage
  cloudId: https://hancom.atlassian.net
  pageId: 2151612650   # 페이지 A
  contentFormat: markdown
```

페이지 A에서 파싱:
- 섹션 0 ASCII art (현재 케이스 위치 분포)
- 섹션 1 카운트 표 (진행 중 N · 주요 콜드 M · 일반 cold J · 신규 평가 L · ↳ 운영 중 딜)
- 섹션 3 진행 중 케이스 Stage별 토글 내 케이스 리스트
- 섹션 4 주요 콜드 케이스
- 섹션 5 일반 cold 케이스
- 섹션 6 마케팅·미디어 (별도, 비-케이스)
- 섹션 7 Decision Log (최근 10건)

페이지 E에서 파싱:
- 각 케이스별 점수 산정 결과 + 자동/PM 조정 사유 + 최종 P

→ 메모리에 `cases_state_prev: list[CaseRow]` 적재.

### Step 2. Gmail BIZ contact 신규/갱신 메일 수집

```
mcp__claude_ai_Gmail__search_threads
  q: 'label:"OSS/BIZ contact" newer_than:35d'
```

> ⚠️ **라벨 쿼리 주의 (2026-05-27 검증):** **라벨명 쿼리 `label:"OSS/BIZ contact"`만 정상 동작**한다.
> 라벨 ID 직접 쿼리(`label:Label_4901978024770138907`)는 **빈 결과 `{}`를 반환**하므로 사용하지 말 것.
> 라벨명에 공백·슬래시가 있으므로 반드시 큰따옴표로 감싼다 (`label:OSS/BIZ-contact` 하이픈 치환형도 동작).

각 thread에 대해:
```
mcp__claude_ai_Gmail__get_thread
  thread_id: <ID>
```

수집 항목:
- thread ID, 참여자 이름·이메일·도메인
- 메시지 별 발신 방향(우리/상대) + 날짜
- 본문 요약(LLM)

→ `threads_now: list[Thread]` 적재.

**매칭:** thread ID로 `cases_state_prev`와 1:1 매칭. 신규 thread는 신규 리드 후보.

### Step 3. LLM 자동 처리

각 케이스(기존 + 신규)에 대해 다음을 자동 산정. 모든 자동값은 `needs_review=True` 표시.

#### 3-A. 신규 리드 평가

신규 thread → Gate 필터 → 점수 모델 → 자동 +1 룰 → 잠정 P

```
신규 thread
  ├─ Gate 필터
  │   ├─ PDF 무관·BM 범위 외·요구사항 부재 → [이어갈 요구사항 없음] · Stage 11 이탈 · 그룹 종료(배제)
  │   ├─ 정보 부족 → 미정 · Stage 1차 판단 · [신규]
  │   └─ 통과 → 점수 모델 진입
  │
  ├─ 점수 모델 (v1.3 · 4축)
  │   ├─ 수익률 30 (볼륨·조직 규모)
  │   ├─ 네임밸류 35 (인지도 + 지역 보정 + 섹터 대표성 + 규제)
  │   ├─ 확산력 15 (섹터 파급·파트너 채널·규제 연쇄)
  │   └─ 실행 가능성 20 (실현가능성 6 sub + 적극성 + 데드라인)
  │
  ├─ 자동 +1 룰 검사
  │   └─ 섹터 대표성 ≥ 8 + 총점 40~69 → P2 → P1, auto_p_boost=True
  │
  └─ Priority 매핑 → 70/40/20 컷오프
```

#### 3-B. 기존 케이스 Stage·Status 전이 추론

기존 케이스(`cases_state_prev`)에 대해 최근 메일 활동을 분석해 자동 전이:

| 전이 | 트리거 |
|---|---|
| Status 우리 → 상대 | 우리 발신 메일 감지 |
| Status 상대 → 우리 | 상대 응답 + 우리 액션 필요 |
| Status 우리 → 요구사항 확인 완료 | 외부 응대 끝 + 내부 작업 진행 단서 |
| Status 요구사항 확인 완료 → 우리/상대 | 내부 작업 완료 단서 + 외부 액션 단계 |
| Stage 다음 단계 | 단계별 진입 조건 충족 (`HANDOFF.md` 섹션 3-1) |
| Stage 11 이탈 진입 | 이탈 게이트 4개 중 하나 진입 조건 충족 |

> ⚠️ **발신 방향·실제 발송일 판정 주의 (2026-05-27 검증):** SENT 라벨 메시지라도 `toRecipients`가 **자기 주소(`open.dataloader@hancom.com`)이면 검토용 자기발송 초안**이며 **고객에게 실제 발송된 것이 아니다**. 동일 본문이 며칠 뒤 **실제 외부 주소로 다시 SENT**되는 패턴이 있으므로, `last_outbound_date`·대기일은 **실제 수신자 주소로 나간 메시지 날짜** 기준으로 산정한다. (예: 5/18 자기주소 검토본 → 5/21 실제 발송 = last_outbound 5/21)

#### 3-C. 프리픽스 자동 판정

12개 프리픽스 사전(`HANDOFF.md` 섹션 3-3) 기준 메일 본문·컨텍스트 매칭. 다중 프리픽스 허용.

#### 3-D. Stale 감지 (무응답 트래킹 + 임계 자동 cold)

- `waiting_days >= 21` + `status == 상대 차례` → 페이지 A 무응답 트래킹 표 가시화 (임계 미달도 모니터). `threshold_remaining` 표시.
- `waiting_days >= threshold_days`(산업·유형별: B2G/B2E 120·SaaS 90·SMB 60) **AND** 마지막 발신=우리 → **자동 Cold**(`status=Cold`·`group=일반 cold`·`[Cold-무응답]`), `exit_gate=#2`. 재engagement 가치 시 `[주요 콜드 대상]`·`group=주요 콜드`.
- 보조 룰(v1.3): `적극성 ≤ 2 + 무응답 60일+` → 임계 미달이어도 자동 Cold.
- ⚠️ "Active 어수선하니 임의로 cold" 수동 디클러터 **금지** — 무응답 Cold는 임계/보조 룰 트리거로만 (Cold 정책 v2 §11).

#### 3-E. Next Action 제안

Status가 `우리 차례` 또는 `요구사항 확인 완료`인 케이스만:
- 우리 차례 → 외부 액션 (답신·자료 송부·미팅 제안)
- 요구사항 확인 완료 → 내부 작업 항목 (Sample 처리·라이센스 정리·로드맵 검토 등)

#### 3-F. 그룹 자동 분류

```
if status == Cold:                          # 계약 전 정체
    group = 주요 콜드   if key_cold_lineup (재engagement 가치)  # [주요 콜드 대상]
    group = 일반 cold  otherwise            # [Cold-1차판단]·[Cold-무응답]
else:                                        # 우리/상대 차례·요구사항 확인 완료·우리 측 보류
    group = 진행 중 (active)                 # active_deal·Partnership 트랙 포함
```

> "종료"는 계약 후 전용(현재 0건). 계약 전 정체는 모두 Cold. 우리 측 보류(on_hold)는 진행 중 그룹 유지(고객 무응답 아님).

### Step 4. 변경 diff 생성

`cases_state_prev` vs `cases_state_now` 비교:

```
## 변경 diff (YYYY-MM-DD)

### 신규 리드 (N건) 🔍
- [이름] [조직] · 수익(??) + 네임(??) + 확산(??) = ??점 → P? 제안
  - 자동 +1: Yes/No (사유: ODL Phase 핵심 타겟)
  - 그룹: Active

### Stage 전이 (M건) 🔍
- [이름]: 기초 협상 → PoC (사유: ...)

### Status 전이 (K건) 🔍
- [이름]: 상대 차례 → 우리 차례 (사유: 5/19 신규 응답 수신)

### 프리픽스 변경 (L건) 🔍
- [이름]: [기본 정보 답변 대기] → [요구사항 논의 중]

### Stale·cold 진입 (P건) 🔍
- [이름]: 상대 차례 + 무응답 임계 도달 → 자동 Cold (cold #2 · [Cold-무응답]) / 재engagement 가치 시 [주요 콜드 대상]

### Next Action 제안 (Q건) 🔍
- [이름]: 답신 작성 + 가격 안내 첨부

### 그룹 이동 (R건) 🔍
- [이름]: 진행 중 → 주요 콜드 / 일반 cold (또는 재응답 시 Cold → 진행 중 복귀)
```

모든 항목에 `🔍 검토` 표기. 항목별 인덱스(`[1]`, `[2]`...) 부여해 사용자가 선택적으로 거부 가능하도록.

### Step 5. 사용자 승인

`AskUserQuestion`을 활용해 다수 결정은 selectable UI로 받는다.

**옵션 (multiSelect):**
- 전체 일괄 승인
- 항목별 조정 (해당 인덱스 입력 → 수정값 받기)
- 항목별 거부 (해당 인덱스 입력 → diff 적용 X)
- 전체 거부

수동 모드: 매 항목 직접 확인 가능
cron 모드: 위험도 낮은 항목(프리픽스·Next Action·waiting_days 갱신)은 자동 적용, 위험도 높은 항목(Stage 전이·이탈 진입·신규 P 산정)은 승인 대기 큐 적재 후 사용자에게 push

### Step 6. Confluence 갱신

승인된 변경만 반영.

#### 6-A. 페이지 A `[Live] 비즈니스 인바운드 현황 관리` (매 sync)

```
mcp__claude_ai__updateConfluencePage
  cloudId: https://hancom.atlassian.net
  pageId: 2151612650
  title: "[Live] 비즈니스 인바운드 현황 관리"
  versionMessage: BM Sync (YYYY-MM-DD HH:MM)
  contentFormat: markdown
  body: (전체 8섹션 재생성)
```

8섹션 구조:

```
📌 헤더
   - 현재 Phase · 동기화 일시 · 다음 자동 (08:00)
   - 데이터: Gmail OSS/BIZ contact 라벨
   - 🔍 검토 대기: N건
   - 🔗 연관 페이지 (B·C·D·E)

🌊 0. 비즈니스 흐름 내 고객 위치 (ASCII art, 매 sync 자동 갱신)
   - 11단계 + Partnership 박스
   - 각 단계 박스 안에 케이스 이름 리스트 + 카운트
   - 단계 간 화살표

📊 1. 오늘의 즉답 패널
   1-1. 카운트 표 (진행 중 N · ↳ 운영 중 딜 · 주요 콜드 M · 일반 cold J · 신규 평가 L · 합계)
   1-2. 🚨 오늘 회신(우리 차례) / 🔥 운영 중 딜 / ⚠️ 무응답 트래킹(임계까지 남은 일수)

🆕 2. Triage Queue (1차 판단 대기)
   이름·조직 · 수신일 · Gate · 잠정 점수 · 잠정 P

🔵 3. 진행 중 케이스 (Stage별 토글)
   1차 판단 / Free Sample / 기초 협상 / PoC / Pilot 협상 /
   Pilot / 주계약서(MSA) 협상 / Partnership (Alisa·TEUM)

🟣 4. 주요 콜드 (재시도 후보 [주요 콜드 대상])

⚪ 5. 일반 cold [토글 기본 접힘]

🎯 6. 마케팅·미디어 (별도, 비-케이스)

✅ 7. Decision Log (최근 10건)

🟦 8. md 줄글 (복붙용 — 보고·메시지)
```

**섹션 0 ASCII art 포맷 예시:**

```
인입 [n] → 1차 판단 [2] → Sample [3] → 기초 협상 [7] → PoC [0] → Pilot 협상 [0] → Pilot [0] → MSA [0] → Production [0]
                            │              │
                            │              ├─ Atharva, Brian
                            ├─ Félix, David, Noah
                            │              ├─ Dragan, Sauer, Russell, Pratek, Timothy, Ray, Ken

Partnership: 협의 [2] (Alisa·TEUM) → 합의 [0] → 운영 [0]
⑪ cold [N]: 주요 콜드 [M] · 일반 cold [J]
🔥 운영 중 딜: Félix·Andrew Sauer
```

코드블록 안에 monospace로 렌더링. 인포그래픽 PNG는 별도 태스크(placeholder만 유지).

#### 6-B. 페이지 B `[Live] 보고용 비즈니스 현황 요약` (매 sync)

임원 push 요약, 텍스트 매 sync 자동 재생성:

```
mcp__claude_ai__updateConfluencePage
  pageId: 2151023092
  body: (Active 핵심 요약 + 콜드/종료 분포 + Phase 진행도 + P1 우선 + 복붙용 md 줄글)
```

#### 6-C. 페이지 C `비즈니스 흐름` (정의 변경 시만)

운영 기준 v2.2 정의 변경이 감지되면 갱신. 매 sync에서는 건너뜀.

- 11단계 정의·진입/전이 조건·주 담당·색 토큰
- cold 게이트 #1~#4 진입 조건·후속 처리 + Status 6값 연계 노트
- **파트너십·마케팅 공통 트랙** (탐색·협의·합의·운영 / Discovery·Engagement·Activation·Acceleration)
- 인포그래픽 매크로: 🛡️ 보존 룰 적용 (figure media `data-id=f72dd1d2…` 보존 — placeholder로 덮어쓰기 금지)

#### 6-D. 페이지 D `사업성 및 우선순위 평가 기준` (정의 변경 시만)

운영 기준 v2.2 + 사업성 v1.3 정의 변경 시만 갱신.

- 운영 기준 4종 v2.2 (Stage·**Status 6값**·프리픽스+Cold sub-prefix·**cold 게이트**)
- 점수 모델 (**30/35/15/20 4축** + 실행 가능성)
- 컷오프 + 자동 +1 룰 + 지역 보정 + 비주류 섹터 + Buyer Persona
- 우선순위 매핑 룰 (cap 해제)
- 검증표(v1.2 historical 병기) + 변경 이력 v1.0→v1.3 + 근거 자료
- 인포그래픽 매크로: 🛡️ 보존 룰 적용 (figure media `data-id` 보존 — D=`57bc335e…`)
- **Cold sub-prefix**: `[Cold-1차판단]` `[Cold-무응답]` `[Cold-우리측보류]` · cross-tag `[주요 콜드 대상]` (구 `[이어갈 요구사항 없음]`·`[콜드 메일 라인업]` 폐기)

#### 6-E. 페이지 E `인바운드별 우선순위 매핑 상세` (매 sync)

```
mcp__claude_ai__updateConfluencePage
  pageId: 2151056039
  body: (전체 케이스 점수 산정 표 재생성)
```

표 컬럼:
- 이름·조직 · 국가·B2X · Stage · 세부(수익률 30 / 네임밸류 35 / 확산력 15 / 실행 가능성 20) · 총점(total_score) · 잠정 P · auto_p_boost · pm_p_adjust · 사유 한 줄

자동 +1 적용 케이스는 행 강조. PM 조정 케이스는 사유 명기. Partnership(Alisa)은 파트너십·마케팅 모델(브랜드/리드/비용). 미산정(일반 cold gate·TEUM 보류)은 "—".

### Step 7. cron 자동 실행

#### 등록

```bash
# crontab -e
0 8 * * * cd ~/Workspace && /usr/local/bin/claude --skill suji-bm-sync --mode auto 2>&1 | tee -a ~/Workspace/work/project/project_todo/bm-sync-redesign/sync.log
```

또는 launchd plist (macOS 권장). 자동 모드에서는:
- 위험도 낮은 변경 자동 적용
- 위험도 높은 변경(Stage 전이·이탈 진입·신규 P)은 승인 대기 큐 적재
- 다음 수동 호출 시 큐 표시 + 일괄 승인 UI

#### 안전 장치

- 1일 1회 실행 보장 (락 파일 `/tmp/suji-bm-sync.lock`)
- 실행 중 오류 발생 시 Confluence 갱신 X, 로그만 기록
- 직전 5회 sync 결과를 `~/Workspace/work/project/project_todo/bm-sync-redesign/sync_history/` 에 보관
- 정의 페이지(C·D) 갱신은 항상 사용자 수동 확인 후

---

## 시각화 룰

| 페이지 | 시각화 | 갱신 |
|---|---|---|
| A 섹션 0 | ASCII art (코드블록 monospace) | 매 sync 자동 |
| A 1~7 | 텍스트·표·이모지 뱃지 | 매 sync 자동 |
| B | 텍스트 (복붙용) | 매 sync 자동 |
| C 흐름도 | 인포그래픽 PNG (`<ac:image>` 매크로, att2153153061) — 🛡️ 보존 룰 | 별도 태스크 — PNG 갱신은 attachment 새 버전 |
| D 점수 모델 | 인포그래픽 PNG (`<ac:image>` 매크로, att2151941196) — 🛡️ 보존 룰 | 별도 태스크 — PNG 갱신은 attachment 새 버전 |
| E 점수표 | 텍스트·표 | 매 sync 자동 |

**인포그래픽 PNG 갱신은 본 스킬 범위 외.** HTML+Playwright 렌더링 + `attachment API` 업로드 + storage format `<ac:image>` 교체는 별도 태스크에서 처리. 본 스킬은 placeholder만 유지하고 텍스트 정의만 갱신한다.

### 🛡️ 인포그래픽 매크로 보존 룰 (v2.1.1, 2026-05-20 추가)

페이지 C·D 본문 갱신 시 **이미 첨부된 인포그래픽 매크로가 placeholder로 회귀되는 사고**를 방지한다.

**문제 상황 (2026-05-20 발견):**
- 페이지 C (2151056014)에 `att2153153061` 첨부 + storage format `<ac:image>` 매크로로 임베드 완료 (v8)
- 그러나 외부 sync 호출로 본문이 재생성되며 매크로가 placeholder 텍스트로 회귀 (v7)
- 재 복구 후에도 동일 패턴 반복 우려

**보존 워크플로 (의무):**

페이지 C·D body PUT 전, 다음 순서로 처리한다.

1. **GET body.storage** — 현재 본문 가져오기
2. **인포그래픽 섹션 식별** — `<h2>🎨 인포그래픽</h2>` 다음 첫 단락 추출
3. **첨부 여부 판정**:
   - `<ac:image>` + `<ri:attachment ri:filename=...>` 패턴 → **실제 첨부됨, 그대로 보존**
   - panel-warning 또는 일반 placeholder 텍스트 → 갱신 대상
4. **본문 갱신 시**: 첨부된 매크로는 **건드리지 않는다**
   - 정의 텍스트(11단계 표·이탈 게이트·Partnership/Marketing 트랙)만 교체
   - 인포그래픽 헤더 다음 단락은 원본 그대로 다시 삽입
5. **PUT 후 검증** — `<ac:image>` 매크로 잔존 여부 확인. 회귀 시 즉시 복구

**Python 패턴 예시:**

```python
import re
# 1. body 가져옴
# 2. 인포그래픽 섹션 매칭
m = re.search(
    r'(<h2>[^<]*인포그래픽</h2>)(<p>[^<]*<ac:image[^<]*<ri:attachment[^<]*</ac:image>[^<]*</p>)',
    body,
    flags=re.DOTALL
)
if m:
    image_section = m.group(2)  # 보존
    # ... 정의 섹션 갱신 ...
    # 최종 PUT 시 image_section 그대로 삽입
```

**금지 패턴 (회귀 유발):**
- ❌ body 전체를 새로 만들어 PUT (이미지 매크로 사라짐)
- ❌ "이미지 자리에 placeholder 텍스트 작성" → 자동 회귀
- ❌ 정의 갱신 시 인포그래픽 헤더 다음을 빈 단락으로 두기

**예외:**
- 인포그래픽 신규 생성 단계 (아직 첨부 없음) → placeholder 가능
- 인포그래픽 PNG 자체 갱신은 attachment ID로 새 버전 업로드 (`POST /child/attachment/{id}/data`) — body 변경 X

## 주의 사항

- **변경 전 확인 필수.** 모든 자동 산정은 🔍 검토 태그 + 사용자 승인 후에만 Confluence 반영.
- **디자인·콘텐츠 거버넌스.** 페이지 A 와이어프레임 8섹션 구조·페이지 B 톤·페이지 C·D 정의는 사용자 확인 없이 변경 X.
- **모르면 모른다고.** 점수 산정 시 추정치는 항상 명시("미확인 → 최저점"). 추정 점수에 단정적 톤 X.
- **수동 작업 투명성.** 자동화 안 되는 항목(인포그래픽 PNG·Mermaid 매크로 미지원 시 대체 등)은 미리 알리고 사유 설명.
- **Gmail 인증.** 키체인 제한 시 handoff 안내. 본 스킬은 MCP Gmail 도구 우선 사용 (`mcp__claude_ai_Gmail__*`).
- **lock 파일.** cron 모드에서는 `/tmp/suji-bm-sync.lock` 확인. 동시 실행 방지.
- **첫 sync 가이드.** 페이지 A·E가 비어 있는 상태에서는 시드 데이터(현 정본 23건)를 Step 3-A 신규 리드 평가로 처리. 사용자 확인 후 한 번에 입력. (정본·status·group·active_deal 최종 기준 = BM CRM DB)

## 참조 자료

- **HANDOFF v2.1:** `/Users/sujicho/Workspace/work/project/project_todo/bm-sync-redesign/HANDOFF.md` (운영 기준 + 와이어프레임 + 마이그레이션)
- **사업성 v1.3 (현행):** `/Users/sujicho/Workspace/work/outputs/odl_business/governance/criteria/v1.3_20260601/20260601_ODL BM 리드 사업성 판단 기준 v1.3.md`
- **Cold 정책 v2.1:** `/Users/sujicho/Workspace/work/outputs/odl_business/governance/policy/20260601_Cold_무응답_자동_이동_정책_v2.md`
- **사업성 v1.2 (per-case 검증):** `…/governance/criteria/v1.2_20260519/`
- **DB SoT (bm-crm):** `/Users/sujicho/Workspace/work/project/project_todo/bm-crm/` (prisma/schema.prisma·seed-source.json)
- **figma 순서도:** https://www.figma.com/board/JcjgcBk4YupmXr4CnISIqb/ODL-BM-순서도
- **ODL Design System:** `~/Workspace/work/outputs/methodology/design_systems/odl/`
- **로컬 tracker (마이그레이션 후 archive):** `~/Workspace/work/outputs/odl_business/contacts/biz_contact_tracker.md`

## 변경 이력

### v2.2 (2026-06-09~10) — DB SoT 전환 + Status 6값 + 사업성 v1.3 + 2-tier 그룹 정합

- **Status 4-tier → 6값**: 우리 차례·상대 차례·요구사항 확인 완료·**우리 측 보류**·**Cold**·계약 종료. DB enum 1:1. "종료"=계약 후 전용 격하
- **그룹 3-group → 진행 중/주요 콜드/일반 cold** (DB CaseGroup 1:1). 구 Active/콜드 메일 라인업/종료 배제 폐기
- **`active_deal` 운영 중 딜 플래그** + **threshold_days/remaining** (무응답 임계 트래킹) 데이터 모델 추가
- **사업성 v1.2 → v1.3**: 4축 30/35/15/20 + 실행 가능성(실현·적극·데드라인) + cap 해제 + Buyer Persona. `total_score` 추가
- **이탈 게이트 → cold 게이트**, "이어갈 요구사항 없음"→일반 cold, 종료 사유 prefix → **Cold sub-prefix**(`[Cold-무응답]` 등 하이픈)·cross-tag `[주요 콜드 대상]`
- **무응답 Cold = 임계/보조 룰 자동 트리거** (수동 디클러터 폐기, Cold 정책 v2 §11). Step 3-D 갱신
- **DB SoT 전환**: 정본·status·group·active_deal 최종 기준 = BM CRM DB. Confluence A·B·E는 외부 publish target
- 2026-06-10 Confluence 5p(A·B·C·D·E) 정합 완료 (정본 23/13/2/8 · D v1.3 · P/M→파트너십·마케팅 · 매크로 보존)

### v2.1.2 (2026-05-27) — Gmail 쿼리·발신 방향 판정 검증 캐비엇

- ⚠️ **Gmail 라벨 쿼리 수정**: 라벨 ID 직접 쿼리(`label:Label_...`)는 빈 결과 반환 → **라벨명 쿼리 `label:"OSS/BIZ contact"`만 동작**. Step 2 + 데이터 소스에 명시
- ⚠️ **발신 방향 판정 캐비엇** (Step 3-B): SENT라도 `toRecipients`가 자기 주소면 검토용 초안 → 실제 외부 발송일 기준으로 `last_outbound_date`·대기일 산정
- 페이지 A 섹션 8 md 줄글 = 보고용 3그룹 로스터 양식 (요구사항 확인 완료 / 답변 대기 / 이어갈 요구사항 없음) 적용 사례 (5/27 sync)

### v2.1.1 (2026-05-20) — 인포그래픽 매크로 보존 룰 + 종료 사유 리프레이밍

- 🛡️ **인포그래픽 매크로 보존 룰** 신규: 페이지 C·D body 갱신 시 `<ac:image>` 매크로 자동 보존 (회귀 방지). Python 패턴·금지 패턴·예외 명시
- 종료 사유 리프레이밍: `[사업성 없음]` → `[이어갈 요구사항 없음]` · `[콜드 메일 필수]` → `[콜드 메일 라인업]`
- 종료 정의 추가: 별도 종료 통보 X · Phase 0에서는 break-up 메일도 X
- 이탈 #2 정책 v1.0: 산업·유형별 자동 종료 임계 (페이지 C 5-0 참조)
- Partnership → **Partnership / Marketing 공통 트랙** 4단계 (탐색·협의·합의·운영)
- 페이지 D에 2107052902 콘텐츠 통합 (검증 22건·변경 이력·근거 자료). 2107052902는 archive redirect

### v2.1 (2026-05-19) — 전면 개편

- 단일 페이지(2068480560) → **5개 페이지(A·B·C·D·E)** 분리, 기존 페이지는 보존
- GitHub Issues·대시보드 수치 제거 → **Gmail OSS/BIZ contact 단일 소스**
- 사업성 v1.0 → **v1.2** (자동 +1 룰 + 지역 보정 + 비주류 섹터 명확화)
- Status 3-tier → **4-tier** (요구사항 확인 완료 추가)
- 프리픽스 11개 → **12개** + 종료 사유 2개
- 그룹 분류 추가 (Active / 콜드 메일 라인업 / 종료 배제)
- 트리거 수동 → **수동 + cron 08:00 자동** 병행
- 시각화 룰: 페이지 A 섹션 0 ASCII art (매 sync), 인포그래픽 PNG는 별도 태스크
