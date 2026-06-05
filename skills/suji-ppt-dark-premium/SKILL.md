---
name: suji-ppt-dark-premium
description: 다크 프리미엄(Linear/Notion 톤) PPTX 생성. HTML/CSS로 렌더한 다크 그라데이션·글로우 배경(에셋) 위에 pptxgenjs 네이티브 텍스트·컴포넌트를 올려 "프리미엄 룩 + PowerPoint 편집 가능"을 동시 달성. 경영 보고·제안·임팩트 발표용. 자매: suji-ppt-light-premium(라이트 동일 구조).
---

# 다크 프리미엄 PPTX 생성 (Dark Premium)

near-black 배경 + 글로우 + 큰 자신감 있는 타이포 + 인디고 단일 액센트. Linear·Notion 결의 임팩트. **핵심 = 하이브리드:** 프리미엄 배경은 HTML/CSS 렌더 이미지(에셋), 그 위 내용은 네이티브 pptxgenjs(편집 가능).

## 3대 정체성 (절대 규칙)

1. **하이브리드 빌드** — 배경(그라데이션·글로우)은 `assets/bg_L.png`·`bg_R.png`(HTML 렌더 에셋)를 `slide.background={path}`로. 내용은 전부 네이티브 pptxgenjs. 절대 슬라이드 전체를 이미지로 임베드하지 말 것(편집성 상실).
2. **큰 타이포가 1순위 레버** — 표지 46pt+, 헤드라인 36pt+, 큰 stat 48pt+. 소심한 작은 타이포 금지. 위계 대비 크게.
3. **모노크롬 베이스 + 인디고 단일 액센트** — 텍스트는 off-white(#F4F5F7)/그레이 단계, 강조는 인디고(#A9B2FF) 하나만. 다색 금지. 윤곽선 클립아트 도형 금지(솔리드·정제).

## 워크플로우

```
1. 내용 설계 (슬라이드별 결론·데이터·시각화 의도)
2. 배경 에셋 확인 (assets/bg_L·bg_R / 필요시 bg.html 재렌더)
3. pptxgenjs 스크립트 작성 (배경 이미지 + 네이티브 컴포넌트)
4. node 실행 → pptx → QA
```
**Phase 1↔2 사이 사용자 확인** ("기획서 검토해주세요. 확인되면 생성").

## 슬라이드 설정 · 폰트

```javascript
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
const F = "Pretendard"; // weight는 bold:true/false로
```

## 색상 토큰 (다크)

```javascript
const TXT="F4F5F7", SUB="9CA3AF", DIM="5C6470", DIM2="3F454F",
      ACC="A9B2FF", ACC2="8C95E8",           // 인디고 단일 액센트
      CARD="0F1118", CARDB="2A2E3A",          // 카드 fill / border
      TRK="1C1F28", BG="08090A";              // 바 트랙 / 배경(에셋이 대체)
```
규칙: 본문 = TXT/SUB만. 강조 키워드·핵심 수치·핵심 바 = ACC 하나. 그 외 색 금지.

## 배경 에셋 (HTML 렌더 — 1회)

`assets/bg_L.png`(좌상단 글로우), `bg_R.png`(우상단 글로우) = 2560×1440. 재생성:
```html
<!-- bg.html : #08090A + radial-gradient(rgba(110,120,214,.20)) 글로우 -->
```
표지·시장·제품 = 좌글로우(bg_L), 그 외 본문 = 우글로우(bg_R) 권장. `slide.background = { path: "assets/bg_L.png" }`.

## 컴포넌트 라이브러리 (네이티브 — references/components.js 전체)

핵심 헬퍼 (좌표 inch):
```javascript
const RC=pres.shapes.RECTANGLE, RR=pres.shapes.ROUNDED_RECTANGLE, LN=pres.shapes.LINE, OV=pres.shapes.OVAL;
// 우상단 로고 (다크 = 흰 워드마크 텍스트 또는 hnc-logo-white.png)
function logo(s){ s.addText([{text:"HANCOM",options:{color:"D7DAE0"}},{text:".",options:{color:ACC}}],
  {x:10.9,y:0.5,w:1.9,h:0.3,fontFace:F,fontSize:14,bold:true,align:"right",margin:0}); }
// 챕터 헤더 (번호 약하게 + 라벨 얇게 + 타이트)
function chead(s,no,label,tag){ s.addText(no,{x:0.7,y:0.62,w:0.5,h:0.28,fontFace:F,fontSize:13,bold:true,color:DIM,valign:"middle",margin:0});
  s.addText(label.toUpperCase(),{x:1.12,y:0.62,w:8,h:0.28,fontFace:F,fontSize:11,color:DIM,charSpacing:2.5,valign:"middle",margin:0});
  if(tag) s.addText(tag,{x:9.0,y:0.62,w:3.6,h:0.28,fontFace:F,fontSize:11,bold:true,color:ACC,align:"right",valign:"middle",margin:0}); }
function h2(s,t){ s.addText(t,{x:0.7,y:0.92,w:11,h:0.6,fontFace:F,fontSize:36,bold:true,color:TXT,charSpacing:-0.5,margin:0}); }
function lead(s,t){ s.addText(t,{x:0.72,y:1.6,w:11.5,h:0.34,fontFace:F,fontSize:14,color:SUB,margin:0}); }
// 카드 = 솔리드 다크 + 보더, 라벨은 박스 밖 위 또는 카드 안 상단
function card(s,x,y,w,h,title){ s.addShape(RR,{x,y,w,h,fill:{color:CARD},line:{color:CARDB,width:1},rectRadius:0.09});
  if(title) s.addText(title.toUpperCase(),{x:x+0.34,y:y+0.28,w:w-0.6,h:0.3,fontFace:F,fontSize:11,color:DIM,charSpacing:1.4,margin:0}); }
// 큰 stat
function stat(s,v,cap,x,y,w){ s.addText(v,{x,y,w,h:0.85,fontFace:F,fontSize:48,bold:true,color:TXT,charSpacing:-1.5,margin:0});
  s.addText(cap,{x:x+0.02,y:y+0.86,w,h:0.3,fontFace:F,fontSize:10.5,color:DIM,margin:0}); }
// 가로 바 (track + fill, hi=액센트)
function bar(s,x,y,w,frac,label,val,hi){ s.addText(label,{x,y:y-0.02,w:3,h:0.26,fontFace:F,fontSize:12.5,color:SUB,margin:0});
  s.addText(val,{x:x+w-3,y:y-0.02,w:3,h:0.26,fontFace:F,fontSize:13,bold:true,color:hi?ACC:TXT,align:"right",margin:0});
  s.addShape(RR,{x,y:y+0.32,w,h:0.16,fill:{color:TRK},line:{type:"none"},rectRadius:0.08});
  s.addShape(RR,{x,y:y+0.32,w:Math.max(0.2,w*frac),h:0.16,fill:{color:hi?ACC:ACC2},line:{type:"none"},rectRadius:0.08}); }
// 하단 고정 노트 + 푸터 + 페이지no
function note(s,t){ s.addText(t,{x:0.7,y:6.5,w:11.9,h:0.4,fontFace:F,fontSize:11,color:"6B7280",valign:"middle",margin:0}); }
function foot(s,no){ s.addText("…footer…",{x:0.7,y:7.04,w:9,h:0.24,fontFace:F,fontSize:9,color:DIM2,margin:0});
  s.addText(no,{x:12.2,y:7.02,w:0.5,h:0.26,fontFace:F,fontSize:11,bold:true,color:"4A5160",align:"right",margin:0}); }
```
추가 컴포넌트(`references/components.js`): **waterfall**(세로 바 4단, 마진만 ACC) · **price ladder**(축 + 점, 자기 점 ACC·확대·글로우) · **table**(헤더 DIM 소형캡스, 행 보더, ID열 ACC) · **2-layer 다이어그램**(alt 박스=ACC 틴트) · **equation 카드** · **BM 동심원 노드**(좌─중앙동심원─우 + 점선). 전부 다크 토큰.

## 레이아웃 규칙

- 헤더(번호+라벨+제목) 타이트, 부제와 본문 사이 간격 확보, **박스 그룹 타이틀은 박스 밖 위**, **노트는 하단 고정(y≈6.5)**, 박스는 수직 중앙 쪽.
- 한 슬라이드 = **지배적 요소 하나**(큰 헤드라인/큰 수치/강한 차트). 작은 요소 고르게 흩뿌리지 말 것.
- 표는 가능한 차트/다이어그램으로(ladder·waterfall·bar·동심원).

## QA

`node gen.js` → `~/Desktop/*.pptx`. PowerPoint 열어: 텍스트 편집 가능(네이티브) 확인 · 배경 풀블리드 · 타이포 충분히 큰지 · 액센트 인디고 1색만 · 태그/로고 겹침 없는지(태그 x=9.0). 이미지 변환 검수는 로컬 서버+browse 스크린샷 또는 LibreOffice.

## 자매 스킬

| 스킬 | 톤 | 배경 | 액센트 |
|---|---|---|---|
| **suji-ppt-dark-premium** | 다크 #08090A | 다크 글로우 | 인디고 #A9B2FF |
| suji-ppt-light-premium | 라이트 #FFFFFF | 라이트 글로우 + 미세 그림자 | 인디고 #5B63D6 |

구조·컴포넌트 100% 공유, 색·배경 에셋·로고만 라이트로 반전.

## 참조

| 파일 | 용도 |
|---|---|
| `references/components.js` | 전체 컴포넌트 + 실행 가능한 예시 덱(node로 바로 렌더) |
| `assets/bg_L.png`·`bg_R.png` | 다크 프리미엄 배경 (2560×1440) |
| `assets/hnc-logo-white.png` | 흰 워드마크 (이미지 로고 쓸 때) |
