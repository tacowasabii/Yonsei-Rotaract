import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileNav from "./components/layout/MobileNav";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="bg-background text-on-surface flex flex-col min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="flex-1">
        <HomePage />
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;
