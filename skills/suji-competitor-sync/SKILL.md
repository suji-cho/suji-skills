---
name: suji-competitor-sync
description: OpenDataLoader+PDF 경쟁사 지표 Confluence 페이지를 즉시 최신 상태로 동기화. competitor_tracker GitHub Actions workflow를 수동 trigger하고 완료까지 watch하여 결과를 보고한다.
---

# /suji-competitor-sync

OpenDataLoader+PDF 경쟁사 지표 추적 페이지를 즉시 갱신한다.
스케줄(매일 KST 09:00) 안 기다리고 당장 최신 상태로 보고 싶을 때 사용.

## 대상

- **Confluence Page:** OpenDataLoader+PDF 경쟁사 지표 추적 (ID 2064811249)
- **Workflow:** `.github/workflows/competitor-tracker.yml`
- **Repo:** `opendataloader-project/odl_sujicho`
- **Cloud ID:** hancom.atlassian.net

## 워크플로

### Step 1: 현재 상태 확인 (선택)

페이지가 이미 오늘 갱신됐는지 확인:

```
mcp__claude_ai__getConfluencePage
  cloudId: hancom.atlassian.net
  pageId: 2064811249
  contentFormat: markdown
```

lastModified가 1시간 이내면 사용자에게 "방금 갱신된 상태인데 다시 실행할까요?"로 확인.

### Step 2: workflow 수동 trigger

```bash
gh workflow run competitor-tracker.yml \
  --repo opendataloader-project/odl_sujicho
```

성공 시 "queued" 상태 메시지 출력.

### Step 3: 가장 최근 run ID 조회

```bash
sleep 5
gh run list --workflow=competitor-tracker.yml --limit 1 \
  --repo opendataloader-project/odl_sujicho \
  --json databaseId --jq '.[0].databaseId'
```

### Step 4: 완료까지 watch

```bash
gh run watch <run_id> --repo opendataloader-project/odl_sujicho --exit-status
```

타임아웃은 120초. 보통 30~60초면 끝남.

### Step 5: 결과 보고

**Success 시:**
- 페이지 다시 조회해서 lastModified 변경 확인
- 본문에서 핵심 수치 1줄 발췌 (예: "ODL 21,116 stars (+739, +3.6%)")
- 페이지 URL 표시

**Fail 시:**
- 실패한 step과 에러 라인 추출
  ```bash
  gh run view <run_id> --repo opendataloader-project/odl_sujicho --log-failed 2>&1 \
    | grep -iE "error|fail|404|exception" | head -5
  ```
- 가능한 원인 추정 (path 문제, API 문제, 환경변수 등)
- 사용자에게 진단 진행 여부 확인

### Step 6: 결과 포맷

```
## competitor_tracker 수동 실행 결과

- Run ID: 25xxxxxxxxx
- 실행 시간: N초
- 결과: ✅ Success / ❌ Failure

### 페이지 변경
- lastModified: YYYY-MM-DD HH:MM (방금 / N분 전)
- 핵심 수치: ODL X,XXX stars (+N, +N%)
- URL: https://hancom.atlassian.net/wiki/spaces/OSS1/pages/2064811249/OpenDataLoader+PDF

### (실패 시) 에러 요약
[발견된 에러 라인]
```

## 주의사항

- gh CLI 인증 필요. 만약 sandbox 안에서 인증서 오류 발생 시 `dangerouslyDisableSandbox: true` 사용.
- workflow_dispatch 권한 필요 (개인 토큰 또는 default GITHUB_TOKEN).
- watch 타임아웃 120초 — 그 이상 걸리면 백그라운드로 두고 사용자에게 알림.
- Confluence 페이지 변경 자체는 workflow 안의 tracker.py가 처리. 이 스킬은 trigger와 모니터링만 담당.
