-- board_type CHECK 확장: 'notice' 추가
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_board_type_check;
ALTER TABLE public.posts ADD CONSTRAINT posts_board_type_check
  CHECK (board_type IN ('free', 'promo', 'anon', 'notice'));

-- 고정 기능: is_pinned 컬럼 추가 (notice 게시판 전용)
-- is_notice는 기존 free/promo/anon 게시판의 "공지글 표시" 용도로 그대로 유지
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE;
