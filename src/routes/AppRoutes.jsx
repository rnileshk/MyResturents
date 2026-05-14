import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import BillingLayout from "../layouts/BillingLayout";
import DeliveryLayout from "../layouts/DeliveryLayout";

import Home from "../pages/public/Home";
import Menu from "../pages/public/Menu";
import BookTable from "../pages/public/BookTable";
import VerifyBooking from "../pages/public/VerifyBooking";
import NotFound from "../pages/public/NotFound";

import UserDashboard from "../pages/user/UserDashboard";
import Profile from "../pages/user/Profile";
import MyBookings from "../pages/user/MyBookings";
import MyOrders from "../pages/user/MyOrders";
import CartPage from "../pages/user/CartPage";
import Checkout from "../pages/user/Checkout";
import PaymentPage from "../pages/user/PaymentPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageEmployees from "../pages/admin/ManageEmployees";
import CreateEmployee from "../pages/admin/CreateEmployee";
import ManageMenu from "../pages/admin/ManageMenu";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageBookings from "../pages/admin/ManageBookings";
import ManagePayments from "../pages/admin/ManagePayments";
import ManageBills from "../pages/admin/ManageBills";
import ManageDeliveries from "../pages/admin/ManageDeliveries";
import UploadImage from "../pages/admin/UploadImage";

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeOrders from "../pages/employee/EmployeeOrders";
import EmployeeBookings from "../pages/employee/EmployeeBookings";
import EmployeeBilling from "../pages/employee/EmployeeBilling";
import EmployeeVerifyBooking from "../pages/employee/EmployeeVerifyBooking";

import BillingDashboard from "../pages/billing/BillingDashboard";
import BillingList from "../pages/billing/BillingList";
import CreateBill from "../pages/billing/CreateBill";

import DeliveryDashboard from "../pages/delivery/DeliveryDashboard";
import DeliveryList from "../pages/delivery/DeliveryList";
import UpdateDeliveryStatus from "../pages/delivery/UpdateDeliveryStatus";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/verify-booking/:bookingCode" element={<VerifyBooking />} />
        <Route path="/unauthorized" element={<h1 className="p-10 text-2xl font-bold">Unauthorized Access</h1>} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["USER"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/bookings" element={<MyBookings />} />
            <Route path="/user/orders" element={<MyOrders />} />
            <Route path="/user/cart" element={<CartPage />} />
            <Route path="/user/checkout" element={<Checkout />} />
            <Route path="/user/payment" element={<PaymentPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/employees" element={<ManageEmployees />} />
            <Route path="/admin/employees/create" element={<CreateEmployee />} />
            <Route path="/admin/menu" element={<ManageMenu />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/payments" element={<ManagePayments />} />
            <Route path="/admin/bills" element={<ManageBills />} />
            <Route path="/admin/deliveries" element={<ManageDeliveries />} />
            <Route path="/admin/upload" element={<UploadImage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["EMPLOYEE"]} />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/orders" element={<EmployeeOrders />} />
            <Route path="/employee/bookings" element={<EmployeeBookings />} />
            <Route path="/employee/billing" element={<EmployeeBilling />} />
            <Route path="/employee/verify-booking" element={<EmployeeVerifyBooking />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["BILLING_STAFF"]} />}>
          <Route element={<BillingLayout />}>
            <Route path="/billing/dashboard" element={<BillingDashboard />} />
            <Route path="/billing/list" element={<BillingList />} />
            <Route path="/billing/create" element={<CreateBill />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["DELIVERY_STAFF"]} />}>
          <Route element={<DeliveryLayout />}>
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/list" element={<DeliveryList />} />
            <Route path="/delivery/update-status" element={<UpdateDeliveryStatus />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;