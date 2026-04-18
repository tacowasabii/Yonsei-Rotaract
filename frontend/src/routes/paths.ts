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
  BOARD_PROMO: "/board/promo",
  BOARD_PROMO_WRITE: "/board/promo/write",
  BOARD_PROMO_POST: "/board/promo/:id",

  // 인증
  LOGIN: "/login",
  SIGNUP: "/signup",
  SIGNUP_COMPLETE: "/signup/complete",
  PENDING_APPROVAL: "/pending-approval",
  REJECTED: "/rejected",
  INACTIVE: "/inactive",

  // 관리자
  ADMIN: "/admin",
  ADMIN_PENDING: "/admin/pending",
  ADMIN_MEMBERS: "/admin/members",
} as const;
