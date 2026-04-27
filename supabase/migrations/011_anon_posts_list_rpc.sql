CREATE OR REPLACE FUNCTION public.get_anon_posts_list(
  p_page     integer DEFAULT 1,
  p_per_page integer DEFAULT 15,
  p_search   text    DEFAULT ''
)
RETURNS TABLE (
  id            uuid,
  post_number   bigint,
  board_type    text,
  title         text,
  content       text,
  visibility    text,
  is_notice     boolean,
  image_urls    text[],
  created_at    timestamptz,
  updated_at    timestamptz,
  is_mine       boolean,
  comment_count bigint,
  like_count    bigint,
  total_count   bigint
)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.post_number,
    p.board_type::text,
    p.title,
    p.content,
    p.visibility::text,
    p.is_notice,
    p.image_urls,
    p.created_at,
    p.updated_at,
    (p.author_id = auth.uid()) AS is_mine,
    (SELECT COUNT(*) FROM public.comments c   WHERE c.post_id = p.id) AS comment_count,
    (SELECT COUNT(*) FROM public.post_likes pl WHERE pl.post_id = p.id) AS like_count,
    COUNT(*) OVER() AS total_count
  FROM public.posts p
  WHERE p.board_type = 'anon'
    AND p.is_notice = false
    AND (p_search = '' OR p.title ILIKE '%' || p_search || '%')
  ORDER BY p.created_at DESC
  LIMIT p_per_page
  OFFSET (p_page - 1) * p_per_page;
$$;

CREATE OR REPLACE FUNCTION public.get_anon_notice_posts()
RETURNS TABLE (
  id            uuid,
  post_number   bigint,
  board_type    text,
  title         text,
  content       text,
  visibility    text,
  is_notice     boolean,
  image_urls    text[],
  created_at    timestamptz,
  updated_at    timestamptz,
  is_mine       boolean,
  comment_count bigint,
  like_count    bigint
)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.post_number,
    p.board_type::text,
    p.title,
    p.content,
    p.visibility::text,
    p.is_notice,
    p.image_urls,
    p.created_at,
    p.updated_at,
    (p.author_id = auth.uid()) AS is_mine,
    (SELECT COUNT(*) FROM public.comments c   WHERE c.post_id = p.id) AS comment_count,
    (SELECT COUNT(*) FROM public.post_likes pl WHERE pl.post_id = p.id) AS like_count
  FROM public.posts p
  WHERE p.board_type = 'anon'
    AND p.is_notice = true
  ORDER BY p.created_at DESC;
$$;
