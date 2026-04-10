import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "@pages/HomePage";
import NewsPage from "@pages/NewsPage";
import NoticePage from "@pages/NoticePage";
import BoardPage from "@pages/BoardPage";
import AlumniPage from "@pages/AlumniPage";
import GalleryPage from "@pages/GalleryPage";
import LoginPage from "@pages/LoginPage";
import SignupPage from "@pages/SignupPage";
import OnboardingPage from "@pages/OnboardingPage";
import AdminPage from "@pages/AdminPage";
import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: PATHS.HOME, element: <HomePage /> },
      { path: PATHS.NEWS, element: <NewsPage /> },
      { path: PATHS.NOTICE, element: <NoticePage /> },
      { path: PATHS.BOARD, element: <BoardPage /> },
      { path: PATHS.BOARD_FREE, element: <BoardPage /> },
      { path: PATHS.BOARD_PROMO, element: <BoardPage /> },
      { path: PATHS.ALUMNI, element: <AlumniPage /> },
      { path: PATHS.GALLERY, element: <GalleryPage /> },
      { path: PATHS.LOGIN, element: <LoginPage /> },
      { path: PATHS.SIGNUP, element: <SignupPage /> },
      { path: PATHS.ONBOARDING, element: <OnboardingPage /> },
      { path: PATHS.ADMIN, element: <AdminPage /> },
    ],
  },
]);
