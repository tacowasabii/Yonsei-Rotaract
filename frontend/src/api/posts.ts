import { supabase } from "@/lib/supabase";

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.75;

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("압축 실패"))),
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("이미지 로드 실패")); };
    img.src = url;
  });
}

export interface Post {
  id: string;
  post_number: number;
  board_type: "free" | "promo";
  title: string;
  content: string;
  author_id: string;
  visibility: "public" | "members";
  views: number;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  profiles: {
    name: string;
    role: string;
  } | null;
}

export interface CreatePostParams {
  board_type: "free" | "promo";
  title: string;
  content: string;
  visibility: "public" | "members";
  images: File[];
}

export async function fetchPosts(boardType: "free" | "promo"): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(name, role)")
    .eq("board_type", boardType)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function fetchPost(id: string): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(name, role)")
    .eq("id", id)
    .single();

  if (error) throw error;

  // 조회수 증가 (fire and forget)
  supabase.rpc("increment_post_views", { post_id: id });

  return data as Post;
}

export async function deletePost(id: string): Promise<void> {
  // 먼저 image_urls 조회
  const { data: post } = await supabase
    .from("posts")
    .select("image_urls")
    .eq("id", id)
    .single();

  // Storage 이미지 삭제
  if (post?.image_urls?.length) {
    const bucketUrl = supabase.storage.from("post-images").getPublicUrl("").data.publicUrl.replace(/\/$/, "");
    const paths = (post.image_urls as string[])
      .map((url) => url.replace(`${bucketUrl}/`, ""))
      .filter(Boolean);
    if (paths.length) {
      await supabase.storage.from("post-images").remove(paths);
    }
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export interface UpdatePostParams {
  title: string;
  content: string;
  visibility: "public" | "members";
  existingImageUrls: string[];
  newImages: File[];
}

export async function updatePost(id: string, params: UpdatePostParams): Promise<Post> {
  const newUrls: string[] = [];

  for (const image of params.newImages) {
    const compressed = await compressImage(image);
    const path = `${id}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(path, compressed, { contentType: "image/jpeg" });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(path);
    newUrls.push(publicUrl);
  }

  const { data, error } = await supabase
    .from("posts")
    .update({
      title: params.title,
      content: params.content,
      visibility: params.visibility,
      image_urls: [...params.existingImageUrls, ...newUrls],
    })
    .eq("id", id)
    .select("*, profiles(name, role)")
    .single();

  if (error) throw error;
  return data as Post;
}

export async function createPost(
  authorId: string,
  params: CreatePostParams
): Promise<Post> {
  const imageUrls: string[] = [];

  for (const image of params.images) {
    const compressed = await compressImage(image);
    const path = `${authorId}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(path, compressed, { contentType: "image/jpeg" });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("post-images").getPublicUrl(path);

    imageUrls.push(publicUrl);
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      board_type: params.board_type,
      title: params.title,
      content: params.content,
      author_id: authorId,
      visibility: params.visibility,
      image_urls: imageUrls,
    })
    .select("*, profiles(name, role)")
    .single();

  if (error) throw error;
  return data as Post;
}
