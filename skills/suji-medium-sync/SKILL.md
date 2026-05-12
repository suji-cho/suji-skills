---
name: suji-medium-sync
description: Medium+Github 분석 Confluence 페이지를 즉시 최신 상태로 동기화. medium_confluence_sync GitHub Actions workflow를 수동 trigger하고 완료까지 watch하여 결과를 보고한다.
---

# /suji-medium-sync

Medium 발행 내역과 GitHub 상관관계 분석 페이지를 즉시 갱신한다.
스케줄(매일 KST 10:00) 안 기다리고 당장 최신 상태로 보고 싶을 때 사용.

## 대상

- **Confluence Page:** Medium 발행 내역과 Github 상관관계 분석 (ID 2063272560)
- **Workflow:** `.github/workflows/sync-medium.yml`
- **Repo:** `opendataloader-project/odl_sujicho`
- **Cloud ID:** hancom.atlassian.net

## 워크플로

### Step 1: 현재 상태 확인 (선택)

페이지가 이미 오늘 갱신됐는지 확인:

```
mcp__claude_ai__getConfluencePage
  cloudId: hancom.atlassian.net
  pageId: 2063272560
  contentFormat: markdown
```

lastModified가 1시간 이내면 사용자에게 "방금 갱신된 상태인데 다시 실행할까요?"로 확인.

### Step 2: workflow 수동 trigger

기본 mode는 `daily`. 신규 포스트 누락 의심 시 `init` 모드도 가능.

```bash
gh workflow run sync-medium.yml \
  --repo opendataloader-project/odl_sujicho \
  -f mode=daily
```

성공 시 "queued" 상태 메시지 출력.

### Step 3: 가장 최근 run ID 조회

```bash
sleep 5
gh run list --workflow=sync-medium.yml --limit 1 \
  --repo opendataloader-project/odl_sujicho \
  --json databaseId --jq '.[0].databaseId'
```

### Step 4: 완료까지 watch

```bash
gh run watch <run_id> --repo opendataloader-project/odl_sujicho --exit-status
```

타임아웃은 180초 (medium은 외부 RSS 수집 때문에 competitor보다 약간 더 걸림).

### Step 5: 결과 보고

**Success 시:**
- 페이지 다시 조회해서 lastModified 변경 확인
- 본문 핵심 요약 발췌 (예: "포스트 19개 · 게재처 64개 · Stars 20,980 · Forks 1,948")
- 페이지 URL 표시

**Fail 시:**
- 실패한 step과 에러 라인 추출
  ```bash
  gh run view <run_id> --repo opendataloader-project/odl_sujicho --log-failed 2>&1 \
    | grep -iE "error|fail|404|exception|critical" | head -5
  ```
- 가능한 원인 추정 (Medium RSS 차단, Confluence API 변경, 환경변수 등)
- 사용자에게 진단 진행 여부 확인

### Step 6: 결과 포맷

```
## medium_confluence_sync 수동 실행 결과

- Run ID: 25xxxxxxxxx
- 실행 시간: N초
- 결과: ✅ Success / ❌ Failure

### 페이지 변경
- lastModified: YYYY-MM-DD HH:MM (방금 / N분 전)
- 핵심 요약: 포스트 N개 · 게재처 N개 · Stars N · Forks N
- URL: https://hancom.atlassian.net/wiki/spaces/OSS1/pages/2063272560/Medium+Github

### (실패 시) 에러 요약
[발견된 에러 라인]
```

## 모드 옵션

| Mode | 용도 |
|---|---|
| `daily` (기본) | 매일 증분 수집. 기존 history.json에 누적. |
| `init` | 전체 재수집. posts_history.json을 처음부터 재구성. 30초~1분 더 걸림. |

`init` 모드는 사용자가 명시적으로 요청한 경우에만.

## 주의사항

- gh CLI 인증 필요. sandbox 안에서 인증서 오류 시 `dangerouslyDisableSandbox: true` 사용.
- Medium 본 RSS 차단(403 등) 가능성. fail 시 에러 라인에서 "rss" 또는 "403" 키워드 확인.
- concurrency 설정: 같은 workflow가 이미 돌고 있으면 큐에서 대기 (cancel-in-progress: false).
- Confluence 페이지 변경 자체는 workflow 안의 src/main.py가 처리. 이 스킬은 trigger와 모니터링만 담당.
