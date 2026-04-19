---
name: suji-kb
description: Claude Code 세션 아카이브 + wiki 통합 Knowledge Base. 세션 종료 '/suji-kb', 산출물 경로 '/suji-kb init', 일괄 logbook '/suji-kb logbook', 검색 '/suji-kb search', 소스 투입 '/suji-kb ingest', wiki 질의 '/suji-kb query', wiki 점검 '/suji-kb lint'.
---

# suji-kb

Claude Code 세션을 `~/Workspace/sujicho-kb/`에 아카이브하고 구조화된 logbook을 생성하는 통합 스킬.

설계 문서: `~/Workspace/sujicho-kb/design.md`

## 서브커맨드

| 커맨드 | 용도 |
|--------|------|
| `/suji-kb` | 세션 종료: archive + 분류 + logbook + commit |
| `/suji-kb init` | 세션 중: 프로젝트 선택 + 산출물 경로 확정 |
| `/suji-kb logbook` | 미처리 세션 일괄 triage + logbook |
| `/suji-kb search <키워드>` | SQLite FTS 검색 |
| `/suji-kb ingest <파일>` | 소스 투입 → wiki 페이지 생성/갱신 |
| `/suji-kb query <질문>` | wiki + SQLite 기반 답변 |
| `/suji-kb lint` | wiki 건강 점검 |

## 설정

```
KB_PATH=~/Workspace/sujicho-kb
```

## /suji-kb — 세션 종료 통합 처리

### Step 1: session archive

```bash
python3 ~/Workspace/sujicho-kb/scripts/session-archive.py
```

### Step 2: 프로젝트 분류

세션 대화 내용에서 프로젝트를 추론하여 사용자에게 제안한다.

매핑 규칙:

| 키워드/패턴 | records/ 매핑 | scope |
|------------|--------------|-------|
| portfolio, susiecho, MDX, 케이스스터디 | portfolio | personal |
| opendataloader, ODL, odl | opendataloader | work |
| medium, confluence, sync | medium-confluence-sync | work |
| 리서치, 시장조사, 분석 (회사 관련) | research | work |
| 스킬, skill, gstack, bundo | tooling | 혼합 (세션별 판단) |
| KB, knowledge base, 세션 아카이브 | kb | personal |
| (기타) | logbook | 혼합 (세션별 판단) |

scope 판단 기준: 회사 업무(ODL, Confluence, 시장분석 등) = work, 개인 프로젝트(포트폴리오, KB 등) = personal. tooling/logbook은 세션 맥락으로 판단.

Logbook 저장 경로: `records/{scope}/{project}/{slug}/logbook.md`

출력 형식:
```
📂 프로젝트 추천: opendataloader (work)
   다른 선택: portfolio (personal), tooling, logbook, + 새 프로젝트
```

새 프로젝트가 필요하면 사용자에게 이름과 scope를 물어본다.

### Step 3: Logbook 등급 판정

대화 내용을 기반으로 Full 7섹션(배경/의사결정/수행내용/성과/다음단계/회고/콘텐츠시드) 내용을 먼저 작성하여 사용자에게 보여준다.
사용자가 내용을 보고 등급을 결정한다:

| 등급 | 기준 |
|------|------|
| **Full** | 의사결정/기획/설계/리서치가 포함된 세션 (크기 무관) |
| **Light** | 단순 구현/버그 수정/루틴 작업 |
| **Meta** | 메시지 5개 미만이고 실질 내용 없음 |

핵심 규칙: **내용 성격**으로 판단. 짧더라도 "이 방향으로 가자"는 결정이 있으면 Full.

등급 검증: frontmatter 작성 시 Light/Meta인데 decisions가 있으면 사용자에게 Full 승격 여부를 확인한다.

### Step 3.5: AI 패턴 추천

세션 내용 기반으로 ai_pattern 자동 추천. 복수 해당 가능.

| 조건 | 추천 패턴 |
|------|----------|
| 코드 수정, PR 생성, 디버깅을 AI가 자율 수행 | `agentic_coding` |
| 리서치, 분석, 비교, 데이터 수집이 주 활동 | `augmented_decision` |
| CLAUDE.md, 스킬, 메모리, 프롬프트 설계 포함 | `context_engineering` |
| 테스트/검증 체계, eval 프레임워크 설계 | `harness_engineering` |
| cron, hook, 파이프라인, 자동화 구축 | `automation` |

추천 결과를 사용자에게 보여주고 확인받는다. work scope이면 okr 필드도 함께 제안한다.

### Step 4: Slug 생성

디렉토리 이름 = `{YYYY-MM-DD}-{한글-kebab-case-topic-slug}/`

규칙:
- 세션 핵심 주제를 3~5단어 한글 kebab-case로 요약
- 고유명사/기술 용어는 영문 그대로 (예: MDX, Vercel, CLI)
- session_id, UUID, 해시값 사용 금지

예시: `2026-04-01-KB-시스템-설계`, `2026-03-27-MDX-원본-복원`

slug는 사용자에게 묻지 않고 자율 생성하여 바로 적용한다.

### Step 5: Logbook 생성

**Full Logbook** — 7섹션:

```markdown
---
session_id: {uuid}
project: {프로젝트명}
scope: {work|personal}
category: {research|coding|document|design|automation|strategy}
started: {ISO 8601}
ended: {ISO 8601}
user_turns: {int}
total_turns: {int}
model: {model id}
input_tokens: {int}
output_tokens: {int}
cost_usd: {float}
origin: jsonl
title: "{한국어 제목}"
description: "{한 줄 한국어 설명}"
tags: [{keyword}, ...]
source: sessions/{YYYY-MM-DD}-{session_id}.md
grade: full
follows: {이전 세션 slug}              # 선택. 연속 작업이면 기재
decisions:                             # 핵심 의사결정 목록
  - "{결정 1}"
  - "{결정 2}"
artifacts:                             # 생성/수정한 파일
  - path: {파일 경로}
    action: {created|modified|deleted}
ai_contribution: "{AI가 한 것 한 줄}"
human_contribution: "{내가 한 것 한 줄}"
publishable: {true|false|redact}       # 외부 공개 가능 여부
ai_pattern:                            # AI 활용 패턴 (복수 가능, Step 3.5에서 추천)
  - agentic_coding                     # AI가 코드 탐색→수정→PR 자율 수행
  - augmented_decision                 # 사람이 판단, AI가 분석 지원
  - context_engineering                # CLAUDE.md/스킬/메모리 설계
  - harness_engineering                # AI 출력 품질 검증 체계 설계
  - automation                         # 반복 작업 완전 자동화
okr: "{팀 OKR 또는 개인 목표}"           # 선택. work scope에서 주로 사용
related:                               # 선택. 선행/후행 작업 참조
  - slug: "{YYYY-MM-DD-slug}"
    relation: preceded_by | led_to | continuation_of
---

# {title}

## 배경
(왜 이 작업이 필요했는가 — 구조적/기술적 맥락)

## 의사결정
(이 세션에서 내린 핵심 결정과 이유)
- {결정}: {이유}

## 수행 내용
(구체적으로 무엇을 실행했는가)

## 성과
(해당하는 태그만 기재. 해당 없는 태그는 생략)
- [절감] {비용/시간 절약}
- [대체] {역할 대체 — 누구 대신, 얼마나}
- [수치] {정량 달성 — 조회수, 건수, 달성률}
- [일정] {마일스톤/기한 준수}
- [리스크 해소] {제거된 위험}
- [기반] {향후 활용 가능한 인프라/구조}
- [정량] {숫자로 측정 가능한 기타 결과}

### Before / After
(Full 등급에서만 작성. 추정이 어려우면 생략 가능)

| 항목 | AI 미사용 (추정) | AI 사용 (실측) |
|------|----------------|---------------|
| 소요 시간 | {추정 소요} | {실제 소요} |
| 품질/성과 | {기존 방식 결과} | {AI 활용 결과} |
| 비용 | {인건비 또는 기존 비용} | ${cost_usd} |

## 다음 단계
(후속 작업, 우선순위)

## 회고
(시행착오, 배운 것, 다르게 했으면 좋았을 것)

## 콘텐츠 시드
(블로그/케이스스터디로 발전시킬 만한 소재가 있다면 한 줄)
```

**frontmatter는 모든 등급에서 동일.** 해당하는 필드만 기재하고, 해당 없으면 생략한다. 등급은 본문 깊이만 결정한다.

**Light Logbook** — 한 줄 요약 + 변경 목록:

```markdown
---
(Full과 동일한 frontmatter. 해당하는 것만 기재)
grade: light
---

# {title}

{한 줄 요약}

### 주요 변경
- {변경 1}
- {변경 2}
```

**Meta** — frontmatter만:

```markdown
---
(Full과 동일한 frontmatter. 해당하는 것만 기재)
grade: meta
---
```

Logbook은 **현재 대화 맥락에서 직접 생성**한다. session.md를 다시 읽어서 요약하지 않는다.

session-archive.py가 생성한 session.md의 frontmatter(tokens, cost 등)를 읽어 logbook frontmatter에 상속한다.

Logbook 작성 가이드라인:
- Jira/Confluence 업로드 가능한 품질
- 특정 인물 언급 금지 — 구조적/기술적 맥락으로만 서술
- 개인 감정, 불만, 조직 내부 갈등 포함 금지
- 중립적, 사실 기반
- 성과 섹션에 가능한 한 정량적 수치 포함
- 일반적 요약이 아니라 구체적 의사결정과 산출물 기술

Logbook 초안을 사용자에게 보여주고 확인받는다.

### Step 5.5: related 자동 제안

Logbook 생성 후, 동일 project 내 기존 logbook과의 관련성을 자동 탐색하여 `related` 필드 후보를 제안한다.

탐색 방법:
1. 동일 `project` 내 최근 10건 logbook의 `tags` 비교
2. tags 겹침이 50% 이상이면 related 후보로 제안
3. `follows` 필드가 있으면 해당 logbook을 `related: continuation_of`로 자동 추가
4. 기존 logbook에서 현재 세션의 `## 배경`에 언급된 slug가 있으면 `preceded_by`로 제안

제안 형식:
```
🔗 관련 logbook 제안:
  - 2026-04-01-KB-시스템-설계 (tags 70% 겹침) → continuation_of?
  - 2026-03-27-MDX-원본-복원 (배경에서 언급) → preceded_by?
  추가/수정/스킵?
```

사용자 확인 후 `related` 필드에 반영한다. 후보가 없으면 이 스텝을 건너뛴다.

### Step 6: 산출물 수집

init에서 경로를 선언한 경우 해당 폴더를 스캔한다.
대화 중 생성한 파일이 init 폴더 밖에 있으면 사용자에게 확인한다:

```
📎 이 세션에서 생성한 파일:
  ✅ kb/records/.../logbook.md (KB 안)
  ❓ ./research-notes.md (KB 밖 — 포함할까요?)
```

### Step 7: 인덱스 갱신

```bash
python3 ~/Workspace/sujicho-kb/scripts/build-index.py
```

### Step 8: commit & push

```bash
cd ~/Workspace/sujicho-kb
git add sessions/ records/ self/ scripts/ triage.yml
git commit -m "kb: {project}/{slug} — {logbook title}"
git push
```

새 파일이 없으면 commit 건너뛴다.
remote가 설정되지 않았으면 push 건너뛴다.

### Step 9: 완료 보고

```
✅ suji-kb 완료
  📄 session: sessions/2026-04-01-{uuid}.md
  📝 logbook: records/{scope}/{project}/{slug}/logbook.md
  📎 산출물: (있으면 나열)
  💰 비용: ${cost} (input: {n}K, output: {n}K)
  🔗 committed (pushed / no remote)
```

## /suji-kb init — 산출물 경로 확정

세션 중 산출물을 저장할 경로가 필요할 때 호출한다.

1. 프로젝트 선택 (Step 2와 동일)
2. 주제(slug) 확정 (Step 4와 동일)
3. 폴더 생성 및 선언:

```bash
mkdir -p ~/Workspace/sujicho-kb/records/{scope}/{project}/{YYYY-MM-DD-slug}
```

```
📂 KB 경로: sujicho-kb/records/{scope}/{project}/{slug}/
```

이후 세션에서 산출물 저장 시 이 경로를 사용한다.

## /suji-kb logbook — 미처리 세션 일괄 처리

1. `sessions/`에서 모든 session_id 스캔
2. `records/**/logbook.md`에서 처리된 session_id 스캔
3. `triage.yml`에서 이전 분류 결과 로드 → 판정된 세션 스킵
4. 미처리 세션 목록을 등급 추천과 함께 테이블로 제시:

```
| 날짜 | session (앞 8자리) | cost | turns | 주제 추정 | 추천 등급 |
|------|-------------------|------|-------|----------|----------|
| 3/20 | 7ae9da0c | $237 | 233 | 리더 요구사항 분석 | ✅ Full |
| 3/16 | 4b2f4115 | $1.44 | 30 | 짧은 Q&A | ⚪ Meta |
```

5. 사용자 확인 후:
   - Full/Light → logbook 생성 (Step 5와 동일, 단 session.md를 읽어서 생성)
   - Meta → frontmatter만 생성
   - Skip → triage.yml에 `decision: skipped` 기록

6. 분류 결과를 triage.yml에 저장:

```yaml
- session_id: {uuid}
  date: "2026-03-20"
  cost_usd: 237.0
  turns: 233
  topic: "리더 요구사항 분석"
  grade: full
  decision: logged
  decided_at: "2026-04-02"
```

7. commit & push

## /suji-kb search <키워드> — KB 검색

SQLite FTS5 검색 실행:

```bash
python3 -c "
import sqlite3
conn = sqlite3.connect('$HOME/Workspace/sujicho-kb/index.db')
rows = conn.execute(
    \"SELECT date, title, path, snippet(kb_fts, 5, '>>>', '<<<', '...', 30) FROM kb_fts WHERE kb_fts MATCH ? ORDER BY rank LIMIT 10\",
    ('KEYWORD',)
).fetchall()
for r in rows:
    print(f'{r[0]} | {r[1][:50]} | {r[2]}')
    print(f'  {r[3][:200]}')
conn.close()
"
```

검색 결과에서 관련 session.md 또는 logbook.md를 읽어 상세 내용을 제공한다.

## /suji-kb ingest <파일> — 소스 투입 + wiki 페이지 생성

외부 소스를 KB에 투입하고 wiki 페이지를 생성/갱신한다.

### 소스 투입

1. 파일 위치에 따라 처리:
   - `~/Workspace/Clippings/` (Obsidian Web Clipper inbox): `raw/sources/`로 복사
   - `raw/sources/` 안에 이미 있음: 복사 스킵
   - `sessions/*.md`: 복사하지 않고 직접 참조
   - 기타 경로: `raw/sources/`로 복사

2. `raw/sources/`에 복사할 때 파일명 규칙: `{YYYY-MM-DD}_{제목}.{ext}` (이미 이 형식이면 그대로)

Clippings/ = Obsidian Web Clipper가 브라우저에서 자동 저장하는 inbox.
raw/sources/ = ingest 처리 완료된 소스 보관소.

### wiki 페이지 생성

1. 소스를 읽는다.
2. 사용자와 핵심 내용을 논의한다.
3. 기존 wiki 페이지와 관련 있는지 `wiki/index.md`를 읽어 확인한다.
   - 관련 페이지 있음 → 기존 페이지에 내용 추가/갱신
   - 관련 페이지 없음 → 새 페이지 생성
4. wiki 페이지 frontmatter:

```yaml
---
tags: [tag1, tag2]
scope: work | personal
date: YYYY-MM-DD
sources: [raw/sources/파일명]  # 또는 sessions/파일명.md
---
```

5. 관련 페이지 전체에 `[[교차참조]]` 추가/갱신한다.
6. `wiki/index.md`를 갱신한다.
7. `wiki/log.md`에 엔트리 추가:

```
## [YYYY-MM-DD] ingest | {제목}

- 소스: raw/sources/{파일명}
- 생성/갱신: [[페이지명]]
- 교차참조 추가: [[관련1]], [[관련2]]
```

8. 인덱스 갱신 + commit & push.

## /suji-kb query <질문> — wiki 기반 답변

KB 지식을 활용하여 질문에 답변한다.

1. `wiki/index.md`를 읽어 관련 페이지를 찾는다.
2. 관련 페이지를 읽고 답변을 합성한다. 출처를 명시한다.
3. SQLite FTS 검색도 병행하여 logbook/session에서 추가 근거를 찾는다:

```bash
python3 -c "
import sqlite3
conn = sqlite3.connect('$HOME/Workspace/sujicho-kb/index.db')
rows = conn.execute(
    \"SELECT date, title, path, snippet(kb_fts, 5, '>>>', '<<<', '...', 30) FROM kb_fts WHERE kb_fts MATCH ? ORDER BY rank LIMIT 10\",
    ('KEYWORD',)
).fetchall()
for r in rows:
    print(f'{r[0]} | {r[1][:50]} | {r[2]}')
    print(f'  {r[3][:200]}')
conn.close()
"
```

4. 답변이 새로운 분석/비교/인사이트를 포함하면 사용자에게 wiki 페이지로 저장할지 제안한다.

## /suji-kb lint — wiki 건강 점검

위키 전체를 점검하고 문제를 보고한다.

### 점검 항목

1. **깨진 링크**: `[[Page Name]]`이 실제 wiki/ 파일과 매칭되지 않는 것
2. **고아 페이지**: 다른 페이지에서 링크되지 않는 페이지 (index.md 제외)
3. **모순**: 페이지 간 상충하는 주장/수치
4. **노후화**: sources 날짜가 오래된 페이지, 시제가 맞지 않는 서술
5. **누락 교차참조**: 같은 주제를 다루는데 서로 링크가 없는 페이지
6. **누락 페이지**: 여러 곳에서 언급되지만 자체 페이지가 없는 개념

### 실행 방식

1. `wiki/` 전체 파일을 스캔한다.
2. 발견 사항을 카테고리별로 테이블 보고한다:

```
🔍 wiki lint 결과

| # | 유형 | 페이지 | 내용 |
|---|------|--------|------|
| 1 | 깨진 링크 | 경쟁사 지도 | [[없는 페이지]] |
| 2 | 고아 | Claude API 사내 도입 | 인바운드 링크 0개 |
| 3 | 노후화 | ODL 비즈니스 현황 | 기준일 2026-03-31, 8일 경과 |
```

3. 사용자 확인 후 수정 실행한다.
4. `wiki/log.md`에 lint 엔트리 추가:

```
## [YYYY-MM-DD] lint | 위키 건강 점검 — {N}건 수정
```

5. commit & push.
