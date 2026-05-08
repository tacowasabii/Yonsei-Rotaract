-- reports 테이블 생성
CREATE TABLE public.reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'resolved')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- RLS 활성화
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 인증 사용자는 본인 신고 제출
CREATE POLICY "Authenticated users can submit reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- 어드민 전체 조회
CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (auth.uid() IS NOT NULL AND get_my_role() IN ('admin', 'super_admin'));

-- 어드민만 상태 변경 (처리 완료 / 되돌리기)
CREATE POLICY "Admins can update report status"
  ON public.reports FOR UPDATE
  USING (auth.uid() IS NOT NULL AND get_my_role() IN ('admin', 'super_admin'));
