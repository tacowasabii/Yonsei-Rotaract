import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@components/layout/AdminLayout";
import HomePage from "@pages/HomePage";
import NewsPage from "@pages/NewsPage";
import NoticePage from "@pages/NoticePage";
import BoardPage from "@pages/BoardPage";
import BoardPostPage from "@pages/BoardPostPage";
import BoardWritePage from "@pages/BoardWritePage";
import AlumniPage from "@pages/AlumniPage";
import GalleryPage from "@pages/GalleryPage";
import LoginPage from "@pages/LoginPage";
import SignupPage from "@pages/SignupPage";
import OnboardingPage from "@pages/OnboardingPage";
import SignupCompletePage from "@pages/SignupCompletePage";
import AdminDashboard from "@pages/AdminPage/AdminDashboard";
import AdminPending from "@pages/AdminPage/AdminPending";
import AdminMembers from "@pages/AdminPage/AdminMembers";
import PendingApprovalPage from "@pages/PendingApprovalPage";
import RejectedPage from "@pages/RejectedPage";
import InactivePage from "@pages/InactivePage";
import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: PATHS.HOME,             element: <HomePage /> },
      { path: PATHS.NEWS,             element: <NewsPage /> },
      { path: PATHS.NOTICE,           element: <NoticePage /> },
      { path: PATHS.BOARD,            element: <BoardPage /> },
      { path: PATHS.BOARD_FREE,       element: <BoardPage /> },
      { path: PATHS.BOARD_FREE_WRITE, element: <BoardWritePage /> },
      { path: PATHS.BOARD_FREE_POST,  element: <BoardPostPage /> },
      { path: PATHS.BOARD_PROMO,      element: <BoardPage /> },
      { path: PATHS.BOARD_PROMO_WRITE,element: <BoardWritePage /> },
      { path: PATHS.BOARD_PROMO_POST, element: <BoardPostPage /> },
      { path: PATHS.ALUMNI,           element: <AlumniPage /> },
      { path: PATHS.GALLERY,          element: <GalleryPage /> },
      { path: PATHS.LOGIN,            element: <LoginPage /> },
      { path: PATHS.SIGNUP,           element: <SignupPage /> },
      { path: PATHS.SIGNUP_COMPLETE,  element: <SignupCompletePage /> },
      { path: PATHS.ONBOARDING,       element: <OnboardingPage /> },
    ],
  },
  // 가입 상태 페이지 (standalone, Layout 없음)
  { path: PATHS.PENDING_APPROVAL, element: <PendingApprovalPage /> },
  { path: PATHS.REJECTED, element: <RejectedPage /> },
  { path: PATHS.INACTIVE, element: <InactivePage /> },
  // 관리자: 완전히 별도 레이아웃 (staff 이상 접근 가능)
  {
    element: <ProtectedRoute requiredRole="staff" />,
    children: [
      {
        path: PATHS.ADMIN,
        element: <AdminLayout />,
        children: [
          { index: true,         element: <AdminDashboard /> },
          { path: "pending",     element: <AdminPending /> },
          { path: "members",     element: <AdminMembers /> },
        ],
      },
    ],
  },
]);
