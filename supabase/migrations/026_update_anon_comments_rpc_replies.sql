-- 대댓글 지원: get_anon_comments에 parent_id, is_deleted 반환 추가
-- 답글이 있는 삭제된 부모 댓글도 placeholder로 반환

CREATE OR REPLACE FUNCTION public.get_anon_comments(p_post_id uuid)
RETURNS TABLE (
  id          uuid,
  post_id     uuid,
  parent_id   uuid,
  content     text,
  created_at  timestamptz,
  updated_at  timestamptz,
  anon_label  text,
  is_mine     boolean,
  can_delete  boolean,
  is_deleted  boolean
)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH post_info AS (
    SELECT author_id AS post_author_id FROM public.posts WHERE public.posts.id = p_post_id
  ),
  first_appearances AS (
    SELECT c.author_id, MIN(c.created_at) AS first_at
    FROM public.comments c, post_info
    WHERE c.post_id = p_post_id
      AND c.author_id != post_info.post_author_id
      AND c.is_deleted = FALSE
    GROUP BY c.author_id
  ),
  anon_numbers AS (
    SELECT fa.author_id, ROW_NUMBER() OVER (ORDER BY fa.first_at) AS anon_num
    FROM first_appearances fa
  )
  SELECT
    c.id,
    c.post_id,
    c.parent_id,
    c.content,
    c.created_at,
    c.updated_at,
    CASE
      WHEN c.author_id = (SELECT post_author_id FROM post_info) THEN '글쓴이'
      ELSE '익명' || an.anon_num::text
    END::text AS anon_label,
    (c.author_id = auth.uid()) AS is_mine,
    (c.author_id = auth.uid() OR (SELECT post_author_id FROM post_info) = auth.uid()) AS can_delete,
    c.is_deleted
  FROM public.comments c
  LEFT JOIN anon_numbers an ON c.author_id = an.author_id
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
