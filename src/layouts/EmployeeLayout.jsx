import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const EmployeeLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;