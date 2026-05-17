-- 대댓글 지원: parent_id 컬럼 추가
ALTER TABLE public.comments
  ADD COLUMN parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- 일반 게시판 댓글 조회 RPC
-- RLS를 우회해 "살아있는 답글을 가진 삭제된 부모 댓글"도 placeholder로 반환
CREATE OR REPLACE FUNCTION public.get_comments(p_post_id uuid)
RETURNS TABLE (
  id          uuid,
  post_id     uuid,
  author_id   uuid,
  parent_id   uuid,
  content     text,
  created_at  timestamptz,
  updated_at  timestamptz,
  is_deleted  boolean,
  author_name text,
  author_avatar text
)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    c.id,
    c.post_id,
    c.author_id,
    c.parent_id,
    c.content,
    c.created_at,
    c.updated_at,
    c.is_deleted,
    p.name,
    p.avatar_url
  FROM public.comments c
  LEFT JOIN public.profiles p ON p.id = c.author_id
  WHERE c.post_id = p_post_id
    AND (
      c.is_deleted = false
      OR EXISTS (
        SELECT 1 FROM public.comments r
        WHERE r.parent_id = c.id AND r.is_deleted = false
      )
    )
  ORDER BY c.created_at ASC;
$$;
