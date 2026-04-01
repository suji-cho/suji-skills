# suji-bm-sync

OpenDataLoader 외부 컨택 및 BM 진행 현황 보고서(Confluence)를 최신 상태로 동기화한다. Gmail BIZ contact 라벨의 신규 메일, GitHub Issues 미대응 현황을 수집하고, 회신 대기 일수를 자동 계산하여 Confluence 페이지에 반영한다.

## When to use

- "BM 보고서 동기화해줘", "BM 현황 업데이트해줘"
- `/suji-bm-sync`

## 대상 페이지

- **Confluence Page ID:** 2068480560
- **Space:** OSS1 (오픈기술생태계확산팀)
- **Title:** OpenDataLoader 외부 컨택 및 BM 진행 현황 보고서
- **Cloud ID:** https://hancom.atlassian.net

## 워크플로우

### Step 1: 현재 보고서 읽기

Confluence MCP API로 현재 페이지 내용을 가져온다. 파싱 항목:
- 각 리드별 대응 타임라인 (마지막 날짜, 방향)
- Pipeline Summary Table 상태
- Community Issue 현황 테이블
- 의사결정 요청사항

### Step 2: Gmail BIZ contact 메일 확인

`/browse`로 Gmail `OSS/BIZ contact` 라벨에 접근. 로그인 필요 시 handoff로 사용자에게 위임.

확인 대상 리드 목록 (보고서에서 파싱):
- Stephanie Rosen (University of Michigan)
- Ken Erickson (LA City Ethics Commission)
- Ray Bell (State of Maryland)
- Timothy Hohne (UC Merced)
- Pratek Jain (Pradeep Publications)
- Boris Doubrov (DualLab)

새 리드가 BIZ contact 라벨에 있으면 신규 리드로 추가.

### Step 3: GitHub Issues 미대응 현황 수집

미대응 기준: 팀에서 회신하지 않은 Issue. 수집 항목:
- Issue 번호, 제목, 작성자, 생성일
- 미회신 일수 (오늘 기준 자동 계산)
- 반복 문의자 여부

### Step 4: 자동 계산

오늘 날짜 기준:
1. **회신 대기 일수 갱신** — 각 리드의 마지막 대화 날짜로부터 경과일. "고객 회신 대기 N일" 형식.
2. **Pipeline Summary Table 상태 갱신** — 신규 대화 있으면 Stage/Status/Next action 업데이트.
3. **Community Issue 미회신 일수 갱신** — 각 Issue의 수신일로부터 경과일 재계산.
4. **의사결정 요청사항 긴급도 자동 조정** — 기한 지난 항목 긴급도 상향, 완료 항목 완료 표시.

### Step 5: 변경 내용 승인 요청

변경 사항을 사용자에게 보여주고 승인을 받는다:
- 신규 대화 (N건)
- 회신 대기 일수 갱신
- Community Issue 변동
- 의사결정 요청사항 변경

옵션: 승인 / 수정 요청 / 취소

### Step 6: Confluence 업데이트

승인 시 MCP API로 페이지 업데이트. `versionMessage: BM 보고서 동기화 (YYYY-MM-DD)`

## 주의사항 (non-negotiable)

- **Confidential 문서**: 반드시 사용자 승인 후 반영. 자동 반영 금지.
- **디자인/콘텐츠 거버넌스**: 보고서 구조나 텍스트 톤 변경 불가. 데이터(날짜, 상태, 일수)만 갱신.
- **신규 리드 추가**: 기존 보고서 형식에 맞춰 작성하되, 사용자에게 Priority와 BM 관점 입력 요청.
- **Gmail 인증**: 키체인 제한으로 handoff가 필요할 수 있음.
- **browse 셋업**: `$B` 변수는 `~/.claude/skills/gstack/browse/dist/browse` 경로 사용.
