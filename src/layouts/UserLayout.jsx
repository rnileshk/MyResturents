import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;