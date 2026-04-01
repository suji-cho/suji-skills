---
name: suji-bm-sync
description: BM 보고서 동기화 요청 시 사용. Confluence BM 보고서에 Gmail BIZ contact 신규 메일, GitHub Issues 미대응 현황, 회신 대기 일수를 자동 반영한다.
---

# /suji-bm-sync

OpenDataLoader 외부 컨택 및 BM 진행 현황 보고서(Confluence)를 최신 상태로 동기화한다.
Gmail BIZ contact 라벨의 신규 메일, GitHub Issues 미대응 현황을 수집하고,
회신 대기 일수를 자동 계산하여 Confluence 페이지에 반영한다.

## 대상 페이지

- **Confluence Page ID:** 2068480560
- **Space:** OSS1 (오픈기술생태계확산팀)
- **Title:** OpenDataLoader 외부 컨택 및 BM 진행 현황 보고서
- **Cloud ID:** https://hancom.atlassian.net

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

### Step 2: Gmail BIZ contact 메일 확인

browse 도구로 Gmail에 접근한다.

```bash
$B goto "https://mail.google.com"
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

**확인 대상 리드 목록** (보고서에서 파싱):
- Stephanie Rosen (University of Michigan)
- Ken Erickson (LA City Ethics Commission)
- Ray Bell (State of Maryland)
- Timothy Hohne (UC Merced)
- Pratek Jain (Pradeep Publications)
- Boris Doubrov (DualLab)

새 리드가 BIZ contact 라벨에 있으면 신규 리드로 추가한다.

### Step 3: GitHub Issues 미대응 현황 수집

browse 도구로 GitHub Issues를 확인하거나, GitHub CLI가 사용 가능하면 활용한다.

미대응 기준:
- 팀에서 회신하지 않은 Issue
- 보고서에 기록된 Issue 번호와 현재 상태 비교

수집 항목:
- Issue 번호, 제목, 작성자, 생성일
- 미회신 일수 (오늘 기준 자동 계산)
- 반복 문의자 여부

### Step 4: 자동 계산

오늘 날짜 기준으로 다음을 계산한다:

1. **회신 대기 일수 갱신**
   - 각 리드의 마지막 대화 날짜로부터 경과일 계산
   - "고객 회신 대기 N일" 형식으로 갱신

2. **Pipeline Summary Table 상태 갱신**
   - 신규 대화가 있으면 Stage/Status/Next action 업데이트

3. **Community Issue 미회신 일수 갱신**
   - 각 Issue의 수신일로부터 경과일 재계산

4. **의사결정 요청사항 긴급도 자동 조정**
   - 기한이 지난 항목의 긴급도 상향
   - 완료된 항목은 완료 표시 또는 제거

### Step 5: 변경 내용 승인 요청

AskUserQuestion으로 변경 사항을 사용자에게 보여주고 승인을 받는다.

표시 형식:
```
## 변경 감지 결과

### 신규 대화 (N건)
- [리드명] 03/xx ← 수신: 내용 요약
- [리드명] 03/xx → 발신: 내용 요약

### 회신 대기 일수 갱신
- Ken Erickson: 11일 → 12일
- Ray Bell: 13일 → 14일

### Community Issue 변동
- 신규: #xxx (내용)
- 미회신 일수 갱신: #259 14일+ → 15일+

### 의사결정 요청사항 변경
- #1 긴급도: 즉시 → 완료 (or 유지)

Confluence에 반영할까요?
```

옵션:
- 승인: 반영 진행
- 수정 요청: 사용자가 내용 수정 후 재확인
- 취소: 반영 안 함

### Step 6: Confluence 업데이트

승인 시 MCP API로 Confluence 페이지를 업데이트한다.

```
mcp__claude_ai__updateConfluencePage
  cloudId: https://hancom.atlassian.net
  pageId: 2068480560
  contentFormat: markdown
  versionMessage: BM 보고서 동기화 (YYYY-MM-DD)
  body: (업데이트된 전체 마크다운)
```

업데이트 후 사용자에게 완료 확인 메시지를 표시한다.

## 주의사항

- **Confidential 문서**: 반드시 사용자 승인 후 반영. 자동 반영 금지.
- **디자인/콘텐츠 거버넌스**: 보고서 구조나 텍스트 톤 변경 불가. 데이터(날짜, 상태, 일수)만 갱신.
- **신규 리드 추가**: 기존 보고서 형식(Priority, 소속/직책, 규모, 니즈, 대응 타임라인, BM 관점)에 맞춰 작성하되, 사용자에게 Priority와 BM 관점 입력 요청.
- **Gmail 인증**: 키체인 제한으로 handoff가 필요할 수 있음. 사용자에게 안내.
- **browse 셋업**: `$B` 변수는 `~/.claude/skills/gstack/browse/dist/browse` 경로 사용.
