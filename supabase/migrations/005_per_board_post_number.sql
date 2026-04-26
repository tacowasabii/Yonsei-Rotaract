-- IDENTITY 제약 제거 후 일반 BIGINT로 전환
ALTER TABLE public.posts ALTER COLUMN post_number DROP IDENTITY IF EXISTS;
ALTER TABLE public.posts ALTER COLUMN post_number SET DEFAULT NULL;

-- 기존 데이터: board_type별로 created_at 순서에 맞게 번호 재부여
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY board_type ORDER BY created_at) AS new_num
  FROM public.posts
)
UPDATE public.posts p
SET post_number = r.new_num
FROM ranked r
WHERE p.id = r.id;

-- INSERT 시 board_type 내 최대값 +1을 자동 부여하는 트리거 함수
CREATE OR REPLACE FUNCTION public.assign_post_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(post_number), 0) + 1
  INTO NEW.post_number
  FROM public.posts
  WHERE board_type = NEW.board_type;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_post_number
  BEFORE INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.assign_post_number();
