import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import { PATHS } from "./paths";

// 메인
import HomePage from "@pages/HomePage";
import NewsPage from "@pages/NewsPage";
import NoticePage from "@pages/NoticePage";
import AlumniPage from "@pages/AlumniPage";
import GalleryPage from "@pages/GalleryPage";
import MyPageLayout from "@pages/MyPage";
import MyProfile   from "@pages/MyPage/Profile";
import MyPosts     from "@pages/MyPage/Posts";
import MyMessages  from "@pages/MyPage/Messages";

// 게시판
import BoardPage from "@pages/board/BoardPage";
import BoardPostPage from "@pages/board/BoardPostPage";
import BoardWritePage from "@pages/board/BoardWritePage";

// 인증
import LoginPage from "@pages/auth/LoginPage";
import SignupPage from "@pages/auth/SignupPage";
import PendingApprovalPage from "@pages/auth/PendingApprovalPage";
import RejectedPage from "@pages/auth/RejectedPage";
import InactivePage from "@pages/auth/InactivePage";

// 관리자
import AdminLayout from "@components/layout/AdminLayout";
import AdminDashboard from "@pages/admin/Dashboard";
import AdminPending from "@pages/admin/Pending";
import AdminMembers from "@pages/admin/Members";
import AdminDonations from "@pages/admin/Donations";

// 후원
import DonatePage from "@pages/DonatePage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // 메인
      { path: PATHS.HOME,   element: <HomePage /> },
      { path: PATHS.NEWS,   element: <NewsPage /> },
      { path: PATHS.NOTICE, element: <NoticePage /> },
      { path: PATHS.ALUMNI, element: <AlumniPage /> },
      { path: PATHS.GALLERY,element: <GalleryPage /> },
      {
        path: PATHS.MYPAGE,
        element: <MyPageLayout />,
        children: [
          { index: true,    element: <MyProfile /> },
          { path: "posts",    element: <MyPosts /> },
          { path: "messages", element: <MyMessages /> },
        ],
      },

      // 게시판
      { path: PATHS.BOARD,             element: <BoardPage /> },
      { path: PATHS.BOARD_FREE,        element: <BoardPage /> },
      { path: PATHS.BOARD_FREE_WRITE,  element: <BoardWritePage /> },
      { path: PATHS.BOARD_FREE_POST,   element: <BoardPostPage /> },
      { path: PATHS.BOARD_FREE_EDIT,   element: <BoardWritePage /> },
      { path: PATHS.BOARD_PROMO,       element: <BoardPage /> },
      { path: PATHS.BOARD_PROMO_WRITE, element: <BoardWritePage /> },
      { path: PATHS.BOARD_PROMO_POST,  element: <BoardPostPage /> },
      { path: PATHS.BOARD_PROMO_EDIT,  element: <BoardWritePage /> },
      { path: PATHS.BOARD_ANON,        element: <BoardPage /> },
      { path: PATHS.BOARD_ANON_WRITE,  element: <BoardWritePage /> },
      { path: PATHS.BOARD_ANON_POST,   element: <BoardPostPage /> },
      { path: PATHS.BOARD_ANON_EDIT,   element: <BoardWritePage /> },

      // 후원
      { path: PATHS.DONATE, element: <DonatePage /> },

      // 인증
      { path: PATHS.LOGIN,           element: <LoginPage /> },
      { path: PATHS.SIGNUP,          element: <SignupPage /> },
    ],
  },

  // 가입 상태 페이지 (standalone, Layout 없음)
  { path: PATHS.PENDING_APPROVAL, element: <PendingApprovalPage /> },
  { path: PATHS.REJECTED,         element: <RejectedPage /> },
  { path: PATHS.INACTIVE,         element: <InactivePage /> },

  // 관리자 (staff 이상, 별도 레이아웃)
  {
    element: <ProtectedRoute requiredRole="staff" />,
    children: [
      {
        path: PATHS.ADMIN,
        element: <AdminLayout />,
        children: [
          { index: true,       element: <AdminDashboard /> },
          { path: "pending",   element: <AdminPending /> },
          { path: "members",   element: <AdminMembers /> },
          { path: "donations", element: <AdminDonations /> },
        ],
      },
    ],
  },
]);
