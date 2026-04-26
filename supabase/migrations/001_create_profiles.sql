-- ENUM 타입 생성
CREATE TYPE public.app_role AS ENUM ('user', 'staff', 'admin', 'super_admin');
CREATE TYPE public.member_type AS ENUM ('current', 'alumni');
CREATE TYPE public.member_status AS ENUM ('pending', 'active', 'inactive');

-- profiles 테이블 생성
CREATE TABLE public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL DEFAULT '',
  email          TEXT NOT NULL DEFAULT '',
  phone          TEXT NOT NULL DEFAULT '',
  member_type    public.member_type NOT NULL,
  admission_year INTEGER,
  department     TEXT,
  generation     TEXT,
  role           public.app_role NOT NULL DEFAULT 'user',
  status         public.member_status NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 신규 유저 가입 시 profiles 자동 생성 트리거 함수
-- OTP 임시 유저(member_type 없음)는 스킵 → upsertProfile()에서 별도 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data IS NULL OR
     NEW.raw_user_meta_data->>'member_type' IS NULL OR
     NEW.raw_user_meta_data->>'member_type' = '' THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.profiles (id, name, email, phone, member_type, admission_year, department, generation)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    (NEW.raw_user_meta_data->>'member_type')::public.member_type,
    (NEW.raw_user_meta_data->>'admission_year')::integer,
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'generation'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 이메일 중복 확인 함수 (auth.users + profiles 조인 — OTP 임시 유저는 가입된 것으로 보지 않음)
CREATE OR REPLACE FUNCTION public.check_email_available(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM auth.users u
    INNER JOIN public.profiles p ON p.id = u.id
    WHERE u.email = email_to_check
  );
END;
$$;

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- profiles 자기참조 무한루프 방지용 role 조회 함수
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$;

CREATE POLICY "authenticated users can read profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'super_admin'));
