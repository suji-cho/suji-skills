---
name: suji-tracker-status
description: OpenDataLoader 자동화(competitor_tracker, medium_confluence_sync)의 최근 실행 상태, Confluence 페이지 갱신 시점, 알림 안전망 상태를 한 화면으로 점검. 매일/매주 헬스체크용.
---

# /suji-tracker-status

OpenDataLoader 관련 두 자동화의 건강 상태를 한 번에 확인한다.

## 대상

| 자동화 | Workflow | Confluence Page |
|---|---|---|
| competitor_tracker | `competitor-tracker.yml` | OpenDataLoader+PDF (ID 2064811249) |
| medium_confluence_sync | `sync-medium.yml` | Medium+Github (ID 2063272560) |

- **Repo:** `opendataloader-project/odl_sujicho`
- **Cloud ID:** `hancom.atlassian.net`
- **자동 실행 주기:** competitor=매일 KST 09:00, medium=매일 KST 10:00

## 워크플로

### Step 1: 최근 워크플로우 run 결과 수집 (각 7회)

```bash
gh run list --workflow=competitor-tracker.yml --limit 7 \
  --repo opendataloader-project/odl_sujicho \
  --json databaseId,status,conclusion,createdAt,event

gh run list --workflow=sync-medium.yml --limit 7 \
  --repo opendataloader-project/odl_sujicho \
  --json databaseId,status,conclusion,createdAt,event
```

### Step 2: Confluence 페이지 lastModified 조회

```
mcp__claude_ai__getConfluencePage
  cloudId: hancom.atlassian.net
  pageId: 2064811249  (그리고 2063272560)
  contentFormat: markdown
```

요약 필드(summary)와 lastModified만 확인 (전체 본문 불필요).

### Step 3: 헬스체크 판정

자동화별로 다음 기준으로 상태 판정:

| 상태 | 조건 |
|---|---|
| 🟢 정상 | 최근 7회 success ≥ 6, 페이지 lastModified ≤ 2일 |
| 🟡 주의 | 최근 7회 fail 1~2건, 또는 페이지 lastModified 3~5일 |
| 🔴 깨짐 | 최근 7회 fail ≥ 3, 또는 페이지 lastModified > 5일 |

### Step 4: 결과 표시

다음 포맷으로 한 화면 요약:

```
## 자동화 헬스체크 (YYYY-MM-DD HH:MM KST)

### competitor_tracker (OpenDataLoader+PDF)
- 상태: 🟢/🟡/🔴
- 최근 7회: ✓✓✓✗✓✓✓ (5/7 success, 마지막 실행 N분 전)
- 페이지 갱신: YYYY-MM-DD HH:MM (N일 전)
- 다음 자동 실행: 내일 KST 09:00

### medium_confluence_sync (Medium+Github)
- 상태: 🟢/🟡/🔴
- 최근 7회: ✓✓✓✓✓✓✓ (7/7 success, 마지막 실행 N분 전)
- 페이지 갱신: YYYY-MM-DD HH:MM (N일 전)
- 다음 자동 실행: 내일 KST 10:00

### 권장 조치
- 🟢 → 조치 없음
- 🟡 → 다음 실행 결과 지켜보기. fail 1건 시 로그 1줄로 원인 표시
- 🔴 → `/suji-competitor-sync` 또는 `/suji-medium-sync`로 수동 실행, 그래도 실패면 진단 필요
```

### Step 5: 깨짐 감지 시 추가 액션

🔴 판정 시, 최근 fail run의 첫 에러 라인을 자동으로 가져와 표시:

```bash
gh run view <run_id> --repo opendataloader-project/odl_sujicho --log-failed 2>&1 \
  | grep -iE "error|fail|404|exception" | head -3
```

## 주의사항

- gh CLI 인증 필요. 실패 시 `gh auth status`로 확인.
- 페이지 lastModified는 분 단위까지만 정확. "less than a minute ago" 같은 상대 표현은 그대로 표시.
- 이 스킬은 **읽기 전용**. 워크플로우 trigger나 페이지 수정은 하지 않는다.
