import { supabase } from "@/lib/supabase";
import { compressImage } from "@/utils/image";

// ── Types ──────────────────────────────────────────────────────────────────

export type GalleryCategory = "봉사활동" | "대내활동" | "대외활동" | "버디활동" | "기타";

export interface Album {
  id: string;
  title: string;
  date: string;
  category: GalleryCategory;
  created_by: string | null;
  created_at: string;
  photo_count: number;
  cover_urls: string[];
}

export interface AlbumPhoto {
  id: string;
  album_id: string;
  storage_path: string;
  url: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface AllPhotosRow extends AlbumPhoto {
  category: GalleryCategory;
  album_title: string;
}

export interface CreateAlbumParams {
  title: string;
  date: Date;
  category: GalleryCategory;
  photos: File[];
}

// ── Albums ─────────────────────────────────────────────────────────────────

export async function fetchAlbums(): Promise<Album[]> {
  const { data, error } = await supabase.rpc("get_albums_with_covers");
  if (error) throw error;
  return (data ?? []) as Album[];
}

export async function fetchAlbum(id: string): Promise<Album> {
  const { data, error } = await supabase.rpc("get_albums_with_covers");
  if (error) throw error;
  const album = (data as Album[]).find((a) => a.id === id);
  if (!album) throw new Error("앨범을 찾을 수 없어요.");
  return album;
}

export async function createAlbum(
  createdBy: string,
  params: CreateAlbumParams
): Promise<Album> {
  const { data: row, error } = await supabase
    .from("albums")
    .insert({
      title: params.title,
      date: params.date.toISOString().slice(0, 10),
      category: params.category,
      created_by: createdBy,
    })
    .select("id")
    .single();

  if (error) throw error;
  const albumId = row.id as string;

  if (params.photos.length > 0) {
    await uploadPhotos(albumId, createdBy, params.photos);
  }

  return fetchAlbum(albumId);
}

export async function softDeleteAlbum(albumId: string): Promise<void> {
  const { error } = await supabase
    .from("albums")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("id", albumId);
  if (error) throw error;
}

// ── Photos ─────────────────────────────────────────────────────────────────

export async function fetchPhotosByAlbum(albumId: string): Promise<AlbumPhoto[]> {
  const { data, error } = await supabase
    .from("album_photos")
    .select("*")
    .eq("album_id", albumId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AlbumPhoto[];
}

export async function fetchAllPhotos(
  category?: GalleryCategory | "전체"
): Promise<AllPhotosRow[]> {
  const { data, error } = await supabase
    .from("album_photos")
    .select("*, albums!album_photos_album_id_fkey(category, title, is_deleted)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = ((data ?? []) as Array<AlbumPhoto & {
    albums: { category: string; title: string; is_deleted: boolean } | null;
  }>)
    .filter((r) => r.albums && !r.albums.is_deleted)
    .map((r) => ({
      ...r,
      category: r.albums!.category as GalleryCategory,
      album_title: r.albums!.title,
    }));

  if (!category || category === "전체") return rows;
  return rows.filter((r) => r.category === category);
}

export async function uploadPhotos(
  albumId: string,
  uploadedBy: string,
  files: File[]
): Promise<AlbumPhoto[]> {
  const results: AlbumPhoto[] = [];

  for (const file of files) {
    const compressed = await compressImage(file);
    const storagePath = `${albumId}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("gallery-images")
      .upload(storagePath, compressed, { contentType: "image/jpeg" });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("gallery-images")
      .getPublicUrl(storagePath);

    const { data: photoRow, error: insertError } = await supabase
      .from("album_photos")
      .insert({
        album_id: albumId,
        storage_path: storagePath,
        url: publicUrl,
        uploaded_by: uploadedBy,
      })
      .select("*")
      .single();

    if (insertError) throw insertError;
    results.push(photoRow as AlbumPhoto);
  }

  return results;
}

export async function deletePhotos(
  photos: Array<{ id: string; storage_path: string }>
): Promise<void> {
  const paths = photos.map((p) => p.storage_path);
  const { error: storageError } = await supabase.storage
    .from("gallery-images")
    .remove(paths);

  if (storageError) throw storageError;

  const ids = photos.map((p) => p.id);
  const { error: dbError } = await supabase
    .from("album_photos")
    .delete()
    .in("id", ids);

  if (dbError) throw dbError;
}
