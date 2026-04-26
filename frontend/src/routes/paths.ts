export const PATHS = {
  // 메인
  HOME: "/",
  NEWS: "/news",
  NOTICE: "/notice",
  ALUMNI: "/alumni",
  GALLERY: "/gallery",
  MYPAGE: "/mypage",
  MYPAGE_POSTS: "/mypage/posts",
  MYPAGE_MESSAGES: "/mypage/messages",

  // 게시판
  BOARD: "/board",
  BOARD_FREE: "/board/free",
  BOARD_FREE_WRITE: "/board/free/write",
  BOARD_FREE_POST: "/board/free/:id",
  BOARD_FREE_EDIT: "/board/free/:id/edit",
  BOARD_PROMO: "/board/promo",
  BOARD_PROMO_WRITE: "/board/promo/write",
  BOARD_PROMO_POST: "/board/promo/:id",
  BOARD_PROMO_EDIT: "/board/promo/:id/edit",

  // 인증
  LOGIN: "/login",
  SIGNUP: "/signup",
  PENDING_APPROVAL: "/pending-approval",
  REJECTED: "/rejected",
  INACTIVE: "/inactive",

  // 관리자
  ADMIN: "/admin",
  ADMIN_PENDING: "/admin/pending",
  ADMIN_MEMBERS: "/admin/members",
} as const;

export const BOARD_PATHS = {
  root: (type: string) => `/board/${type}`,
  write: (type: string) => `/board/${type}/write`,
  post: (type: string, id: string | number) => `/board/${type}/${id}`,
  edit: (type: string, id: string | number) => `/board/${type}/${id}/edit`,
};
