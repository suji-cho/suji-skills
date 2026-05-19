---
name: suji-bm-sync
description: ODL BM 인바운드 리드 동기화. Gmail OSS/BIZ contact 라벨에서 신규·갱신 메일을 수집하고, 운영 기준 v2.1 + 사업성 v1.2를 적용해 5개 Confluence 페이지(A 대시보드·B 보고용·C 흐름·D 기준·E 매핑)를 갱신한다. 수동 호출 + 매일 08:00 cron 자동 실행.
---

# /suji-bm-sync (v2.1)

OpenDataLoader BM 인바운드 리드를 매일 아침 트리아지하기 위한 동기화 스킬.
Gmail OSS/BIZ contact 라벨을 단일 데이터 소스로 5개 Confluence 페이지(A·B·C·D·E)에 반영한다.
운영 기준 v2.1(Stage 11+Partnership · Status 4-tier · 프리픽스 12+종료 2 · 이탈 게이트 4)과
사업성 v1.2(45/35/20 + 자동 +1 룰 + 지역 보정)를 적용해 모든 자동 산정값은 🔍 검토 태그로 표기,
사용자 승인 후에만 Confluence를 갱신한다.

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

- **Gmail 라벨:** OSS/BIZ contact (Label ID `Label_4901978024770138907`)
- URL: `https://mail.google.com/mail/u/0/#label/OSS%2FBIZ+contact`
- **단일 소스**. GitHub Issues·대시보드 수치 등 다른 소스는 본 스킬에서 사용하지 않음 (BM 보고서 별도 흐름).

## 운영 기준 v2.1 (요약)

자세한 정의는 페이지 D 또는 `/Users/sujicho/Workspace/work/project/project_todo/bm-sync-redesign/HANDOFF.md` 섹션 3 참조.

### Stage (11 + Partnership 별도 트랙)

1. 인입(Prospecting) → 2. 1차 판단(Qualification) → 3. Sample(Free Sample Remediation) →
4. 기초 협상(Discovery) → 5. PoC → 6. Pilot 협상(Proposal) → 7. Pilot → 8. MSA 협상(Negotiation) →
9. Production → 10. Renewal·Upsell → 11. 이탈(Closed Lost·Churn)

Partnership 트랙: 인입 → 협의 → 합의 → 운영 (영업 깔때기 외)

### Status 4-tier

- **우리 차례** (Blue 600) — 다음 외부 액션 우리
- **상대 차례** (Amber 600) — 우리 답신 후 상대 응답 대기
- **요구사항 확인 완료** (Purple 600) — 외부 요구사항 파악 끝, 우리 내부 작업 중
- **종료** (Slate 500) — 사업성 없음 / 종료 통보 / 콜드 라인업

### 프리픽스 12개 + 종료 사유 2개

`[신규]` `[샘플처리 대기]` `[샘플 요청]` `[가격 답변 대기]` `[라이센스 답변 대기]`
`[기본 정보 요청]` `[기본 정보 답변 대기]` `[요구사항 논의 중]` `[스폰서십 제안 검토]`
`[요구사항 파악 완료]` `[PoC 응답 대기]` `[상세 정보 답변 대기]`

종료 사유: `[사업성 없음]` (배제) · `[콜드 메일 필수]` (콜드 메일 풀)

### 이탈 게이트 4개

- 이탈 #1: 1차 판단 실패 → 종료 또는 미정
- 이탈 #2: 기초 협상 실패(21일+ 무응답) → 콜드 리스트
- 이탈 #3: PoC 평가 실패 → Nurturing
- 이탈 #4: MSA 협상 실패 → Lost·콜드 후보

### 그룹

- **Active** — Stage 1~10 + Partnership, Status 우리/상대 차례
- **콜드 메일 풀** — Status 요구사항 확인 완료 + 종료(`[콜드 메일 필수]`) Nurturing
- **종료 (배제)** — Stage 11 이탈 + `[사업성 없음]`

## 사업성 v1.2 (요약)

자세한 산식은 페이지 D 또는 `/Users/sujicho/Workspace/work/outputs/business/criteria/v1.2_20260519/` 참조.

### 점수 모델 (100점)

- **수익률 45**: 볼륨 15 + 조직 규모 12 + 도입 긴급도 8 + 도입 의지 10
- **네임밸류 35**: 조직 인지도 15 + 섹터 대표성 10 + 규제 시장 10
- **확산력 20**: 섹터 파급 8 + 파트너 채널 6 + 규제 연쇄 6

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
status              우리/상대/요구사항 확인 완료/종료 (4-tier)
prefixes            컨텍스트 프리픽스 list (12개 사전)
biz_priority        P1 / P2 / P3 / 미정
biz_score           0~100 (v1.2 모델)
auto_p_boost        자동 +1 적용 여부 (v1.2 핵심 타겟 룰)
pm_p_adjust         PM +1 수동 조정 사유 (스트링)
last_inbound_date   상대 마지막 발신일
last_outbound_date  우리 마지막 발신일
last_action_date    max(둘 중)
waiting_days        오늘 - last_action_date
context             1줄 컨텍스트 요약
next_action         우리 다음 액션
needs_review        🔍 검토 필요 여부
exit_gate           이탈 시 #1/#2/#3/#4
group               Active / 콜드 메일 풀 / 종료 (배제)
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
- 섹션 1 카운트 표 (Active N · 콜드 메일 풀 M · 종료 J · 신규 평가 L)
- 섹션 3 Active 케이스 Stage별 토글 내 케이스 리스트
- 섹션 4 콜드 메일 풀 케이스
- 섹션 5 종료 (배제) 케이스
- 섹션 6 Decision Log (최근 10건)

페이지 E에서 파싱:
- 각 케이스별 점수 산정 결과 + 자동/PM 조정 사유 + 최종 P

→ 메모리에 `cases_state_prev: list[CaseRow]` 적재.

### Step 2. Gmail BIZ contact 신규/갱신 메일 수집

```
mcp__claude_ai_Gmail__search_threads
  q: "label:OSS/BIZ-contact newer_than:35d"
```

또는 라벨 ID 직접 사용:
```
q: "label:Label_4901978024770138907 newer_than:35d"
```

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
  │   ├─ PDF 무관 → [사업성 없음] · Stage 11 이탈 · 그룹 종료(배제)
  │   ├─ 정보 부족 → 미정 · Stage 1차 판단 · [신규]
  │   └─ 통과 → 점수 모델 진입
  │
  ├─ 점수 모델 (v1.2)
  │   ├─ 수익률 (볼륨·조직 규모·긴급도·도입 의지)
  │   ├─ 네임밸류 (인지도 + 지역 보정 + 섹터 대표성 + 규제)
  │   └─ 확산력 (섹터 파급·파트너 채널·규제 연쇄)
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

#### 3-C. 프리픽스 자동 판정

12개 프리픽스 사전(`HANDOFF.md` 섹션 3-3) 기준 메일 본문·컨텍스트 매칭. 다중 프리픽스 허용.

#### 3-D. Stale 감지 (21일+ 무응답)

`waiting_days >= 21` + `status == 상대 차례` → 콜드 후보, `exit_gate=#2` 후보, 그룹 `콜드 메일 풀` 라인업 제안.

#### 3-E. Next Action 제안

Status가 `우리 차례` 또는 `요구사항 확인 완료`인 케이스만:
- 우리 차례 → 외부 액션 (답신·자료 송부·미팅 제안)
- 요구사항 확인 완료 → 내부 작업 항목 (Sample 처리·라이센스 정리·로드맵 검토 등)

#### 3-F. 그룹 자동 분류

```
if stage == 11 이탈 and prefix == [사업성 없음]:
    group = 종료 (배제)
elif status == 요구사항 확인 완료 or (stage == 11 이탈 and prefix == [콜드 메일 필수]):
    group = 콜드 메일 풀
else:
    group = Active
```

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

### Stale·이탈 진입 (P건) 🔍
- [이름]: 상대 차례 21일+ → 이탈 #2 후보 / 콜드 메일 풀

### Next Action 제안 (Q건) 🔍
- [이름]: 답신 작성 + 가격 안내 첨부

### 그룹 이동 (R건) 🔍
- [이름]: Active → 콜드 메일 풀
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
   1-1. 카운트 표 (Active N · 콜드 메일 풀 M · 종료 J · 신규 평가 L)
   1-2. 🚨 오늘 회신 / 🆕 신규 평가 / ⚠️ 21일+ 무응답

🆕 2. Triage Queue (1차 판단 대기)
   이름·조직 · 수신일 · Gate · 잠정 점수 · 잠정 P

🔵 3. Active 케이스 (Stage별 토글)
   1차 판단 / Sample / 기초 협상 / PoC / Pilot 협상 /
   Pilot / MSA 협상 / Partnership 협의

🟣 4. 콜드 메일 풀
   요구사항 확인 완료 + Nurturing 통합

⚪ 5. 종료 (배제) [토글 기본 접힘]

✅ 6. Decision Log (최근 10건)

🟦 7. md 줄글 (복붙용 — 보고·메시지)
```

**섹션 0 ASCII art 포맷 예시:**

```
인입 [n] → 1차 판단 [2] → Sample [3] → 기초 협상 [7] → PoC [0] → Pilot 협상 [0] → Pilot [0] → MSA [0] → Production [0]
                            │              │
                            │              ├─ Atharva, Brian
                            ├─ Félix, David, Noah
                            │              ├─ Dragan, Sauer, Russell, Pratek, Timothy, Ray, Ken

Partnership: 협의 [1] (Alisa) → 합의 [0] → 운영 [0]
이탈 #1 [8] · #2 [0] · #3 [0] · #4 [0]
콜드 메일 풀 [2]
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

운영 기준 v2.1 정의 변경이 감지되면 갱신. 매 sync에서는 건너뜀.

- 11단계 정의·진입/전이 조건·주 담당·색 토큰
- 이탈 게이트 #1~#4 진입 조건·후속 처리
- Partnership 별도 트랙
- 인포그래픽 PNG: HTML+Playwright 별도 태스크 (`<ac:image>` placeholder 유지)

#### 6-D. 페이지 D `사업성 및 우선순위 평가 기준` (정의 변경 시만)

운영 기준 v2.1 + 사업성 v1.2 정의 변경 시만 갱신.

- 점수 모델 (45/35/20)
- 컷오프 + 자동 +1 룰 + 지역 보정 + 비주류 섹터
- 우선순위 매핑 룰
- 인포그래픽 PNG: HTML+Playwright 별도 태스크

#### 6-E. 페이지 E `인바운드별 우선순위 매핑 상세` (매 sync)

```
mcp__claude_ai__updateConfluencePage
  pageId: 2151056039
  body: (전체 케이스 점수 산정 표 재생성)
```

표 컬럼:
- 케이스 ID · 이름·조직 · 국가·B2X · 수익률(45) · 네임밸류(35) · 확산력(20) · 총점 · auto_p_boost · pm_p_adjust · 최종 P · 사유 한 줄

자동 +1 적용 케이스는 행 강조. PM 조정 케이스는 사유 명기.

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
| C 흐름도 | 인포그래픽 PNG (`<ac:image>` placeholder) | 별도 태스크 — 정의 변경 시 |
| D 점수 모델 | 인포그래픽 PNG (`<ac:image>` placeholder) | 별도 태스크 — 정의 변경 시 |
| E 점수표 | 텍스트·표 | 매 sync 자동 |

**인포그래픽 PNG 갱신은 본 스킬 범위 외.** HTML+Playwright 렌더링 + `attachment API` 업로드 + storage format `<ac:image>` 교체는 별도 태스크에서 처리. 본 스킬은 placeholder만 유지하고 텍스트 정의만 갱신한다.

## 주의 사항

- **변경 전 확인 필수.** 모든 자동 산정은 🔍 검토 태그 + 사용자 승인 후에만 Confluence 반영.
- **디자인·콘텐츠 거버넌스.** 페이지 A 와이어프레임 8섹션 구조·페이지 B 톤·페이지 C·D 정의는 사용자 확인 없이 변경 X.
- **모르면 모른다고.** 점수 산정 시 추정치는 항상 명시("미확인 → 최저점"). 추정 점수에 단정적 톤 X.
- **수동 작업 투명성.** 자동화 안 되는 항목(인포그래픽 PNG·Mermaid 매크로 미지원 시 대체 등)은 미리 알리고 사유 설명.
- **Gmail 인증.** 키체인 제한 시 handoff 안내. 본 스킬은 MCP Gmail 도구 우선 사용 (`mcp__claude_ai_Gmail__*`).
- **lock 파일.** cron 모드에서는 `/tmp/suji-bm-sync.lock` 확인. 동시 실행 방지.
- **첫 sync 가이드.** 페이지 A·E가 비어 있는 상태에서는 시드 데이터 22건을 Step 3-A 신규 리드 평가로 처리. 사용자 확인 후 한 번에 입력.

## 참조 자료

- **HANDOFF v2.1:** `/Users/sujicho/Workspace/work/project/project_todo/bm-sync-redesign/HANDOFF.md` (운영 기준 + 와이어프레임 + 마이그레이션)
- **사업성 v1.2:** `/Users/sujicho/Workspace/work/outputs/business/criteria/v1.2_20260519/20260519_ODL BM 리드 사업성 판단 기준 v1.2.md`
- **사업성 v1.1 (직전):** `/Users/sujicho/Workspace/work/outputs/business/criteria/v1.1_20260514/`
- **figma 순서도:** https://www.figma.com/board/JcjgcBk4YupmXr4CnISIqb/ODL-BM-순서도
- **ODL Design System:** `~/Workspace/work/outputs/methodology/design_systems/odl/`
- **로컬 tracker (마이그레이션 후 archive):** `~/Workspace/work/outputs/business/contacts/biz_contact_tracker.md`

## 변경 이력

### v2.1 (2026-05-19) — 전면 개편

- 단일 페이지(2068480560) → **5개 페이지(A·B·C·D·E)** 분리, 기존 페이지는 보존
- GitHub Issues·대시보드 수치 제거 → **Gmail OSS/BIZ contact 단일 소스**
- 사업성 v1.0 → **v1.2** (자동 +1 룰 + 지역 보정 + 비주류 섹터 명확화)
- Status 3-tier → **4-tier** (요구사항 확인 완료 추가)
- 프리픽스 11개 → **12개** + 종료 사유 2개
- 그룹 분류 추가 (Active / 콜드 메일 풀 / 종료 배제)
- 트리거 수동 → **수동 + cron 08:00 자동** 병행
- 시각화 룰: 페이지 A 섹션 0 ASCII art (매 sync), 인포그래픽 PNG는 별도 태스크
