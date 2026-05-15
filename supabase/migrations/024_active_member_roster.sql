-- ============================================================
-- 024_active_member_roster.sql — 현역 부원 명단 테이블
-- ============================================================

CREATE TABLE public.active_member_roster (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  department   TEXT        NOT NULL,
  name         TEXT        NOT NULL,
  student_id   TEXT        NOT NULL,
  phone        TEXT        NOT NULL DEFAULT '',
  generation   TEXT        NOT NULL,
  uploaded_by  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roster_generation ON public.active_member_roster (generation, name);

-- RLS
ALTER TABLE public.active_member_roster ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view roster"
  ON public.active_member_roster FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can insert roster"
  ON public.active_member_roster FOR INSERT
  TO authenticated
  WITH CHECK (public.get_my_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admin can delete roster"
  ON public.active_member_roster FOR DELETE
  TO authenticated
  USING (public.get_my_role() IN ('admin', 'super_admin'));
