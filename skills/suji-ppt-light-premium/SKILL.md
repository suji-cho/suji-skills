---
name: suji-ppt-light-premium
description: 라이트 프리미엄(29CM/Stripe 톤) PPTX 생성. HTML/CSS로 렌더한 라이트 글로우 배경(에셋) 위에 pptxgenjs 네이티브 텍스트·컴포넌트를 올려 "프리미엄 룩 + PowerPoint 편집 가능"을 동시 달성. 공식 보고·고객 제안·인쇄 친화. 자매: suji-ppt-dark-premium(다크 동일 구조).
---

# 라이트 프리미엄 PPTX 생성 (Light Premium)

흰 배경 + 미세 글로우/그림자 + 큰 자신감 있는 타이포 + 인디고 단일 액센트. 29CM·Stripe 결의 깔끔·공식. **핵심 = 하이브리드:** 프리미엄 배경은 HTML/CSS 렌더 이미지(에셋), 그 위 내용은 네이티브 pptxgenjs(편집 가능).

**구조·컴포넌트·워크플로우·규칙은 `suji-ppt-dark-premium`와 100% 동일.** 색 토큰·배경 에셋·로고만 라이트로 반전한다. dark SKILL.md를 기준으로 읽고 아래만 치환.

## 3대 정체성

dark-premium과 동일 (① 하이브리드 빌드: bg 이미지 + 네이티브 내용 / ② 큰 타이포 / ③ 모노크롬 베이스 + 인디고 단일 액센트). 단 배경은 흰색, 카드는 미세 그림자로 깊이.

## 색 토큰 (라이트 — dark에서 반전)

```javascript
const TXT="16181D", SUB="5A6470", DIM="9CA3AF", DIM2="C2C7CF",
      ACC="5B63D6", ACC2="9197E8",            // 인디고 (흰 배경 가독 위해 dark보다 진하게)
      CARD="FBFCFD", CARDB="E6E9ED",           // 카드 fill / border (+ 미세 그림자)
      TRK="EEF1F4", BG="FFFFFF", LINEC="E6E9ED";
```

| dark 토큰 | → light |
|---|---|
| TXT F4F5F7 | 16181D |
| SUB 9CA3AF | 5A6470 |
| DIM 5C6470 | 9CA3AF |
| ACC A9B2FF | 5B63D6 |
| ACC2 8C95E8 | 9197E8 |
| CARD 0F1118 | FBFCFD |
| CARDB 2A2E3A | E6E9ED |
| TRK 1C1F28 | EEF1F4 |
| 배경 에셋 (다크 글로우) | assets/bg_L·bg_R (라이트 글로우) |
| 로고 hnc-logo-white | hnc-logo-black (또는 텍스트 #3A3F4A) |

## 카드 — 라이트 차이

카드에 **미세 그림자**로 깊이(다크는 보더만):
```javascript
s.addShape(RR,{x,y,w,h,fill:{color:"FBFCFD"},line:{color:"E6E9ED",width:1},rectRadius:0.09,
  shadow:{type:"outer",color:"1A2A4A",opacity:0.06,blur:8,offset:2,angle:90}});
```
로고 텍스트 색 `#3A3F4A`(검정 워드마크) + `.` 액센트 `#5B63D6`. 노트/푸터 색은 라이트 그레이(#8B92A0 / #C2C7CF).

## 배경 에셋

`assets/bg_L.png`·`bg_R.png` = 흰 배경 + 인디고 라디얼 글로우(rgba(91,99,214,.08)) 2560×1440. 라이트는 글로우를 다크보다 옅게.

## QA · 워크플로우 · 자매 스킬

dark-premium과 동일. 라이트 우선 체크: 본문 텍스트 #16181D(가독) · 인디고 #5B63D6(연하면 위반) · 카드 미세 그림자 · 흰 배경에서 글로우 과하지 않게.

## 참조

| 파일 | 용도 |
|---|---|
| `references/components.js` | 라이트 토큰 적용 전체 컴포넌트 + 실행 예시 |
| `assets/bg_L.png`·`bg_R.png` | 라이트 프리미엄 배경 |
| `assets/hnc-logo-black.png` | 검정 워드마크 |
| `suji-ppt-dark-premium/SKILL.md` | 구조·컴포넌트 원본 (이 스킬은 색만 반전) |
