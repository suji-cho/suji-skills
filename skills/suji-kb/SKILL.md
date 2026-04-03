---
name: suji-kb
description: Claude Code 세션을 KB에 아카이브하고 brief를 생성합니다. 세션 종료 시 '/suji-kb', 세션 중 산출물 경로 확정 시 '/suji-kb init', 미처리 세션 일괄 처리 시 '/suji-kb brief', KB 검색 시 '/suji-kb search <키워드>'를 사용합니다.
---

# suji-kb

Claude Code 세션을 `~/Workspace/sujicho-kb/`에 아카이브하고 구조화된 brief를 생성하는 통합 스킬.

설계 문서: `~/Workspace/sujicho-kb/design.md`

## 서브커맨드

| 커맨드 | 용도 |
|--------|------|
| `/suji-kb` | 세션 종료: archive + 분류 + brief + commit |
| `/suji-kb init` | 세션 중: 프로젝트 선택 + 산출물 경로 확정 |
| `/suji-kb brief` | 미처리 세션 일괄 triage + brief |
| `/suji-kb search <키워드>` | SQLite FTS 검색 |

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

| 키워드/패턴 | projects/ 매핑 | scope |
|------------|---------------|-------|
| portfolio, susiecho, MDX, 케이스스터디 | portfolio | personal |
| opendataloader, ODL, odl | opendataloader | work |
| medium, confluence, sync | medium-confluence-sync | work |
| 리서치, 시장조사, 분석 (회사 관련) | research | work |
| 스킬, skill, gstack, bundo | tooling | 혼합 (세션별 판단) |
| KB, knowledge base, 세션 아카이브 | kb | personal |
| (기타) | logbook | 혼합 (세션별 판단) |

scope 판단 기준: 회사 업무(ODL, Confluence, 시장분석 등) = work, 개인 프로젝트(포트폴리오, KB 등) = personal. tooling/logbook은 세션 맥락으로 판단.

Brief 저장 경로: `projects/{scope}/{project}/{slug}/brief.md`

출력 형식:
```
📂 프로젝트 추천: opendataloader (work)
   다른 선택: portfolio (personal), tooling, logbook, + 새 프로젝트
```

새 프로젝트가 필요하면 사용자에게 이름과 scope를 물어본다.

### Step 3: Brief 등급 판정

대화 내용을 기반으로 등급을 판정한다:

| 등급 | 기준 |
|------|------|
| **Full** | 의사결정/기획/설계/리서치가 포함된 세션 (크기 무관) |
| **Light** | 단순 구현/버그 수정/루틴 작업 |
| **Meta** | 메시지 5개 미만이고 실질 내용 없음 |

핵심 규칙: **내용 성격**으로 판단. 짧더라도 "이 방향으로 가자"는 결정이 있으면 Full.

등급을 사용자에게 제안하고 확인받는다.

등급 검증: frontmatter 작성 시 Light/Meta인데 decisions가 있으면 사용자에게 Full 승격 여부를 확인한다.

### Step 4: Slug 생성

디렉토리 이름 = `{YYYY-MM-DD}-{한글-kebab-case-topic-slug}/`

규칙:
- 세션 핵심 주제를 3~5단어 한글 kebab-case로 요약
- 고유명사/기술 용어는 영문 그대로 (예: MDX, Vercel, CLI)
- session_id, UUID, 해시값 사용 금지

예시: `2026-04-01-KB-시스템-설계`, `2026-03-27-MDX-원본-복원`

사용자에게 slug를 제안하고 확인받는다.

### Step 5: Brief 생성

**Full Brief** — 7섹션:

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

## 다음 단계
(후속 작업, 우선순위)

## 회고
(시행착오, 배운 것, 다르게 했으면 좋았을 것)

## 콘텐츠 시드
(블로그/케이스스터디로 발전시킬 만한 소재가 있다면 한 줄)
```

**frontmatter는 모든 등급에서 동일.** 해당하는 필드만 기재하고, 해당 없으면 생략한다. 등급은 본문 깊이만 결정한다.

**Light Brief** — 한 줄 요약 + 변경 목록:

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

Brief는 **현재 대화 맥락에서 직접 생성**한다. session.md를 다시 읽어서 요약하지 않는다.

session-archive.py가 생성한 session.md의 frontmatter(tokens, cost 등)를 읽어 brief frontmatter에 상속한다.

Brief 작성 가이드라인:
- Jira/Confluence 업로드 가능한 품질
- 특정 인물 언급 금지 — 구조적/기술적 맥락으로만 서술
- 개인 감정, 불만, 조직 내부 갈등 포함 금지
- 중립적, 사실 기반
- 성과 섹션에 가능한 한 정량적 수치 포함
- 일반적 요약이 아니라 구체적 의사결정과 산출물 기술

Brief 초안을 사용자에게 보여주고 확인받는다.

### Step 6: 산출물 수집

init에서 경로를 선언한 경우 해당 폴더를 스캔한다.
대화 중 생성한 파일이 init 폴더 밖에 있으면 사용자에게 확인한다:

```
📎 이 세션에서 생성한 파일:
  ✅ kb/projects/.../brief.md (KB 안)
  ❓ ./research-notes.md (KB 밖 — 포함할까요?)
```

### Step 7: 인덱스 갱신

```bash
python3 ~/Workspace/sujicho-kb/scripts/build-index.py
```

### Step 8: commit & push

```bash
cd ~/Workspace/sujicho-kb
git add sessions/ projects/ logbook/ scripts/ triage.yml
git commit -m "kb: {project}/{slug} — {brief title}"
git push
```

새 파일이 없으면 commit 건너뛴다.
remote가 설정되지 않았으면 push 건너뛴다.

### Step 9: 완료 보고

```
✅ suji-kb 완료
  📄 session: sessions/2026-04-01-{uuid}.md
  📝 brief: projects/{scope}/{project}/{slug}/brief.md
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
mkdir -p ~/Workspace/sujicho-kb/projects/{scope}/{project}/{YYYY-MM-DD-slug}
```

```
📂 KB 경로: sujicho-kb/projects/{scope}/{project}/{slug}/
```

이후 세션에서 산출물 저장 시 이 경로를 사용한다.

## /suji-kb brief — 미처리 세션 일괄 처리

1. `sessions/`에서 모든 session_id 스캔
2. `projects/**/brief.md` + `logbook/**/brief.md`에서 처리된 session_id 스캔
3. `triage.yml`에서 이전 분류 결과 로드 → 판정된 세션 스킵
4. 미처리 세션 목록을 등급 추천과 함께 테이블로 제시:

```
| 날짜 | session (앞 8자리) | cost | turns | 주제 추정 | 추천 등급 |
|------|-------------------|------|-------|----------|----------|
| 3/20 | 7ae9da0c | $237 | 233 | 리더 요구사항 분석 | ✅ Full |
| 3/16 | 4b2f4115 | $1.44 | 30 | 짧은 Q&A | ⚪ Meta |
```

5. 사용자 확인 후:
   - Full/Light → brief 생성 (Step 5와 동일, 단 session.md를 읽어서 생성)
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
  decision: briefed
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

검색 결과에서 관련 session.md 또는 brief.md를 읽어 상세 내용을 제공한다.
