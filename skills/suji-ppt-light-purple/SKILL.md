---
name: suji-ppt-light-purple
description: 화이트 배경 + 딥 인디고(#200066) 액센트의 한국 기업·공식 컨퍼런스 톤 PPTX를 생성합니다. '/suji-ppt-light-purple'로 호출할 때만 활성화됩니다.
---

# 한국 라이트 인디고 PPTX 생성

검증된 템플릿 패턴을 기반으로 한컴 공식 톤(라이트 배경 + 딥 인디고 액센트)의 PPTX를 생성한다. 자매 스킬 `bundo-ppt-ember`(다크 + 주황)와 패턴 구조는 동일, 토큰(색·폰트·로고)만 다르다.

## 워크플로우

```
1. 시나리오 설계 → 2. 레이아웃 선택 → 3. PPTX 생성
```

**Phase 1과 2 사이에 반드시 사용자 확인.** "기획서를 검토해주세요. 확인되면 생성하겠습니다."

---

## Phase 1: 시나리오 설계

### 사용자 인터뷰

파악할 것: **주제**, **청중**, **목표**, **분량** (기본 20-30장), **기존 콘텐츠**

### 구조 설계

```
1. 표지 (A)
2. 발표자 소개 (B) — 선택
3. 목차 (C)
4~N. [챕터 반복]:
   - 섹션 구분 (D) — 인디고 풀스크린
   - 내용 슬라이드 3-7장
N+1. 요약/결론
N+2. 클로징 문장 (O)
N+3. 감사합니다 (P)
```

### 패턴 선택

`references/layout-patterns.md`의 인덱스에서 용도에 맞는 패턴을 선택한다.

| 카테고리 | 패턴 | 용도 |
|---------|------|------|
| 오프닝/클로징 | A, B, O, P | 표지, 소개, 마무리 |
| 네비게이션 | C, D | 목차, 섹션 전환 |
| 데이터/통계 | G, N, R | 숫자 설득, 벤치마크, 넘버카드 |
| 비교/대조 | F, H, S | 문제→해결, A vs B, 1:1 매칭 행 |
| 프로세스/플로우 | E, K | 타임라인, 흐름도 |
| 피처/제품 | L, M, Q | 개요, 기능 나열, 미니카드 그리드 |
| 아이콘/그리드 | I, J | Use case, 로고 |
| 디바이스 목업 | T | 아이폰 스크린샷 |

### 텍스트 아트 작성

`references/layout-patterns.md`에서 해당 패턴의 예제를 참고하여 실제 콘텐츠를 넣은 텍스트 아트를 작성한다. `deck-plan.md`로 저장하고 사용자 확인을 받는다.

---

## Phase 2: PPTX 생성

### Step 0: 이미지 리소스 준비

PPTX 코드 작성 전에 이미지를 먼저 정리한다.

**1. 사용자에게 묻기:**
- "이미지 원본이 있는 폴더 경로를 알려주세요"
- "PPTX 리소스를 저장할 폴더 경로를 알려주세요 (기본: `images/`)"

**2. 원본 스캔 → 해상도 확인:**
```bash
for f in source_folder/*.png source_folder/*.jpg; do
  dims=$(sips -g pixelWidth -g pixelHeight "$f" | awk '/pixelWidth/{w=$2} /pixelHeight/{h=$2} END{printf "%dx%d", w, h}')
  echo "$f: $dims"
done
```

**3. 전처리 → 리소스 폴더에 저장:**

| 처리 | 기준 | 방법 |
|------|------|------|
| 리사이즈 | 너비 1300px 초과 | `sharp().resize(1300)` |
| 라운딩 | 일반 이미지 | sharp + SVG 마스크, radius 20px |
| 라운딩 | 폰 스크린샷 | radius 40px |
| 폰 리사이즈 | 아이폰 원본 | `sips -z 932 430` 후 라운딩 |

**4. 파일명 규칙:**
```
{width}x{height}_{english-slug}.png
```
예: `1300x731_claude-code-ide.png`, `430x932_phone-viral-english.png`

**5. 해상도 prefix 자동 부여:**
```bash
for f in *.png; do
  echo "$f" | grep -qE '^[0-9]+x[0-9]+_' && continue
  dims=$(sips -g pixelWidth -g pixelHeight "$f" | awk '/pixelWidth/{w=$2} /pixelHeight/{h=$2} END{printf "%dx%d", w, h}')
  mv "$f" "${dims}_${f}"
done
```

**6. 완료 후 사용자에게 이미지 목록 보여주고 확인받기.**

---

`/document-skills:pptx` 스킬을 호출하여 pptxgenjs로 생성한다.

### 슬라이드 설정

```javascript
pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"
```

### 폰트

**Pretendard**. 단일 패밀리, weight만 다름. 미설치 시 시스템 기본(맑은 고딕)으로 대체.

```javascript
const FONT = {
  exbold:   "Pretendard ExtraBold",
  bold:     "Pretendard Bold",
  semibold: "Pretendard SemiBold",
  medium:   "Pretendard Medium",
  regular:  "Pretendard Regular",
  serif:    "Noto Serif KR",  // 장식용 — 키워드 강조 시 드물게
};
```

| 역할 | 크기 | fontFace |
|------|------|----------|
| 표지 메인 | 66pt | FONT.exbold |
| 표지 서브 | 40pt | FONT.medium |
| 섹션 번호 (패턴 D) | 44pt | FONT.exbold |
| 큰 숫자/통계 | 36pt | FONT.exbold |
| 메인 헤드라인 | 28pt | FONT.exbold |
| 제품명/서브 헤드라인 | 24pt | FONT.exbold |
| 슬라이드 제목 | 20pt | FONT.semibold |
| 카드 내 타이틀 | 18pt | FONT.exbold |
| 카드 헤더/항목 타이틀 | 14pt | FONT.semibold |
| 본문 | 11pt | FONT.medium |
| 섹션 라벨 | 10pt | FONT.medium |
| 캡션/출처 | 8pt | FONT.regular |

#### 텍스트 간격 규칙

타이틀과 설명 텍스트가 인접할 때:
- 타이틀 텍스트박스: `valign: "bottom"`
- 설명 텍스트박스: `valign: "top"`
- 간격: 타이틀 h 끝에서 +0.07" 오프셋 (붙이지도, 벌리지도 않는 미세 간격)
- 예: 타이틀 y=2.0, h=0.4 → 설명 y=2.47

### 좌측 상단 헤더 (모든 내용 슬라이드 공통)

```javascript
// 모든 내용 슬라이드에서 이 코드를 동일하게 사용
slide.addText("챕터명", {
  x: 0.63, y: 0.35, w: 6, h: 0.3,
  fontSize: 10, fontFace: FONT.medium, color: "000000", margin: 0,
});
slide.addText("슬라이드 제목", {
  x: 0.63, y: 0.55, w: 8, h: 0.5,
  fontSize: 20, fontFace: FONT.semibold, color: "200066", margin: 0,
});
```

예외: 패턴 D (섹션 구분)만 라벨 없이 44pt 대형 제목, 인디고 풀스크린 배경에 흰 글씨.

### 반복 요소 (모든 슬라이드)

```javascript
// 로고 (비율 4.55:1 유지, 라이트 배경용 검정 로고)
slide.addImage({ path: "assets/hnc-logo-light.png", x: 11.5, y: 0.5, w: 1.2, h: 0.264 });

// 좌하단 브랜드
slide.addText("[행사명/브랜드]", {
  x: 0.63, y: 6.9, w: 3, h: 0.3,
  fontSize: 11, fontFace: FONT.medium, color: "000000", margin: 0,
});
```

### 색상

```javascript
const COLOR = {
  bg:         "FFFFFF",  // 화이트 — 기본 슬라이드 배경
  primary:    "200066",  // 딥 인디고 — 제목, 헤더바, 섹션 디바이더 배경, 핵심 강조
  secondary:  "4D3385",  // 진보라 — 보조 액센트, 카드 내 항목 강조
  accent:     "CFB8FF",  // 라일락 — 부드러운 강조, 배지
  text:       "000000",  // 블랙 — 본문 텍스트 기본
  textSub:    "303030",  // 차콜 — 보조 설명
  cardBg:     "F0F0F0",  // 라이트 그레이 — 패널/카드 배경
  cardAlt:    "E7E7E7",  // 그레이 — 보조 카드, 칩 배경
  cardSoft:   "E3E3E3",  // 미들 그레이 — 카드 그리드 본문
  cardDark:   "BFBFBF",  // 다크 그레이 — 강조 칩, 푸터 바
  white:      "FFFFFF",  // 흰색 — 인디고 헤더 위 텍스트
  serif:      "Noto Serif KR",  // 폰트명 (장식 키워드용)
};
```

**규칙**:
- **본문 텍스트는 #000000 기본. 인디고 헤더바 위에서만 #FFFFFF.**
- 슬라이드당 명시적 색상 3개 이하 (인디고 + 그레이 단계 + 블랙)
- 메인 헤드라인: 키워드만 `primary` (인디고), 나머지 `text` (블랙)
- 카드 헤더바: `primary` (인디고) + 흰 글씨
- 카드 본문 라벨: `primary` (인디고) + SemiBold/ExtraBold
- 보조 강조(드물게): `secondary` (진보라) 또는 `accent` (라일락 배지)

### 배경 (이미지 없음, solidFill만)

| 슬라이드 유형 | 배경 | 비고 |
|-------------|------|------|
| 표지 (패턴 A) | `#FFFFFF` 또는 `#200066` | 풀 인디고면 텍스트 흰색 |
| 섹션 디바이더 (패턴 D) | `#200066` 풀스크린 | 흰 44pt 번호 + 28pt 제목 |
| 내용 슬라이드 (그 외) | `#FFFFFF` | 카드는 `#F0F0F0`/`#E7E7E7` 그레이 |
| 클로징/감사 (패턴 P) | `#FFFFFF` 또는 `#200066` | 톤에 따라 선택 |

```javascript
// 슬라이드 단위 배경
slide.background = { color: "FFFFFF" };
// 또는 인디고 풀스크린
slide.background = { color: "200066" };
```

### 카드 스타일

모든 카드는 pptxgenjs의 `ROUNDED_RECTANGLE`로 생성한다. 라이트 테마에선 **솔리드 그레이**가 기본 (다크 테마처럼 투명도 X).

**콘텐츠 카드** — 내용 영역 배경 (라이트 그레이 솔리드)
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h, fill: { color: "F0F0F0" }, rectRadius: 0.05,
});
```

**헤더 바** — 카드 상단, 인디고
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h: 0.42, fill: { color: "200066" }, rectRadius: 0.05,
});
```

**3컬럼 환경 진단 카드** (레퍼런스 deck의 핵심 패턴 — 패턴 G 변형)

윗단 큰 인디고 헤더(h≈1.15") + 하단 그레이 본문 그리드(h≈0.88" × N행).

```javascript
// 상단 인디고 헤더 카드 (3컬럼)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y: 1.81, w: 3.01, h: 0.85, fill: { color: "200066" }, rectRadius: 0.05,
});
slide.addText("고객 기대 수준 대응 및 경쟁 우위 확보 필요", {
  x, y: 2.16, w: 3.01, h: 0.19,
  fontSize: 14, fontFace: FONT.bold, color: "FFFFFF", align: "center",
});
// 하단 본문 카드 (회색, 정보 행 반복)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y: 2.83, w: 3.01, h: 0.66, fill: { color: "E3E3E3" }, rectRadius: 0.04,
});
```

**Pain Point / Workflow / Key Feature 패널** (레퍼런스 deck의 핵심 패턴 — 패턴 H 변형)

짧은 인디고 헤더바(h≈0.32") + 라이트 그레이 본문 패널(h≈본문량) 조합.

```javascript
// 헤더 바
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h: 0.32, fill: { color: "200066" }, rectRadius: 0.04,
});
slide.addText("Pain Point", {
  x: x + 0.12, y, w: w - 0.24, h: 0.32,
  fontSize: 12, fontFace: FONT.bold, color: "FFFFFF", valign: "middle",
});
// 본문 패널
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y: y + 0.36, w, h: bodyH, fill: { color: "F0F0F0" }, rectRadius: 0.04,
});
```

**피처 카드** — 패턴 M용, 아이콘 상단 + 텍스트 하단
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w: 2.7, h: 3.5, fill: { color: "F0F0F0" }, rectRadius: 0.15,
});
// 인디고 타이틀 바 (카드 하단부에 고정)
slide.addShape(pres.shapes.RECTANGLE, {
  x, y: y + 1.7, w: 2.7, h: 0.7, fill: { color: "200066" },
});
```

패턴 I, L 등 복잡한 레이아웃은 `references/layout-patterns.md`의 텍스트 아트와 수치를 참조한다. **색상만 다크→라이트로 매핑**:
- ember `#000000` 배경 → light-purple `#FFFFFF`
- ember `#FFFFFF` 텍스트 → light-purple `#000000`
- ember `#FC5E20` 주황 액센트 → light-purple `#200066` 인디고
- ember `#F4B147` 골드 → light-purple `#4D3385` 진보라
- ember `#E07676` 코랄 → light-purple `#CFB8FF` 라일락 (또는 그레이)

### 미니카드 컴포넌트

큰 카드 안에 불릿 리스트를 넣으면 밋밋하다. **미니카드(아이콘+제목+설명)** 조합을 사용한다.

**의존성**: `npm install lucide-static sharp`

```javascript
const sharp = require("sharp");
const lucide = require("lucide-static");

async function iconToBase64(name, color = "#200066", size = 256) {
  let svg = lucide[name];
  svg = svg.replace(/stroke="[^"]*"/g, `stroke="${color}"`);
  svg = svg.replace(/width="24"/, `width="${size}"`).replace(/height="24"/, `height="${size}"`);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function addMiniCard(slide, x, y, w, h, iconName, iconColor, title, desc) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: "F0F0F0" }, rectRadius: 0.06,
  });
  const iconData = await iconToBase64(iconName, iconColor, 256);
  slide.addImage({ data: iconData, x: x + 0.12, y: y + 0.12, w: 0.3, h: 0.3 });
  slide.addText(title, {
    x: x + 0.5, y: y + 0.08, w: w - 0.6, h: 0.35,
    fontSize: 11, fontFace: FONT.exbold, color: "000000", margin: 0, valign: "middle",
  });
  slide.addText(desc, {
    x: x + 0.12, y: y + 0.5, w: w - 0.24, h: h - 0.55,
    fontSize: 9, fontFace: FONT.medium, color: "303030", margin: 0, lineSpacingMultiple: 1.2,
  });
}
```

**배치 패턴**:
- **3x2 그리드**: 제품 피처 6개 (패턴 Q)
- **Nx1 세로 스택**: 전략/방법론 나열 (패턴 Q 변형)
- **1x3 가로 카드**: 3가지 핵심 포인트 (패턴 Q 변형)

**아이콘 색상 규칙**:
- 핵심/긍정: `#200066` (인디고)
- 보조: `#4D3385` (진보라)
- 부드러운 강조: `#CFB8FF` (라일락) — 작은 배지/태그용
- 원형 배경 없이 아이콘만 직접 배치 (좌표 틀어짐 방지)

### 넘버카드 컴포넌트

숫자 자체가 비주얼인 카드. 아이콘 대신 큰 숫자를 사용한다 (패턴 R).

```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h, fill: { color: "F0F0F0" }, rectRadius: 0.06,
});
slide.addText("2,100", {
  x: x + 0.12, y: y + 0.1, w: 1.8, h: h - 0.2,
  fontSize: 32, fontFace: FONT.exbold, color: COLOR.primary, margin: 0, valign: "middle",
});
slide.addText("GitHub Stars\n6개월간 정체", {
  x: x + 2.0, y: y + 0.1, w: w - 2.2, h: h - 0.2,
  fontSize: 11, fontFace: FONT.medium, color: "000000", margin: 0, valign: "middle",
});
```

### 1:1 비교 행 컴포넌트

Before/After를 같은 높이에서 1:1 매칭하는 리스트 행 (패턴 S).

```javascript
const rows = [
  { left: "순차 개발", leftDesc: "순서대로", right: "병렬 자동화", rightDesc: "동시에", leftIcon: "ArrowRight", rightIcon: "Zap" },
];
for (const row of rows) {
  // 좌측: 아이콘(진보라 #4D3385) + 제목 + 설명
  // 우측: 아이콘(인디고 #200066) + 제목 + 설명
  // 행 사이 구분선 (마지막 제외) — #BFBFBF 0.5pt
}
```

### 아이폰 목업 컴포넌트

스크린샷을 폰 프레임 안에 배치 (패턴 T).

**이미지 전처리**:
```javascript
// 1. 리사이즈: sips -z 932 430 original.PNG --out phone.png
// 2. 라운드 코너: sharp + SVG 마스크 (radius 40px)
const mask = Buffer.from('<svg width="430" height="932"><rect rx="40" ry="40" width="430" height="432" fill="white"/></svg>');
await sharp("phone.png").composite([{input: mask, blend: "dest-in"}]).png().toFile("rounded.png");
```

**z-order** (추가 순서 = z축):
1. 프레임 `#303030` + `line: #BFBFBF` ROUNDED_RECTANGLE (rectRadius: 0.2, bezel: 0.04")
2. 스크린샷 이미지 (라운드 처리된 PNG)
3. 다이나믹 아일랜드 `#000000` ROUNDED_RECTANGLE (알약형, 이미지 위에 겹침)

**라이트 배경에선 프레임이 너무 어두우면 무거워 보인다.** `#303030` 본체 + 얇은 외곽선(`#BFBFBF`, 0.5pt)로 가볍게 처리.

```javascript
const frameW = 2.0, frameH = frameW * 2.17, bezel = 0.04;
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: px, y: py, w: frameW, h: frameH,
  fill: { color: "303030" }, line: { color: "BFBFBF", width: 0.5 }, rectRadius: 0.2,
});
slide.addImage({ path: "rounded-phone.png",
  x: px + bezel, y: py + bezel, w: frameW - bezel*2, h: frameH - bezel*2,
});
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: px + frameW/2 - 0.26, y: py + 0.10, w: 0.52, h: 0.12,
  fill: { color: "000000" }, rectRadius: 0.06,
});
```

### 이미지 정책

- **`sizing` 옵션 사용 금지** — 이미지 비율이 뒤틀린다
- 원본을 x, y, w, h로 배치하고 PPT에서 수동 조정
- 스크린샷은 사전에 리사이즈 + 라운드 처리 후 삽입

### 이미지 라운딩 (일반)

라이트 배경에서 차트·스크린샷도 모서리를 라운딩하면 부드럽게 어우러진다.

```javascript
const sharp = require("sharp");
const w = 701, h = 573, radius = 20;
const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect rx="${radius}" ry="${radius}" width="${w}" height="${h}" fill="white"/></svg>`);
await sharp("input.png").composite([{input: mask, blend: "dest-in"}]).png().toFile("rounded.png");
```

**radius 가이드**: 일반 이미지 20px, 폰 스크린샷 40px.

### 간트차트 컴포넌트

프로젝트 일정을 시각화할 때 사용. pptxgenjs 도형으로 구성.

```javascript
const months = ["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
const monthW = totalWidth / months.length;
months.forEach((m, i) => {
  slide.addText(m, { x: gx + i * monthW, y: gy, w: monthW, h: 0.25,
    fontSize: 9, fontFace: FONT.regular, color: "000000", margin: 0, align: "center" });
  if (i > 0) slide.addShape(pres.shapes.LINE, {
    x: gx + i * monthW, y: gy + 0.25, w: 0, h: barAreaHeight,
    line: { color: "BFBFBF", width: 0.3 } });
});
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: gx + startMonth * monthW, y: barY, w: duration * monthW, h: 0.3,
  fill: { color: barColor }, rectRadius: 0.04 });
```

**색상 구분**: 팀/단계별로 다른 색상 사용 (인디고=핵심개발, 진보라=설계/연구, 라일락=안정화/검수, 그레이=대기/외부의존).

### 색상 감정 규칙

숫자나 키워드에 감정을 실을 때:

| 감정 | 색상 | 용도 |
|------|------|------|
| 핵심/긍정 | `primary` (#200066 인디고) | 1위, 달성, 핵심 메시지 |
| 보조 강조 | `secondary` (#4D3385 진보라) | 보조 KPI, 부가 강조 |
| 부드러운 액센트 | `accent` (#CFB8FF 라일락) | 배지·태그·미세 강조 |
| 중립 | `text` (#000000 블랙) | 일반 데이터 |
| 보조 설명 | `textSub` (#303030 차콜) | 캡션, 부연 |
| 비활성/제약 | `cardDark` (#BFBFBF 다크그레이) | 정체, 제약, 미적용 |

**라이트 테마에는 강한 부정/레드 톤을 디폴트로 두지 않는다.** 정말 필요한 경우만 빨강(#E07676 등) 별도 정의.

### 카드 내부 중앙정렬

카드 안에 이미지+텍스트를 배치할 때, 헤더바 아래~카드 하단 사이에서 상하 중앙을 맞춘다.

```
카드 y=1.3, h=5.2 → 바닥=6.5
헤더바 h=0.42 → 콘텐츠 시작=1.72
콘텐츠 영역 높이 = 6.5 - 1.72 = 4.78"
콘텐츠 총 높이 계산 후: contentY = 1.72 + (4.78 - contentH) / 2
```

### 섹션 간지 색상 패턴

인디고 풀스크린 배경 위에 번호와 제목을 흰색·라일락으로 대비.

```javascript
// 슬라이드 배경 인디고
slide.background = { color: "200066" };
// 번호 = 라일락 (부드러운 강조, 시선 유도)
slide.addText("01.", { color: "CFB8FF", fontSize: 44, fontFace: FONT.exbold });
// 제목 = 흰색 (가장 진한 대비, 핵심 메시지)
slide.addText("챕터 제목", { color: "FFFFFF", fontSize: 28, fontFace: FONT.exbold });
```

### 이미지 네이밍 규칙

**Phase 2 시작 시** 이미지 폴더의 모든 파일에 해상도 prefix를 붙인다.

**형식**: `{width}x{height}_{원본파일명}.{ext}`

**자동 rename 스크립트** (Phase 2 첫 단계로 실행):
```bash
cd images/
for f in *.png *.jpg *.PNG *.JPG; do
  [ -f "$f" ] || continue
  echo "$f" | grep -qE '^[0-9]+x[0-9]+_' && continue
  dims=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | awk '/pixelWidth/{w=$2} /pixelHeight/{h=$2} END{printf "%dx%d", w, h}')
  mv "$f" "${dims}_${f}"
done
```

**효과**: AI와 사용자 모두 파일명만 보고 비율 계산 가능
```
430x932_phone-IMG_4922.png   → 비율 0.46 (세로형)
1290x2796_IMG_4924.PNG       → 비율 0.46 (세로형)
701x573_benchmark-overall.png → 비율 1.22 (가로형)
640x360_stars-chart.png      → 비율 1.78 (와이드)
```

### QA

`/document-skills:pptx` 스킬의 QA 절차를 따른다. PPTX → 이미지 변환 후 서브에이전트에게 검수 요청. **라이트 테마는 흰 배경에 텍스트 가독성이 핵심** — 본문 텍스트가 그레이가 아닌 블랙인지, 인디고가 보라/네이비로 잘못 렌더되지 않는지 우선 확인.

---

## 자매 스킬과의 관계

| 스킬 | 톤 | 배경 | 액센트 | 폰트 | 용도 |
|------|---|------|--------|------|------|
| `bundo-ppt-ember` | 다크 | #000000 | #FC5E20 주황 | Paperlogy | 임팩트·발표·컨퍼런스 |
| **`suji-ppt-light-purple`** | **라이트** | **#FFFFFF** | **#200066 인디고** | **Pretendard** | **공식·기업·고객 제안** |

같은 패턴 카탈로그(A~T)를 공유하므로 콘텐츠 구조는 호환된다.

## 참조 파일

| 파일 | 용도 |
|------|------|
| `references/layout-patterns.md` | 패턴 A-T 인덱스 + 텍스트 아트 예제 (ember와 동일, 색·폰트 토큰만 본 SKILL.md의 매핑 표 적용) |
| `assets/hnc-logo-light.png` | 라이트 배경용 검정 워드마크 (1200×264, 비율 4.55:1) |
