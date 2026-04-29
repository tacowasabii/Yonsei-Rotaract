-- notice_type: 공지사항 글의 유형 (일반/중요), is_pinned과 독립된 별도 설정
-- board_type='notice' 인 글에서만 의미 있음
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS notice_type VARCHAR(10)
    NOT NULL DEFAULT '일반'
    CHECK (notice_type IN ('일반', '중요'));
