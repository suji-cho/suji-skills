# suji-ppt-light-premium

라이트 프리미엄(29CM·Stripe 톤) PPTX 생성 스킬. `suji-ppt-dark-premium`의 **라이트 버전** — 구조·컴포넌트 100% 동일, 색·배경 에셋·로고만 반전. 흰 배경 + 미세 글로우/그림자 + 큰 타이포 + 인디고(#5B63D6) 단일 액센트.

**하이브리드 방식** — 라이트 글로우 배경은 HTML/CSS 렌더 이미지(에셋), 내용은 pptxgenjs **네이티브**라 **PowerPoint 편집** 가능.

## 언제

공식 보고·고객 제안·인쇄 친화. (임팩트·무게감이 필요하면 다크 → `suji-ppt-dark-premium`)

## 빠른 시작

```bash
cd ~/.claude/skills/suji-ppt-light-premium
npm i pptxgenjs
node references/components.js   # → ~/Desktop/light-premium-sample.pptx (예시 5장)
```
신규 덱: `references/components.js` 복사 → 예시 슬라이드 내용만 교체.

## 구성

| 경로 | 내용 |
|---|---|
| `SKILL.md` | 라이트 토큰 + dark 대비 반전 표 (구조는 dark SKILL.md 참조) |
| `references/components.js` | 라이트 토큰 적용 전체 컴포넌트 + 예시 |
| `assets/bg_L.png`·`bg_R.png` | 라이트 프리미엄 배경 (2560×1440) |
| `assets/hnc-logo-black.png` | 검정 워드마크 |

## 다크와 차이

- 색 토큰만 반전 (배경 흰색, 텍스트 #16181D, 액센트 #5B63D6, 카드 미세 그림자)
- 컴포넌트·레이아웃·워크플로우 동일 → 구조는 `suji-ppt-dark-premium/SKILL.md` 참조

## 자매 스킬

`suji-ppt-dark-premium` — 다크(Linear·Notion 톤). 동일 콘텐츠를 두 톤으로 낼 때 짝.
