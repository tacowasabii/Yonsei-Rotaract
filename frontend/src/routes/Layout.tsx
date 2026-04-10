import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MobileNav from "../components/layout/MobileNav";

export default function Layout() {
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
