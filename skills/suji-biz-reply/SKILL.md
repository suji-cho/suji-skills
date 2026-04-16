---
name: suji-biz-reply
description: OpenDataLoader 비즈니스 문의 메일 기본 답변 생성. Gmail 브라우저 확인 → 문의 파악 → 기본 답변 초안 작성.
---

# suji-biz-reply

OpenDataLoader 비즈니스 문의에 대한 초기 답변을 생성한다.
반복되는 문의 패턴에 맞춰 기본 질문을 포함한 답변 초안을 작성한다.

**scope: work only**

## 커맨드

```
/suji-biz-reply          → Gmail 열기 + 미회신 문의 확인 + 답변 초안 생성
/suji-biz-reply draft    → 문의 내용을 직접 붙여넣기로 받아서 초안 생성 (브라우저 없이)
```

## 워크플로우

### Step 1: Gmail 메일 확인 (/browse 스킬 사용)

```bash
$B handoff "Gmail 열기 — 비즈니스 문의 확인"
# 사용자가 Gmail 로그인 완료 후 "done" 하면:
$B resume
$B goto https://mail.google.com/mail/u/0/#label/OSS%2FBIZ+contact
```

1. `/browse` 스킬로 브라우저 handoff → 사용자가 Gmail 로그인
2. resume 후 OSS/BIZ contact 라벨로 이동
3. 미회신 메일 (쓰레드 1개짜리) 목록 확인 — `$B text`로 목록 읽기
4. 각 메일 클릭하여 원문 확인 — `$B js`로 메일 열기 → `$B text`로 내용 읽기
5. 사용자에게 어떤 메일에 회신할지 확인

### Step 2: 문의 내용 파악

메일 원문에서 추출:
- **이름** / **이메일**
- **직책** / **소속 기관**
- **문의 내용 요약** — 무엇을 원하는지 (가격, 기능, PoC, 협업 등)

사용자에게 파악한 내용 보여주고 확인.

### Step 3: 문의 유형 분류

| 유형 | 설명 | 답변 방향 |
|------|------|----------|
| 기능 문의 | 특정 기능 가능 여부 질문 | 기본 질문 + 해당 기능 맥락 질문 |
| 가격 문의 | 비용/라이선스 문의 | 기본 질문 (정확한 견적을 위해 상황 파악 필요) |
| PoC/테스트 | 시범 적용 의향 | 기본 질문 + 샘플 제공 요청 |
| 협업 제안 | 기술 협업, 오픈소스 기여 | GitHub Discussions/Issues 안내 |
| 일반 관심 | 막연한 관심 표현 | 기본 질문으로 구체화 유도 |

### Step 4: 답변 초안 생성

#### 답변 구조

1. **인사** — Hi [Name],
2. **감사 + 자기소개** — Thanks for reaching out. I'm Suji, Project Manager at OpenDataLoader.
3. **문의 맥락 인정** — 상대방이 언급한 내용에 대한 간단한 반응 (1~2문장)
4. **기본 질문 5가지** (상황 파악용):
   - Approximately how many PDFs do you process per month (or per day)?
   - What's the typical document structure — forms, reports, letters, or a mix?
   - What percentage are scanned/image-based vs. digital-native (text-selectable)?
   - Are you looking for cloud-hosted, on-premise, or hybrid deployment?
   - Do you have a target timeline for implementation?
5. **유형별 추가 질문/안내** (해당 시):
   - 기능 문의: 스캔/디지털 여부가 답변에 영향 준다면 우선 확인 요청
   - 가격 문의: 정확한 견적을 위해 위 질문 필요하다고 안내
   - PoC/테스트: 샘플 PDF 보내주면 변환 결과 제공 가능 안내
   - 협업: GitHub 링크 제공
     - Discussions: https://github.com/opendataloader-project/opendataloader/discussions
     - Issues: https://github.com/opendataloader-project/opendataloader/issues
   - 파이프라인 vs DLS: 커스텀 파이프라인 구축 vs DataLoaderStudio UI 중 어느 쪽인지 확인
6. **마무리** — The more context you can share, the better we can assess how well we can support your use case. We'll get back to you promptly once we have a clearer picture.
7. **서명**:
```
Best Regards,
Suji
```

#### 서명 블록 (사용자가 직접 붙임)

```
Suji, Cho. Project Manager
www.opendataloader.org
OpenDataLoader PDF Github
T. +82.31.627.7204
M. +82.10.8306.1005
E. suji.cho@hancom.com
```

### Step 5: 사용자 확인 + 수정

- 초안을 보여주고 수정 요청 받기
- 확인되면 복사 가능한 형태로 최종 출력
- 여러 건이면 건별로 순서대로 진행

## 규칙

- **답변 언어는 영어.** 문의가 한국어면 한국어로 답변.
- **기본 질문 5가지는 항상 포함.** 문의 유형에 따라 추가 질문만 달라진다.
- **서명은 Best Regards, Suji.** (Best, Suji 아님)
- **톤**: 전문적이지만 친근. 짧은 문장. 불필요한 수식어 없음.
- **상대방이 이미 답한 질문은 빼기.** 예: 이미 volume을 언급했으면 그 항목 제외.
- **변경 전 확인.** 초안은 항상 사용자에게 보여주고 승인 후 확정.

## 팀장 보고용 요약 생성

답변 완료 후, 사용자가 요청하면 팀장 보고용 요약을 생성한다:

```
비즈니스 문의 N건 기본 답변 제공 (날짜)

기본 질문 5가지:
1. PDF 처리량
2. 문서 구조
3. 스캔/디지털 비중
4. 배포 형태
5. 도입 일정

회신 현황:
- [이름] ([소속]) — [답변 요약]
- ...

전부 상대방 답변 대기 중.
```

## 관련

| 스킬 | 관계 |
|------|------|
| `/suji-work-minute` | 데일리 노트에 "기본 답변 제공" 기록 |
| `/suji-bm-sync` | BM 플랜과 연계 가능한 리드 정보 |
| `/browse` | Gmail 메일 확인용 |
