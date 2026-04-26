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
  is_notice: boolean;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  profiles: {
    name: string;
    role: string;
  } | null;
  comments: Array<{ count: number }> | null;
  post_likes: Array<{ count: number }> | null;
}

export interface CreatePostParams {
  board_type: "free" | "promo";
  title: string;
  content: string;
  visibility: "public" | "members";
  images: File[];
  is_notice?: boolean;
}

export const POSTS_PER_PAGE = 15;

export async function fetchPosts(
  boardType: "free" | "promo",
  page: number = 1
): Promise<{ posts: Post[]; totalCount: number }> {
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(name, role), comments(count), post_likes(count)", { count: "exact" })
    .eq("board_type", boardType)
    .eq("is_notice", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { posts: (data ?? []) as Post[], totalCount: count ?? 0 };
}

export async function fetchNoticePosts(boardType: "free" | "promo"): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(name, role), comments(count), post_likes(count)")
    .eq("board_type", boardType)
    .eq("is_notice", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Post[];
}

export const MY_POSTS_PER_PAGE = 15;

export async function fetchMyPosts(
  authorId: string,
  boardType: "all" | "free" | "promo" = "all",
  page: number = 1
): Promise<{ posts: Post[]; totalCount: number }> {
  const from = (page - 1) * MY_POSTS_PER_PAGE;
  const to = from + MY_POSTS_PER_PAGE - 1;

  let query = supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(name, role), comments(count), post_likes(count)", { count: "exact" })
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (boardType !== "all") {
    query = query.eq("board_type", boardType);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: (data ?? []) as Post[], totalCount: count ?? 0 };
}

export async function fetchPost(id: string): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(name, role), comments(count), post_likes(count)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Post;
}

export async function fetchPostLiked(postId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function togglePostLike(postId: string, userId: string): Promise<boolean> {
  const liked = await fetchPostLiked(postId, userId);
  if (liked) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
    return false;
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
    return true;
  }
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
    .select("*, profiles!posts_author_id_fkey(name, role)")
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
      is_notice: params.is_notice ?? false,
      image_urls: imageUrls,
    })
    .select("*, profiles!posts_author_id_fkey(name, role)")
    .single();

  if (error) throw error;
  return data as Post;
}
