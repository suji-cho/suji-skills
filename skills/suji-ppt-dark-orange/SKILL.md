---
name: suji-ppt-dark-orange
description: 다크 배경 + 주황(#FC5E20) 액센트 + 그레이 4단조의 한국 CEO·임원 보고용 단정한 PPTX를 생성합니다. '/suji-ppt-dark-orange'로 호출할 때만 활성화됩니다.
---

# 한국 CEO 보고용 다크 모노톤 PPTX 생성

검증된 템플릿 패턴을 기반으로 한컴 CEO 발표 톤(다크 배경 + 주황 단일 액센트 + 그레이 모노톤)의 PPTX를 생성한다. 자매 스킬:

- `bundo-ppt-ember` (다크 + 주황 다채로움, **컨퍼런스 활기**)
- `suji-ppt-light-purple` (라이트 + 인디고, **공식 기업 제안**)
- **본 스킬** (다크 + 주황 + 그레이 모노톤, **CEO 단정 보고**)

세 스킬이 동일 패턴 카탈로그(A~T)를 공유하므로 콘텐츠 구조는 호환된다.

## 워크플로우

```
1. 시나리오 설계 → 2. 레이아웃 선택 → 3. PPTX 생성
```

**Phase 1과 2 사이에 반드시 사용자 확인.** "기획서를 검토해주세요. 확인되면 생성하겠습니다."

---

## Phase 1: 시나리오 설계

### 사용자 인터뷰

파악할 것: **주제**, **청중**(주로 CEO·임원·이사회), **목표**, **분량** (기본 20-40장), **기존 콘텐츠**

### 구조 설계

```
1. 표지 (A 변형 — 거대 타이포)
2. 목차 (C — PART 01/02/03 챕터별 1-1, 1-2, 1-3 인덱스)
3. 챕터 디바이더 (PART 챕터 — 전면 다크 + 작은 주황 PART 라벨 + 거대 흰 제목)
4~N. [챕터 반복]:
   - 내용 슬라이드 3-7장 (좌상단 챕터 칩 + 헤더 + 다크 카드 그리드)
N+1. 요약/결론
N+2. 클로징 메시지 (O)
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

**본 스킬 고유 패턴** (`references/layout-patterns.md` 외 추가):

| 패턴 | 용도 |
|------|------|
| 거대 타이포 표지 | 두 단어를 다른 크기로 겹쳐(예: THE 30pt + SHIFT 64pt) — 라이트 그레이 + 흰색 |
| PART 챕터 디바이더 | "PART 01" 작은 주황 + 거대 44pt 흰 제목 가운데 — 전면 다크 |
| 수치 비교 행 | 현재값(그레이 40pt) → 화살표(주황) → 미래값(주황 60pt) + CAGR 알약 |
| 카테고리 카드 3단 | 영문 라벨 9ptB + 한글 20ptB + 설명 14pt 세로 스택 |
| 챕터 칩 헤더 | `#2A2A33` 작은 박스 + 흰 번호 + "PART N ┃ 섹션명" 라벨 |

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

**Pretendard**. 단일 패밀리, weight만 다름. CEO 보고 톤은 ExtraBold + Regular 2-tone이 중심.

```javascript
const FONT = {
  black:    "Pretendard Black",    // 매우 드물게 — 거대 타이포 표지 SHIFT 같은 한 단어
  exbold:   "Pretendard ExtraBold", // 헤드라인 기본
  bold:     "Pretendard Bold",
  semibold: "Pretendard SemiBold",
  medium:   "Pretendard Medium",
  regular:  "Pretendard Regular",
};
```

| 역할 | 크기 | fontFace | 색상 |
|------|------|----------|------|
| 거대 타이포 1단 (라이트 그레이) | 30pt | FONT.exbold | `#B0BEC5` |
| 거대 타이포 2단 (메인 키워드) | 64~74pt | FONT.exbold/black | `#FFFFFF` |
| 챕터 디바이더 제목 | 44pt | FONT.exbold | `#FFFFFF` |
| PART 라벨 (디바이더 위) | 18pt | FONT.exbold | `#FC5E20` |
| 메인 헤드라인 | 28pt | FONT.exbold | `#FFFFFF` |
| 카드 큰 숫자 | 40~60pt | FONT.exbold | `#FFFFFF` 또는 `#FC5E20` (강조) |
| 카드 큰 숫자 단위 | 26~28pt | FONT.exbold | 숫자와 동일 |
| 카드 한글 큰 타이틀 | 20pt | FONT.exbold | `#FFFFFF` |
| 카드 내 헤딩 | 18pt | FONT.exbold | `#FFFFFF` |
| 슬라이드 부제 | 13pt | FONT.regular | `#B0BEC5` |
| 본문 | 11~14pt | FONT.regular/medium | `#FFFFFF` 또는 `#B0BEC5` |
| 영문 라벨 / 챕터 칩 | 8~11pt | FONT.exbold | `#FFFFFF` 또는 `#B0BEC5` |
| 캡션 (연도·dim 메타) | 12pt | FONT.regular | `#8A8F99` |
| 출처/footnote | 8pt | FONT.regular | `#8A8F99` |

#### 텍스트 간격 규칙

타이틀과 설명 텍스트가 인접할 때:
- 타이틀 텍스트박스: `valign: "bottom"`
- 설명 텍스트박스: `valign: "top"`
- 간격: 타이틀 h 끝에서 +0.07" 오프셋

### 좌측 상단 헤더 (모든 내용 슬라이드 공통)

본 스킬의 시그니처 — **챕터 칩 + PART/섹션 라벨 + 헤드라인 + 부제** 4단 구조.

```javascript
// 1. 챕터 번호 칩
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.40, y: 0.35, w: 0.55, h: 0.30,
  fill: { color: "2A2A33" }, line: { type: "none" },
});
slide.addText("01", {
  x: 0.40, y: 0.35, w: 0.55, h: 0.30,
  fontSize: 8, fontFace: FONT.exbold, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0,
});

// 2. PART/섹션 라벨 (B0BEC5 + 흰 ┃ separator)
slide.addText([
  { text: "PART 1 ", options: { color: "B0BEC5", bold: true } },
  { text: "┃", options: { color: "FFFFFF", bold: true } },
  { text: " 1-1. HANCOM Already Shifted", options: { color: "B0BEC5", bold: true } },
], {
  x: 1.05, y: 0.35, w: 6.50, h: 0.30,
  fontSize: 11, fontFace: FONT.exbold, margin: 0, valign: "middle",
});

// 3. 메인 헤드라인
slide.addText("Earnings Surprise — 2025년 사상 최대 1,753억", {
  x: 0.40, y: 0.95, w: 12.53, h: 0.75,
  fontSize: 28, fontFace: FONT.exbold, color: "FFFFFF", margin: 0,
});

// 4. 부제 (옵션)
slide.addText("YoY +10.2% · 매출 162억 원 증가", {
  x: 0.40, y: 1.70, w: 12.53, h: 0.40,
  fontSize: 13, fontFace: FONT.regular, color: "B0BEC5", margin: 0,
});
```

예외: 챕터 디바이더(아래 별도 패턴)는 칩·헤더 없이 가운데 정렬 거대 제목.

### 반복 요소 (모든 슬라이드)

```javascript
// 로고 (우상단, 비율 4.55:1 유지, 다크 배경용 흰 워드마크)
slide.addImage({ path: "assets/hnc-logo-dark.png", x: 11.5, y: 0.5, w: 1.2, h: 0.264 });

// 좌하단 브랜드 (옵션)
slide.addText("[행사명/브랜드]", {
  x: 0.63, y: 6.9, w: 3, h: 0.3,
  fontSize: 11, fontFace: FONT.medium, color: "B0BEC5", margin: 0,
});
```

### 색상

```javascript
const COLOR = {
  bg:        "000000",  // 검정 — 기본 슬라이드 배경
  card:      "1A1A22",  // 배경보다 살짝 밝은 다크 — 메인 카드 배경
  cardAlt:   "2A2A33",  // 다크 그레이 — 챕터 칩, 보조 박스
  cardAlt2:  "3A3A45",  // 한 단계 더 밝은 다크 — 헤더바 변형
  cardAlt3:  "26242D",  // 또 다른 다크 — 미세 구분
  cardBlue:  "3C4A5E",  // 다크 블루그레이 — 카테고리 액센트 카드
  primary:   "FC5E20",  // 주황 — 핵심 강조, 챕터 번호, 큰 수치, CAGR 칩
  primaryAlt:"FF5A1F",  // 주황 변형 — 그라데이션·세컨더리 강조 (호환)
  primaryWarm:"FF6600", // 주황 따뜻한 변형 — 따스함 강조 (드물게)
  text:      "FFFFFF",  // 흰색 — 헤드라인·본문 기본
  textSub:   "B0BEC5",  // 라이트 블루그레이 — 부제·라벨·서브 데이터
  textDim:   "8A8F99",  // 미디엄 그레이 — 캡션·연도·dim 메타
  textMeta:  "5A5F69",  // 다크 그레이 — 미세 라벨 (산출 로직 등)
  divider:   "3A3A45",  // 카드 사이 미세 구분선
};
```

**규칙**:
- **본문 텍스트는 #FFFFFF 흰색 또는 #B0BEC5 라이트 그레이.** 다른 색 사용 금지.
- 슬라이드당 명시적 색상 4개 이하 (흰색 + 라이트 그레이 + 주황 + 카드 다크 1단)
- 주황은 **강조 1점**에만 — 슬라이드 전체에서 주황 객체가 너무 많으면 효과 사라짐
- 메인 헤드라인은 흰색만, 키워드 색 강조 X (CEO 톤 단정함)
- 큰 수치 비교 시: 현재값 = 흰색/그레이, 미래/목표값 = 주황 (시선 유도)

### 배경 (이미지 없음, solidFill만)

| 슬라이드 유형 | 배경 |
|-------------|------|
| 표지 (거대 타이포) | `#000000` 검정 |
| PART 챕터 디바이더 | `#000000` 검정 (전면) |
| 내용 슬라이드 | `#000000` 검정 + 카드는 `#1A1A22` |
| 클로징/감사 | `#000000` |

```javascript
slide.background = { color: "000000" };
```

**선택**: 표지·챕터 디바이더에 다크 wave 그라데이션 배경 이미지를 쓰면 분위기가 한층 깊어진다. 사용자가 직접 이미지를 제공한 경우 `assets/`에 추가하고 `slide.background = { path: "assets/bg_wave.jpeg" }`로 적용. 본 스킬은 디폴트로 solidFill만 사용.

### 카드 스타일

모든 카드는 pptxgenjs의 `ROUNDED_RECTANGLE`로 생성한다. 다크 테마의 카드는 **솔리드 다크 그레이**가 기본 (투명도 X — 솔리드가 더 단정함).

**메인 콘텐츠 카드**
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h, fill: { color: "1A1A22" }, rectRadius: 0.05,
});
```

**챕터 칩** (좌상단 번호)
```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.40, y: 0.35, w: 0.55, h: 0.30,
  fill: { color: "2A2A33" }, line: { type: "none" },
});
```

**CAGR / 강조 알약 칩** (주황 배경 + 흰 텍스트)
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w: 1.09, h: 0.30, fill: { color: "FC5E20" }, rectRadius: 0.05,
});
slide.addText("CAGR 39.3%", {
  x, y, w: 1.09, h: 0.30,
  fontSize: 14, fontFace: FONT.exbold, color: "FFFFFF",
  align: "center", valign: "middle", margin: 0,
});
```

**카테고리 카드 3단** (영문 라벨 + 한글 큰 글씨 + 설명)
```javascript
// 카드 배경
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y: 5.46, w: 3.03, h: 1.61, fill: { color: "1A1A22" }, rectRadius: 0.04,
});
// 영문 라벨
slide.addText("PUBLIC", {
  x: x + 0.22, y: 5.61, w: 2.72, h: 0.29,
  fontSize: 9, fontFace: FONT.exbold, color: "FFFFFF", margin: 0,
});
// 한글 큰 글씨
slide.addText("공공 · 정부", {
  x: x + 0.22, y: 5.92, w: 2.72, h: 0.46,
  fontSize: 20, fontFace: FONT.exbold, color: "FFFFFF", margin: 0,
});
// 설명
slide.addText("중앙부처·지방정부 데이터 주권", {
  x: x + 0.22, y: 6.44, w: 2.72, h: 0.51,
  fontSize: 14, fontFace: FONT.regular, color: "B0BEC5", margin: 0,
});
```

**ember/light-purple 패턴 그대로 쓸 때 색 매핑**:
- ember/light-purple 본문 텍스트 → `#FFFFFF` (다크 배경 위 흰색)
- ember 주황 액센트 → 그대로 `#FC5E20` 유지 (브랜드 동일)
- ember 골드/코랄/틸 다채로움 → **모두 그레이 단계(`#B0BEC5`, `#8A8F99`)로 모노톤화**
- light-purple 인디고 → `#FC5E20` 주황으로 교체
- 카드 배경 → `#1A1A22` 다크 솔리드

### 거대 타이포 표지 (본 스킬 시그니처)

두 단어를 다른 크기·색으로 겹쳐 배치. CEO 발표 표지의 강한 첫인상.

```javascript
// 1단어 (작고 라이트 그레이, 위쪽)
slide.addText("THE", {
  x: 0.39, y: 0.85, w: 5.00, h: 0.65,
  fontSize: 30, fontFace: FONT.exbold, color: "B0BEC5", margin: 0,
});
// 2단어 (크고 흰색, 살짝 오른쪽 아래로 오버랩)
slide.addText("SHIFT", {
  x: 1.51, y: 0.66, w: 5.00, h: 1.05,
  fontSize: 64, fontFace: FONT.exbold, color: "FFFFFF", margin: 0,
});
// 본문 선언 (28pt 흰 + 44pt 주황 + 28pt 흰 3행)
slide.addText("한컴은,", {
  x: 4.02, y: 3.30, w: 5.60, h: 0.60,
  fontSize: 28, fontFace: FONT.exbold, color: "FFFFFF",
});
slide.addText("Sovereign Agentic OS", {
  x: 4.02, y: 4.00, w: 5.60, h: 0.85,
  fontSize: 44, fontFace: FONT.exbold, color: "FC5E20",
});
slide.addText("기업으로 전환합니다.", {
  x: 4.02, y: 4.99, w: 5.60, h: 0.60,
  fontSize: 28, fontFace: FONT.exbold, color: "FFFFFF",
});
```

### PART 챕터 디바이더 (본 스킬 시그니처)

전면 다크 + 작은 주황 PART 라벨 + 거대 흰 제목, 가운데 정렬.

```javascript
slide.background = { color: "000000" };
// PART 라벨 (작은 주황)
slide.addText("PART 01", {
  x: 0, y: 2.90, w: 13.33, h: 0.60,
  fontSize: 18, fontFace: FONT.exbold, color: "FC5E20",
  align: "center", margin: 0,
});
// 거대 제목 (흰색)
slide.addText("The Proof : Already AI-Driven", {
  x: 0, y: 3.75, w: 13.33, h: 1.00,
  fontSize: 44, fontFace: FONT.exbold, color: "FFFFFF",
  align: "center", margin: 0,
});
```

### 수치 비교 행 (본 스킬 시그니처)

현재값 → 미래값을 화살표로 연결, CAGR 칩으로 마무리.

```javascript
// 현재값 (라이트 그레이)
slide.addText("$138", {
  x: 1.21, y: 4.85, w: 1.50, h: 0.80,
  fontSize: 40, fontFace: FONT.exbold, color: "B0BEC5",
});
slide.addText("억", {
  x: 2.30, y: 5.10, w: 0.60, h: 0.50,
  fontSize: 26, fontFace: FONT.exbold, color: "B0BEC5",
});
slide.addText("2025", {
  x: 1.24, y: 5.63, w: 0.79, h: 0.21,
  fontSize: 12, fontFace: FONT.regular, color: "B0BEC5",
});
// 화살표 (주황)
slide.addText("→", {
  x: 2.99, y: 4.91, w: 0.50, h: 0.60,
  fontSize: 28, fontFace: FONT.exbold, color: "FC5E20",
});
// 미래값 (주황 큰 폰트)
slide.addText("$1,408", {
  x: 3.63, y: 4.85, w: 2.00, h: 0.80,
  fontSize: 40, fontFace: FONT.exbold, color: "FC5E20",
});
slide.addText("억", {
  x: 5.45, y: 5.10, w: 0.60, h: 0.50,
  fontSize: 26, fontFace: FONT.exbold, color: "FC5E20",
});
slide.addText("2032", {
  x: 3.68, y: 5.63, w: 0.79, h: 0.21,
  fontSize: 12, fontFace: FONT.regular, color: "FFFFFF",
});
// CAGR 알약 칩
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.84, y: 6.23, w: 1.09, h: 0.30, fill: { color: "FC5E20" }, rectRadius: 0.05,
});
slide.addText("CAGR 39.3%", {
  x: 0.84, y: 6.23, w: 1.09, h: 0.30,
  fontSize: 14, fontFace: FONT.exbold, color: "FFFFFF",
  align: "center", valign: "middle",
});
```

### 미니카드 컴포넌트

큰 카드 안에 불릿 리스트 대신 **미니카드(아이콘+제목+설명)** 조합.

**의존성**: `npm install lucide-static sharp`

```javascript
const sharp = require("sharp");
const lucide = require("lucide-static");

async function iconToBase64(name, color = "#FC5E20", size = 256) {
  let svg = lucide[name];
  svg = svg.replace(/stroke="[^"]*"/g, `stroke="${color}"`);
  svg = svg.replace(/width="24"/, `width="${size}"`).replace(/height="24"/, `height="${size}"`);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function addMiniCard(slide, x, y, w, h, iconName, iconColor, title, desc) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, fill: { color: "1A1A22" }, rectRadius: 0.06,
  });
  const iconData = await iconToBase64(iconName, iconColor, 256);
  slide.addImage({ data: iconData, x: x + 0.12, y: y + 0.12, w: 0.3, h: 0.3 });
  slide.addText(title, {
    x: x + 0.5, y: y + 0.08, w: w - 0.6, h: 0.35,
    fontSize: 11, fontFace: FONT.exbold, color: "FFFFFF", margin: 0, valign: "middle",
  });
  slide.addText(desc, {
    x: x + 0.12, y: y + 0.5, w: w - 0.24, h: h - 0.55,
    fontSize: 9, fontFace: FONT.regular, color: "B0BEC5", margin: 0, lineSpacingMultiple: 1.2,
  });
}
```

**아이콘 색상 규칙**:
- 핵심/액센트: `#FC5E20` (주황) — 슬라이드당 1~2개 최대
- 보조: `#B0BEC5` (라이트 그레이) — 대부분 아이콘 기본값
- 원형 배경 없이 아이콘만 직접 배치

### 넘버카드 컴포넌트

숫자 자체가 비주얼. CEO 보고의 핵심 카드 — 큰 폰트로 임팩트.

```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w: 3.02, h: 2.68, fill: { color: "1A1A22" }, rectRadius: 0.05,
});
// 큰 숫자 + 단위
slide.addText([
  { text: "2.5", options: { fontSize: 40, color: "FFFFFF", bold: true } },
  { text: "조", options: { fontSize: 28, color: "FFFFFF", bold: true } },
], {
  x: x + 0.35, y: y + 0.06, w: 2.62, h: 0.90,
  fontFace: FONT.exbold, margin: 0,
});
// 큰 라벨
slide.addText("전 세계 PDF 누적 규모", {
  x: x + 0.35, y: y + 1.07, w: 2.62, h: 0.32,
  fontSize: 18, fontFace: FONT.exbold, color: "FFFFFF", margin: 0,
});
// dim 캡션
slide.addText("글로벌 추정", {
  x: x + 0.35, y: y + 1.49, w: 2.62, h: 0.26,
  fontSize: 12, fontFace: FONT.regular, color: "8A8F99", margin: 0,
});
```

### 1:1 비교 행 컴포넌트

Before/After (좌측 = 라이트 그레이 / 우측 = 주황). 패턴 S.

```javascript
const rows = [
  { left: "순차 개발", leftDesc: "순서대로", right: "병렬 자동화", rightDesc: "동시에",
    leftIcon: "ArrowRight", rightIcon: "Zap" },
];
// 좌측 아이콘 색: B0BEC5
// 우측 아이콘 색: FC5E20
// 행 사이 구분선: #3A3A45 0.5pt
```

### 아이폰 목업 컴포넌트

스크린샷을 폰 프레임 안에. 패턴 T.

**z-order**:
1. 프레임 `#1A1A22` + line `#3A3A45` ROUNDED_RECTANGLE (rectRadius: 0.2, bezel: 0.04")
2. 스크린샷 (라운드 처리된 PNG)
3. 다이나믹 아일랜드 `#000000` ROUNDED_RECTANGLE

```javascript
const frameW = 2.0, frameH = frameW * 2.17, bezel = 0.04;
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: px, y: py, w: frameW, h: frameH,
  fill: { color: "1A1A22" }, line: { color: "3A3A45", width: 0.5 }, rectRadius: 0.2,
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

- **`sizing` 옵션 사용 금지** — 이미지 비율 뒤틀림
- 원본을 x, y, w, h로 배치
- 스크린샷은 사전 리사이즈 + 라운드 처리

### 이미지 라운딩 (일반)

```javascript
const sharp = require("sharp");
const w = 701, h = 573, radius = 20;
const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect rx="${radius}" ry="${radius}" width="${w}" height="${h}" fill="white"/></svg>`);
await sharp("input.png").composite([{input: mask, blend: "dest-in"}]).png().toFile("rounded.png");
```

### 간트차트 컴포넌트

다크 톤에 맞춰 그리드선 dim, 바는 주황·그레이로 단순화.

```javascript
const months = ["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
const monthW = totalWidth / months.length;
months.forEach((m, i) => {
  slide.addText(m, { x: gx + i * monthW, y: gy, w: monthW, h: 0.25,
    fontSize: 9, fontFace: FONT.regular, color: "B0BEC5", margin: 0, align: "center" });
  if (i > 0) slide.addShape(pres.shapes.LINE, {
    x: gx + i * monthW, y: gy + 0.25, w: 0, h: barAreaHeight,
    line: { color: "3A3A45", width: 0.3 } });
});
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: gx + startMonth * monthW, y: barY, w: duration * monthW, h: 0.3,
  fill: { color: barColor }, rectRadius: 0.04 });
```

**색상 구분**: 팀/단계별 — 핵심=주황 `#FC5E20`, 일반=라이트 그레이 `#B0BEC5`, 보조=다크 그레이 `#3C4A5E`.

### 색상 감정 규칙

수치나 키워드에 감정을 실을 때 — 다크+모노톤이라 **주황 사용을 절제**하는 것이 핵심:

| 감정 | 색상 | 용도 |
|------|------|------|
| 핵심 강조 | `primary` (#FC5E20 주황) | 1위, 미래값, 핵심 메시지 (슬라이드당 1~2점) |
| 메인 | `text` (#FFFFFF 흰색) | 일반 헤드라인·본문 |
| 보조 | `textSub` (#B0BEC5 라이트 블루그레이) | 부제, 비교 대상의 baseline 값 |
| dim | `textDim` (#8A8F99 미디엄 그레이) | 캡션, 연도, 메타 |
| 미세 | `textMeta` (#5A5F69 다크 그레이) | 산출 로직, footnote 보조 |

**금지**:
- 빨강·노랑·초록 등 다채로운 색 사용 X (모노톤 정체성 훼손)
- 주황 객체 슬라이드당 3개 이상 X (강조 효과 사라짐)
- 카드 안에서 또 색을 쪼개기 X (이미 카드 자체가 강조 단위)

### 카드 내부 중앙정렬

ember/light-purple과 동일 공식. 카드 안에 텍스트·이미지 배치 시:
```
카드 y, h → 바닥 = y + h
콘텐츠 영역 시작 = y (헤더바 있으면 y + 헤더h)
콘텐츠 총 높이 계산 후: contentY = 시작 + (영역h - contentH) / 2
```

### 이미지 네이밍 규칙

Phase 2 시작 시 이미지 폴더에 해상도 prefix 자동 부여.

```bash
cd images/
for f in *.png *.jpg *.PNG *.JPG; do
  [ -f "$f" ] || continue
  echo "$f" | grep -qE '^[0-9]+x[0-9]+_' && continue
  dims=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | awk '/pixelWidth/{w=$2} /pixelHeight/{h=$2} END{printf "%dx%d", w, h}')
  mv "$f" "${dims}_${f}"
done
```

### QA

`/document-skills:pptx` 스킬의 QA 절차를 따른다. PPTX → 이미지 변환 후 서브에이전트 검수.

**본 스킬 우선 체크**:
- 본문 텍스트가 #FFFFFF 또는 #B0BEC5만 사용했는지 (다른 색 있으면 모노톤 위반)
- 주황 객체가 슬라이드당 3개 이상은 아닌지
- 카드 배경이 모두 `#1A1A22` 솔리드인지 (투명도 들어가 있으면 정체성 깨짐)
- 챕터 칩(좌상단 작은 박스)이 모든 내용 슬라이드에 일관되게 있는지

---

## 자매 스킬과의 관계

| 스킬 | 톤 | 배경 | 액센트 | 폰트 | 카드 | 용도 |
|------|---|------|--------|------|------|------|
| `bundo-skills:bundo-ppt-ember` | 다크 | #000000 | #FC5E20 + 다채로움 | Paperlogy | white 92% 투명 | 컨퍼런스 활기 |
| `suji-skills:suji-ppt-light-purple` | 라이트 | #FFFFFF | #200066 인디고 | Pretendard | #F0F0F0 그레이 | 공식 기업 제안 |
| **`suji-skills:suji-ppt-dark-orange`** | **다크** | **#000000** | **#FC5E20 단독** | **Pretendard** | **#1A1A22 솔리드** | **CEO 단정 보고** |

같은 패턴 카탈로그(A~T)를 공유. 토큰만 다름.

## 참조 파일

| 파일 | 용도 |
|------|------|
| `references/layout-patterns.md` | 패턴 A-T 인덱스 + 텍스트 아트 예제 (3개 자매 스킬 공통, 색·폰트 토큰만 본 SKILL.md의 매핑 표 적용) |
| `assets/hnc-logo-dark.png` | 다크 배경용 흰 워드마크 + 주황 액센트 (1200×264, 비율 4.55:1) |
