-- 소프트 딜리트: posts, comments에 is_deleted / deleted_at 컬럼 추가

-- 1. 컬럼 추가
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS is_deleted  BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ;

ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS is_deleted  BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at  TIMESTAMPTZ;

-- 2. RLS SELECT 정책 교체
--    일반 유저는 삭제된 글/댓글 조회 불가, staff 이상만 조회 가능

DROP POLICY IF EXISTS "Anyone can read posts"    ON public.posts;
DROP POLICY IF EXISTS "Anyone can read comments" ON public.comments;

CREATE POLICY "Non-deleted posts are public; staff sees all"
  ON public.posts FOR SELECT
  USING (
    is_deleted = FALSE
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('staff', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Non-deleted comments are public; staff sees all"
  ON public.comments FOR SELECT
  USING (
    is_deleted = FALSE
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('staff', 'admin', 'super_admin')
    )
  );

-- 3. posts가 소프트 딜리트되면 하위 comments도 자동 소프트 딜리트
CREATE OR REPLACE FUNCTION public.cascade_soft_delete_comments()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
    UPDATE public.comments
    SET is_deleted = TRUE, deleted_at = NOW()
    WHERE post_id = NEW.id AND is_deleted = FALSE;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cascade_soft_delete_comments ON public.posts;
CREATE TRIGGER trg_cascade_soft_delete_comments
  AFTER UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.cascade_soft_delete_comments();
