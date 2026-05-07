-- donations.user_id FK를 auth.users → public.profiles로 변경
-- profiles.id = auth.users.id이므로 데이터 무결성은 동일하게 유지됨

ALTER TABLE public.donations
  DROP CONSTRAINT donations_user_id_fkey;

ALTER TABLE public.donations
  ADD CONSTRAINT donations_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
