import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileNav from "./components/layout/MobileNav";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import NoticePage from "./pages/NoticePage";
import BoardPage from "./pages/BoardPage";
import AlumniPage from "./pages/AlumniPage";
import GalleryPage from "./pages/GalleryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background text-on-surface flex flex-col min-h-screen pb-20 md:pb-0">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/notice" element={<NoticePage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <Footer />
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
