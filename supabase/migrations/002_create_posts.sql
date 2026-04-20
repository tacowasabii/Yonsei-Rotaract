-- posts 테이블
CREATE TABLE public.posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_number  BIGINT GENERATED ALWAYS AS IDENTITY,
  board_type   TEXT NOT NULL CHECK (board_type IN ('free', 'promo')),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  author_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visibility   TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members')),
  views        INTEGER NOT NULL DEFAULT 0,
  image_urls   TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER on_posts_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts readable by visibility and auth"
  ON public.posts FOR SELECT
  USING (
    visibility = 'public'
    OR (visibility = 'members' AND auth.uid() IS NOT NULL)
  );

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- 조회수 증가 (RLS 우회를 위해 SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage 버킷
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-images');
