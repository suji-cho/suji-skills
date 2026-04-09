# suji-confluence-publish

드래프트를 Confluence에 올릴 때 제목/레이아웃/변환 컨벤션을 적용하는 스킬. 모든 Confluence 페이지가 동일한 제목 형식, 레이아웃, 변환 규칙을 따르게 한다.

## When to use

- "Confluence에 올려줘", "페이지 배포해줘"
- `~/Workspace/work/drafts/` 파일을 Confluence로 업로드할 때
- Confluence 페이지 제목이나 레이아웃 규칙을 물어볼 때

## 페이지 제목 컨벤션

`yyyymmdd_제목` (파일명에서 `.md`만 제거)

| 로컬 파일명 | Confluence 페이지 제목 |
|---|---|
| `20260313_해외보도자료_배포_효용성_분석.md` | `20260313_해외보도자료_배포_효용성_분석` |
| `20260320_SaaS_구독_비용_정리.md` | `20260320_SaaS_구독_비용_정리` |

규칙:
- 로컬 파일명에서 `.md` 확장자만 제거하면 Confluence 제목
- 날짜는 8자리 `yyyymmdd`
- 별도 변환 불필요 (로컬 = Confluence 동일)

## 레이아웃 (non-negotiable)

1. **콘텐츠 500px 너비 제한 + 중앙 배치** — `section > column(500px)` 매크로로 전체 래핑
2. **테이블 왼쪽 정렬** — 모든 `<table>`에 `style="margin-left: 0;"` 적용

Why: 기본 레이아웃은 가로 무한 확장되어 가독성이 떨어지고, 테이블이 가운데 정렬되어 텍스트 시작점과 불일치.

## 드래프트 → Confluence 변환

| 제거 (로컬 전용) | 유지 (Confluence에 포함) |
|---|---|
| YAML frontmatter | 본문 마크다운 전체 |
| `<!-- LOCAL: ... -->` HTML 주석 | 테이블, 리스트, 헤딩 |
| `[확인 필요]` 플레이스홀더 | 확인 완료된 수치만 |

변환 순서:
1. frontmatter 제거
2. HTML 주석 제거
3. `[확인 필요]` 항목이 남아 있으면 사용자에게 알림
4. 페이지 제목 변환 (파일명에서 `.md` 제거)
5. 레이아웃 규칙 적용

## 첨부 자료

페이지 하단에 `## 첨부 자료` 섹션 추가:

```markdown
## 첨부 자료

| 파일명 | 설명 |
|--------|------|
| example.pdf | 설명 텍스트 |
```

실제 파일 첨부는 Confluence UI에서 드래그&드롭 (MCP API 미지원).

## 실행 가이드

### 신규 업로드

1. 대상 파일 확인 (`~/Workspace/work/drafts/` 내 파일)
2. `[확인 필요]` 잔존 여부 체크 → 있으면 사용자에게 보고
3. frontmatter/HTML 주석 제거
4. 페이지 제목 변환: 파일명에서 `.md` 제거
5. **변환 결과를 사용자에게 보여주고 확인받기**
6. Confluence API로 업로드 (markdown format)
7. 첨부 자료 있으면 수동 첨부 안내

### 기존 페이지 업데이트


1. 현재 페이지 내용 조회
2. 변경 사항 확인
3. 레이아웃 규칙 적용 확인
4. versionMessage 포함하여 업데이트

## 관련 스킬

| 스킬 | 관계 |
|------|------|
| `/suji-meeting-refine` | 회의록 Confluence 업로드 (제목/레이아웃 규칙 공유) |
| `/suji-cto-weekly-report` | 주간보고 Confluence 업로드 |
| `/suji-bm-sync` | BM 보고서 Confluence 동기화 |
| `/suji-report` | 성과 리포트 Confluence 업데이트 |
