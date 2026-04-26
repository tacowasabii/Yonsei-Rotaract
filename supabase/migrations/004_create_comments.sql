CREATE TABLE public.comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER on_comments_updated
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Comment authors can update own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Comment authors and post authors can delete comments"
  ON public.comments FOR DELETE TO authenticated
  USING (
    auth.uid() = author_id
    OR auth.uid() = (SELECT author_id FROM public.posts WHERE id = post_id)
  );
