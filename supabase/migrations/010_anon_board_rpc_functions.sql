-- LANGUAGE sql 사용으로 PL/pgSQL RETURNS TABLE 변수 스코프 충돌 방지

CREATE OR REPLACE FUNCTION public.get_anon_post(p_post_id uuid)
RETURNS TABLE (
  id uuid,
  post_number bigint,
  board_type text,
  title text,
  content text,
  visibility text,
  is_notice boolean,
  image_urls text[],
  created_at timestamptz,
  updated_at timestamptz,
  is_mine boolean,
  comment_count bigint,
  like_count bigint
)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.post_number,
    p.board_type,
    p.title,
    p.content,
    p.visibility,
    p.is_notice,
    p.image_urls,
    p.created_at,
    p.updated_at,
    (p.author_id = auth.uid()) AS is_mine,
    (SELECT COUNT(*) FROM public.comments c WHERE c.post_id = p.id) AS comment_count,
    (SELECT COUNT(*) FROM public.post_likes pl WHERE pl.post_id = p.id) AS like_count
  FROM public.posts p
  WHERE p.id = p_post_id
    AND p.board_type = 'anon';
$$;

CREATE OR REPLACE FUNCTION public.get_anon_comments(p_post_id uuid)
RETURNS TABLE (
  id uuid,
  post_id uuid,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  anon_label text,
  is_mine boolean,
  can_delete boolean
)
LANGUAGE sql SECURITY DEFINER
AS $$
  WITH post_info AS (
    SELECT author_id AS post_author_id FROM public.posts WHERE public.posts.id = p_post_id
  ),
  first_appearances AS (
    SELECT c.author_id, MIN(c.created_at) AS first_at
    FROM public.comments c, post_info
    WHERE c.post_id = p_post_id
      AND c.author_id != post_info.post_author_id
    GROUP BY c.author_id
  ),
  anon_numbers AS (
    SELECT fa.author_id, ROW_NUMBER() OVER (ORDER BY fa.first_at) AS anon_num
    FROM first_appearances fa
  )
  SELECT
    c.id,
    c.post_id,
    c.content,
    c.created_at,
    c.updated_at,
    CASE
      WHEN c.author_id = (SELECT post_author_id FROM post_info) THEN '글쓴이'
      ELSE '익명' || an.anon_num::text
    END::text AS anon_label,
    (c.author_id = auth.uid()) AS is_mine,
    (c.author_id = auth.uid() OR (SELECT post_author_id FROM post_info) = auth.uid()) AS can_delete
  FROM public.comments c
  LEFT JOIN anon_numbers an ON c.author_id = an.author_id
  WHERE c.post_id = p_post_id
  ORDER BY c.created_at ASC;
$$;
