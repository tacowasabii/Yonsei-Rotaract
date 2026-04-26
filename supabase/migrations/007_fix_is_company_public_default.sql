ALTER TABLE public.profiles
  ALTER COLUMN is_company_public SET DEFAULT false;

UPDATE public.profiles
  SET is_company_public = false
  WHERE company IS NULL OR company = '';
