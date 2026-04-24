---
name: suji-bm-sync
description: BM 보고서 동기화 요청 시 사용. Confluence BM 보고서에 Gmail BIZ contact 신규 메일, GitHub Issues 미대응 현황, 회신 대기 일수를 자동 반영한다. 신규 리드는 사업성 점수 모델로 Priority를 자동 제안한다.
---

# /suji-bm-sync

OpenDataLoader 외부 컨택 및 BM 진행 현황 보고서(Confluence)를 최신 상태로 동기화한다.
Gmail BIZ contact 라벨의 신규 메일, GitHub Issues 미대응 현황을 수집하고,
회신 대기 일수를 자동 계산하여 Confluence 페이지에 반영한다.
신규 리드 감지 시 사업성 판단 점수 모델(100점)로 Priority를 자동 제안한다.

## 대상 페이지

- **Confluence Page ID:** 2068480560
- **Space:** OSS1 (오픈기술생태계확산팀), Space ID: 1342242976
- **Title:** OpenDataLoader 외부 컨택 및 BM 진행 현황 보고서
- **Cloud ID:** https://hancom.atlassian.net

## 데이터 소스

- **Gmail:** OSS/BIZ contact 라벨 (`https://mail.google.com/mail/u/0/#label/OSS%2FBIZ+contact`)
- **GitHub:** `opendataloader-project/opendataloader-pdf` (gh CLI 사용)
- **대시보드:** `https://odl-dashboard.apps.orca.cloud.hancom.com/` — Stars/Forks/Downloads/경쟁사 비교 (Comparison 탭)

## 워크플로

### Step 1: 현재 보고서 읽기

Confluence MCP API로 현재 페이지 내용을 가져온다.

```
mcp__claude_ai__getConfluencePage
  cloudId: https://hancom.atlassian.net
  pageId: 2068480560
  contentFormat: markdown
```

파싱할 항목:
- 각 리드별 대응 타임라인 (마지막 날짜, 방향)
- Pipeline Summary Table 상태
- Community Issue 현황 테이블
- 의사결정 요청사항
- **기존 리드 목록** (동적 파싱 — 하드코딩 금지)

### Step 2: Gmail BIZ contact 메일 확인

browse 도구로 Gmail에 접근한다.

```bash
$B goto "https://mail.google.com/mail/u/0/#label/OSS%2FBIZ+contact"
```

로그인이 필요한 경우 handoff로 사용자에게 넘긴다:
```bash
$B handoff "Gmail 로그인이 필요합니다. 로그인 후 알려주세요."
```

로그인 완료 후:
```bash
$B resume
$B goto "https://mail.google.com/mail/u/0/#label/OSS%2FBIZ+contact"
$B snapshot -c
```

각 BM 리드별 메일 스레드를 확인하여 보고서에 없는 신규 대화를 식별한다.

**확인 대상 리드:** Step 1에서 파싱한 기존 리드 목록 전체 + BIZ contact 라벨의 새 이름.
새 리드가 BIZ contact 라벨에 있으면 신규 리드로 추가한다.

**신규 리드 감지 시 → Step 2-A 실행.**

### Step 2-A: 신규 리드 사업성 평가 (점수 모델)

참조 문서: Confluence Page ID 2107052902 (ODL BM 리드 사업성 판단 기준 v1.0)
로컬 사본: `~/Workspace/work/outputs/drafts/20260420_ODL BM 리드 사업성 판단 기준.md`

#### Gate 필터

| 조건 | 결과 |
|---|---|
| PDF 접근성/파싱과 무관한 문의 | → **사업성 없음** (평가 종료) |
| 이름+이메일만, 상세 없음 | → **미정** (상세 파악 질문 발송 권고) |
| 위에 해당 없음 | → **점수 모델 진입** |

#### 점수 모델 (100점 만점)

**축 1. 수익률 (45점)**

| 지표 | 배점 | 기준 |
|---|---|---|
| 볼륨 | 15 | 100K+=15 / 10K~100K=10 / 1K~10K=5 / <1K·미확인=2 |
| 조직 규모 | 12 | Fortune500·정부=12 / 대기업·대학=10 / 중견=6 / 스타트업·SMB=3 / 1인=1 |
| 도입 긴급도 | 8 | 데드라인 명시=8 / "즉시"=6 / "검토 중"=3 / 탐색=1 |
| 도입 의지 신호 | 10 | 샘플PDF·미팅요청=10 / follow-up·기술질문=7 / 상세회신=4 / 초기문의=1 |

볼륨 미확인 시 조직 규모로 추정: Fortune500→100K+, 대학→10K~100K, 스타트업·1인→<1K.

**축 2. 네임밸류 (35점)**

| 지표 | 배점 | 기준 |
|---|---|---|
| 조직 인지도 | 15 | Fortune500·유명대학·국가기관=15 / 섹터내인지=9 / 낮음=3 |
| 섹터 대표성 | 10 | ODL 첫 레퍼런스=10 / 같은섹터있음=5 / 비주류=2 |
| 규제 시장 위치 | 10 | ADA/EAA 직접대상=10 / 간접영향=5 / 무관=0 |

섹터: 교육(US), 교육(EU), 공공(US), 공공(EU), 헬스케어, 금융/보험, AgTech, 출판, PDF접근성전문.

**축 3. 확산력 (20점)**

| 지표 | 배점 | 기준 |
|---|---|---|
| 섹터 파급 | 8 | 도미노가능=8 / 일부=4 / 단독=1 |
| 파트너 채널 | 6 | 리셀러·에이전시=6 / 내부확산=3 / 단일=0 |
| 규제 연쇄 | 6 | 같은규제대상다수=6 / 일부=3 / 없음=0 |

#### 점수 → Priority 매핑

| 총점 | Priority | 대응 수준 |
|---|---|---|
| 70~100 | 🟢 P1 | 24시간 내 회신. PoC 즉시 착수. CTO 보고 |
| 40~69 | 🟡 P2 | 48시간 내 회신. 상세 파악 후 PoC 검토 |
| 20~39 | ⚪ P3 | 1주 내 회신. 표준 안내. 무반응 21일 시 종료 |
| <20 | ⚪ 미정 | 상세 파악 질문 발송 후 재평가 |

PM은 ±1 단계 수동 조정 가능. 조정 시 사유 명기.

#### 표시 포맷

신규 리드마다 아래 형식으로 점수표를 제시하고 AskUserQuestion으로 Priority 확인/수정을 받는다:

```
### [이름] | [조직명]
| 축 | 지표 | 점수 | 근거 |
|---|---|---|---|
| 수익률 | 볼륨 | ?/15 | ... |
| 수익률 | 조직 규모 | ?/12 | ... |
| 수익률 | 도입 긴급도 | ?/8 | ... |
| 수익률 | 도입 의지 | ?/10 | ... |
| 네임밸류 | 조직 인지도 | ?/15 | ... |
| 네임밸류 | 섹터 대표성 | ?/10 | ... |
| 네임밸류 | 규제 시장 | ?/10 | ... |
| 확산력 | 섹터 파급 | ?/8 | ... |
| 확산력 | 파트너 채널 | ?/6 | ... |
| 확산력 | 규제 연쇄 | ?/6 | ... |
| **합계** | | **??/100** | |

→ 제안: **P?** (근거 요약)
→ [P1] [P2] [P3] [미정] [사업성 없음]
```

### Step 3: GitHub Issues 미대응 현황 수집

GitHub CLI로 오픈 이슈를 수집한다.

```bash
gh issue list --repo opendataloader-project/opendataloader-pdf --state open --limit 80 \
  --json number,title,author,createdAt,labels \
  --jq '.[] | "\(.number)\t\(.author.login)\t\(.createdAt | split("T")[0])\t\(.labels | map(.name) | join(","))\t\(.title)"'
```

보고서의 기존 이슈 목록과 비교하여:
- 신규 이슈 식별
- 해결/닫힌 이슈 식별
- 미회신 일수 재계산 (오늘 기준)

댓글 상태 확인 (팀 응답 여부):
```bash
gh issue view [번호] --repo opendataloader-project/opendataloader-pdf \
  --json number,comments --jq '{number, comment_count: (.comments | length)}'
```

### Step 4: 대시보드 수치 수집

ODL 대시보드에서 최신 수치를 가져온다.

```bash
$B goto "https://odl-dashboard.apps.orca.cloud.hancom.com/"
$B snapshot -c
```

수집 항목: Stars, Forks, Clones, Views, PyPI Downloads, Open Issues, 주간 변동.

경쟁사 비교 (Comparison 탭):
```bash
$B click [Comparison 버튼]
$B text
```

수집 항목: 상위 7개 프로젝트의 Stars, Forks, PyPI/mo, Lang.

### Step 5: 자동 계산

오늘 날짜 기준으로 다음을 계산한다:

1. **회신 대기 일수 갱신**
   - 각 리드의 마지막 대화 날짜로부터 경과일 계산
   - "고객 회신 대기 N일" 형식으로 갱신

2. **Pipeline Summary Table 상태 갱신**
   - 신규 대화가 있으면 Stage/Status/Next action 업데이트
   - 시각 포맷 유지: 🟢P1/🟡P2/⚪P3, 🇺🇸🇫🇷🇩🇪🇮🇳 국기, 🔴🟡✅⬜ 상태

3. **Community Issue 미회신 일수 갱신**
   - 각 Issue의 수신일로부터 경과일 재계산
   - 긴급 이모지: 🟢1~3일 / 🟡4~7일 / 🟠8~11일 / 🔴12일+

4. **의사결정 요청사항 긴급도 자동 조정**
   - 기한이 지난 항목의 긴급도 상향
   - 완료된 항목은 ✅ 완료 표시
   - 긴급도 이모지: 🔴즉시 / 🟡금주 / ⚪대기 / ✅완료

5. **Executive Summary KPI 갱신**
   - Stars 수치 (대시보드 기준)
   - 누적 인바운드/Active Leads/미대응 Issue 건수

6. **경쟁 포지셔닝 테이블 갱신** (Section 7)
   - 대시보드 Comparison 탭 데이터 반영

### Step 6: 변경 내용 승인 요청

AskUserQuestion으로 변경 사항을 사용자에게 보여주고 승인을 받는다.

표시 형식:
```
## 변경 감지 결과

### 신규 리드 (N건)
- [이름] [조직] — 수익(??) + 네임(??) + 확산(??) = ??점 → P? 제안

### 신규 대화 (N건)
- [리드명] MM/DD ← 수신: 내용 요약
- [리드명] MM/DD → 발신: 내용 요약

### 회신 대기 일수 갱신
- Contact: N일 → M일

### Community Issue 변동
- 신규: #xxx (내용)
- 미회신 일수 갱신: 전체 +N일

### 대시보드 수치
- Stars: X → Y (+Z, +N%)

### 의사결정 요청사항 변경
- #N 긴급도: A → B

Confluence에 반영할까요?
```

옵션:
- 승인: 반영 진행
- 수정 요청: 사용자가 내용 수정 후 재확인
- 취소: 반영 안 함

### Step 7: Confluence 업데이트

승인 시 MCP API로 Confluence 페이지를 업데이트한다.

```
mcp__claude_ai__updateConfluencePage
  cloudId: https://hancom.atlassian.net
  pageId: 2068480560
  contentFormat: markdown
  title: YYYYMMDD_OpenDataLoader 외부 컨택 및 BM 진행 현황 보고서
  versionMessage: BM 보고서 동기화 (YYYY-MM-DD)
  body: (업데이트된 전체 마크다운)
```

업데이트 후 사용자에게 완료 확인 메시지를 표시한다.

## 주의사항

- **Confidential 문서**: 반드시 사용자 승인 후 반영. 자동 반영 금지.
- **디자인/콘텐츠 거버넌스**: 보고서 구조나 텍스트 톤 변경 불가. 데이터(날짜, 상태, 일수)만 갱신.
- **신규 리드 추가**: 기존 보고서 형식(Priority, 소속/직책, 규모, 니즈, 대응 타임라인, BM 관점)에 맞춰 작성. **사업성 점수표 + Priority 제안 후 사용자 확인.**
- **Gmail 인증**: 키체인 제한으로 handoff가 필요할 수 있음. 사용자에게 안내.
- **browse 셋업**: `$B` 변수는 `~/.claude/skills/gstack/browse/dist/browse` 경로 사용.
- **경쟁사 수치**: ODL 대시보드 Comparison 탭에서 가져온다. 수동 검색 금지.
