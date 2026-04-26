-- posts: 비로그인 유저도 members 글을 목록/상세에서 볼 수 있도록 정책 수정
-- (콘텐츠 접근 제한은 프론트엔드 게이트로 처리)
DROP POLICY IF EXISTS "Posts readable by visibility and auth" ON public.posts;

CREATE POLICY "Anyone can read posts"
  ON public.posts FOR SELECT
  USING (true);

-- profiles: 비로그인 유저도 name 등 기본 정보를 읽을 수 있도록 정책 수정
-- (게시글 작성자명 표시를 위해 필요)
DROP POLICY IF EXISTS "authenticated users can read profiles" ON public.profiles;

CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);
