# suji-ppt-dark-premium

다크 프리미엄(Linear·Notion 톤) PPTX 생성 스킬. **하이브리드 방식** — 프리미엄 다크 배경(그라데이션·글로우)은 HTML/CSS로 렌더한 이미지 에셋, 그 위 내용(텍스트·차트·카드)은 pptxgenjs **네이티브**라 **PowerPoint에서 그대로 편집** 가능.

## 왜 하이브리드인가

| | 네이티브 도형만 (구) | 풀 HTML→이미지 | **하이브리드 (본 스킬)** |
|---|---|---|---|
| 퀄 | 낮음(클립아트) | 최상 | 상 (배경 HTML급, 내용 네이티브) |
| 편집 | ✅ | ❌ | ✅ PowerPoint 편집 |

→ "프리미엄 룩 + 편집 가능"을 동시에. (배경은 1회 렌더한 에셋, 매 덱은 네이티브 코드로 내용만)

## 빠른 시작

```bash
cd ~/.claude/skills/suji-ppt-dark-premium
npm i pptxgenjs            # 최초 1회 (또는 NODE_PATH로 공용 모듈)
node references/components.js   # → ~/Desktop/dark-premium-sample.pptx (예시 5장)
```
신규 덱: `references/components.js`를 복사 → **예시 슬라이드 부분만 내용 교체**. 배경 에셋(`assets/bg_L·bg_R.png`)·컴포넌트 함수는 그대로 재사용.

## 구성

| 경로 | 내용 |
|---|---|
| `SKILL.md` | 토큰·컴포넌트·워크플로우·규칙 (작업 시작점) |
| `references/components.js` | 전체 컴포넌트 라이브러리 + 실행 가능한 예시 덱 |
| `assets/bg_L.png`·`bg_R.png` | 다크 프리미엄 배경 (2560×1440, HTML 렌더) |
| `assets/hnc-logo-white.png` | 흰 워드마크 |

## 컴포넌트

표지 · 챕터 헤더 · 큰 stat · 그라데이션 바 · **waterfall**(마진 분해) · **price ladder**(포지셔닝) · 프리미엄 테이블 · 2-layer 다이어그램 · equation 카드 · BM 동심원 노드 · 하단 고정 노트.

## 디자인 원칙

1. 큰 타이포가 1순위 (표지 46pt+, 헤드라인 36pt+)
2. 모노크롬 베이스 + **인디고 단일 액센트(#A9B2FF)** — 다색·윤곽선 클립아트 금지
3. 한 슬라이드 = 지배적 요소 하나, 표는 차트/다이어그램으로

## 배경 에셋 재생성 (선택)

`assets/`의 bg PNG는 HTML/CSS(`#08090A` + radial 글로우)를 2560×1440로 렌더한 것. 색·글로우 위치를 바꾸려면 동일 HTML을 로컬 서버에 띄워 헤드리스 브라우저로 스크린샷.

## 자매 스킬

`suji-ppt-light-premium` — 동일 구조, 라이트(29CM·Stripe 톤) 토큰. 같은 콘텐츠를 다크/라이트 두 톤으로 낼 때 짝으로 사용.
