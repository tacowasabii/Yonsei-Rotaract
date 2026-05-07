-- donations 테이블 생성
CREATE TABLE public.donations (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous  BOOLEAN     NOT NULL DEFAULT false,
  message       TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'approved', 'rejected')),
  is_hidden     BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at   TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- RLS 활성화
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 어드민은 전체 조회
CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (auth.uid() IS NOT NULL AND get_my_role() IN ('admin', 'super_admin'));

-- 본인 후원 조회
CREATE POLICY "Users can view own donations"
  ON public.donations FOR SELECT
  USING (auth.uid() = user_id);

-- 공개 승인 후원 조회 (명예의 전당)
CREATE POLICY "Anyone can view approved visible donations"
  ON public.donations FOR SELECT
  USING (status = 'approved' AND is_hidden = false);

-- 인증 사용자는 본인 후원 등록 (status는 반드시 pending)
CREATE POLICY "Authenticated users can submit donations"
  ON public.donations FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- 어드민만 수정 (승인/거절/숨김)
CREATE POLICY "Admins can update donations"
  ON public.donations FOR UPDATE
  USING (auth.uid() IS NOT NULL AND get_my_role() IN ('admin', 'super_admin'));

-- 어드민만 삭제
CREATE POLICY "Admins can delete donations"
  ON public.donations FOR DELETE
  USING (auth.uid() IS NOT NULL AND get_my_role() IN ('admin', 'super_admin'));
