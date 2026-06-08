# suji-bm-policy-sync

ODL BM 거버넌스 **정책·라벨 정의**를 단일하게 유지하는 동기화 스킬. Confluence 가이드라인 페이지 「비즈니스 흐름」·「사업성 및 우선순위 평가 기준」을 SoT로, 승인된 정책 변경을 두 페이지에 publish(🛡️ 매크로 보존)하고 BM CRM 코드(labels.ts)·로컬 문서·인포그래픽에 단방향 미러한다.

## When to use

- "BM 정책 동기화해줘", "라벨 정의 반영해줘", "거버넌스 변경 전파"
- `/suji-bm-policy-sync`

## /suji-bm-sync 와의 차이

| | `/suji-bm-sync` (v2.1, 동결) | `/suji-bm-policy-sync` (v1.0) |
|---|---|---|
| 메일 수집·분류 | ✅ | ❌ → BM CRM 앱 Phase 0b |
| 점수 산정 | ✅ | ❌ → BM CRM 앱/DB |
| 케이스 데이터 write (A·B·E) | ✅ | ❌ → DB SoT |
| 정책·라벨 정의 미러 (C·D) | 일부 | ✅ 전담 |
| 🛡️ 매크로 보존 | ✅ | ✅ 계승 |

> 구 `/suji-bm-sync`는 제거하지 않고 동결. Phase 0b(앱 메일·점수) 완성 전 fallback으로 병행.

## 대상 페이지

- **C** `2151056014` — 비즈니스 흐름 (정책 변경 시 publish)
- **D** `2151187100` — 사업성 및 우선순위 평가 기준 (정책 변경 시 publish)
- A·B·E = DB SoT (BM CRM 앱이 publish, 본 스킬 범위 밖)
- **Cloud ID:** https://hancom.atlassian.net · **Space:** OSS1

## 핵심 룰 (non-negotiable)

- **변경 전 확인** — diff 파일 + 사용자 승인 후에만 반영.
- **라벨·비즈니스 흐름 임의 변경 금지** — SoT 역침범 X.
- **🛡️ 매크로 보존** — C·D publish 시 `<ac:image>` 매크로 placeholder 회귀 금지. PUT 후 검증.
- **점수·메일은 범위 밖** — 요청 시 BM CRM 앱(Phase 0b)으로 안내.

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-bm-sync` | 구 통합 스킬(동결). 메일·점수 fallback |
| `/suji-confluence-publish` | Confluence publish 레이아웃 규칙 공유 |
