-- 삭제된 글/댓글은 staff 포함 모든 유저가 프론트에서 조회 불가
-- DB(Supabase 대시보드)에서만 확인 가능

DROP POLICY IF EXISTS "Non-deleted posts are public; staff sees all"    ON public.posts;
DROP POLICY IF EXISTS "Non-deleted comments are public; staff sees all" ON public.comments;

CREATE POLICY "Only non-deleted posts are visible"
  ON public.posts FOR SELECT
  USING (is_deleted = FALSE);

CREATE POLICY "Only non-deleted comments are visible"
  ON public.comments FOR SELECT
  USING (is_deleted = FALSE);
