-- ============================================================
-- 023_gallery.sql  — Albums & Photos tables + Storage + RLS
-- ============================================================

-- 1. ENUM for album categories
CREATE TYPE public.gallery_category AS ENUM (
  '봉사활동', '대내활동', '대외활동', '버디활동', '기타'
);

-- 2. albums table
CREATE TABLE public.albums (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  date         DATE        NOT NULL,
  category     public.gallery_category NOT NULL,
  created_by   UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted   BOOLEAN     NOT NULL DEFAULT FALSE,
  deleted_at   TIMESTAMPTZ
);

CREATE TRIGGER on_albums_updated
  BEFORE UPDATE ON public.albums
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_albums_created_at ON public.albums (created_at DESC)
  WHERE is_deleted = FALSE;

-- 3. album_photos table
CREATE TABLE public.album_photos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id     UUID        NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  storage_path TEXT        NOT NULL,
  url          TEXT        NOT NULL,
  uploaded_by  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_album_photos_album_id ON public.album_photos (album_id, created_at ASC);

-- 4. RLS — albums
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active members can read albums"
  ON public.albums FOR SELECT
  USING (
    is_deleted = FALSE
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Staff can create albums"
  ON public.albums FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_my_role() IN ('staff', 'admin', 'super_admin')
  );

CREATE POLICY "Staff can update albums"
  ON public.albums FOR UPDATE
  TO authenticated
  USING (public.get_my_role() IN ('staff', 'admin', 'super_admin'));

-- 5. RLS — album_photos
ALTER TABLE public.album_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active members can read photos"
  ON public.album_photos FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.albums a
      WHERE a.id = album_id AND a.is_deleted = FALSE
    )
  );

CREATE POLICY "Staff can upload photos"
  ON public.album_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_my_role() IN ('staff', 'admin', 'super_admin')
  );

CREATE POLICY "Staff can delete photos"
  ON public.album_photos FOR DELETE
  TO authenticated
  USING (
    public.get_my_role() IN ('staff', 'admin', 'super_admin')
  );

-- 6. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

CREATE POLICY "Staff can upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gallery-images'
    AND public.get_my_role() IN ('staff', 'admin', 'super_admin')
  );

CREATE POLICY "Staff can delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'gallery-images'
    AND public.get_my_role() IN ('staff', 'admin', 'super_admin')
  );

-- 7. RPC: 앨범 목록 + 커버 사진 4장 URL + 사진 수
CREATE OR REPLACE FUNCTION public.get_albums_with_covers()
RETURNS TABLE (
  id           UUID,
  title        TEXT,
  date         DATE,
  category     TEXT,
  created_by   UUID,
  created_at   TIMESTAMPTZ,
  photo_count  BIGINT,
  cover_urls   TEXT[]
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    a.id,
    a.title,
    a.date,
    a.category::TEXT,
    a.created_by,
    a.created_at,
    COUNT(p.id)::BIGINT AS photo_count,
    ARRAY(
      SELECT p2.url FROM public.album_photos p2
      WHERE p2.album_id = a.id
      ORDER BY p2.created_at ASC LIMIT 4
    ) AS cover_urls
  FROM public.albums a
  LEFT JOIN public.album_photos p ON p.album_id = a.id
  WHERE a.is_deleted = FALSE
  GROUP BY a.id, a.title, a.date, a.category, a.created_by, a.created_at
  ORDER BY a.created_at DESC;
$$;
