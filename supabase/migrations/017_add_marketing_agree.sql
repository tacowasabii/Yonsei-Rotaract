ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS marketing_agree boolean NOT NULL DEFAULT false;
