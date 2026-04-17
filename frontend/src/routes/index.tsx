import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
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
import AdminPage from "@pages/AdminPage";
import SignupCompletePage from "@pages/SignupCompletePage";
import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // 공개 라우트
      { path: PATHS.HOME, element: <HomePage /> },
      { path: PATHS.NEWS, element: <NewsPage /> },
      { path: PATHS.NOTICE, element: <NoticePage /> },
      { path: PATHS.BOARD, element: <BoardPage /> },
      { path: PATHS.BOARD_FREE, element: <BoardPage /> },
      { path: PATHS.BOARD_FREE_WRITE, element: <BoardWritePage /> },
      { path: PATHS.BOARD_FREE_POST, element: <BoardPostPage /> },
      { path: PATHS.BOARD_PROMO, element: <BoardPage /> },
      { path: PATHS.BOARD_PROMO_WRITE, element: <BoardWritePage /> },
      { path: PATHS.BOARD_PROMO_POST, element: <BoardPostPage /> },
      { path: PATHS.ALUMNI, element: <AlumniPage /> },
      { path: PATHS.GALLERY, element: <GalleryPage /> },
      { path: PATHS.LOGIN, element: <LoginPage /> },
      { path: PATHS.SIGNUP, element: <SignupPage /> },
      { path: PATHS.SIGNUP_COMPLETE, element: <SignupCompletePage /> },
      { path: PATHS.ONBOARDING, element: <OnboardingPage /> },

      // admin 이상만 접근 가능
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          { path: PATHS.ADMIN, element: <AdminPage /> },
        ],
      },
    ],
  },
]);
