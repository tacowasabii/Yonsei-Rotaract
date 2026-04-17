import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import MobileNav from "@components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "./paths";

export default function Layout() {
  const { profile } = useAuth();

  if (profile?.status === "pending")  return <Navigate to={PATHS.PENDING_APPROVAL} replace />;
  if (profile?.status === "rejected") return <Navigate to={PATHS.REJECTED} replace />;
  if (profile?.status === "inactive") return <Navigate to={PATHS.INACTIVE} replace />;

  return (
    <div className="bg-background text-on-surface flex flex-col min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
