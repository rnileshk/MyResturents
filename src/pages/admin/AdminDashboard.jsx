import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/dashboard");
        setStats(res.data || {});
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
          return;
        }

        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const dashboardCards = [
    {
      title: "Users",
      value: stats.totalUsers ?? 0,
      route: "/admin/users",
      icon: "👥",
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
    },
    {
      title: "Orders",
      value: stats.totalOrders ?? 0,
      route: "/admin/orders",
      icon: "🧾",
      gradient: "from-orange-500 to-red-500",
      bg: "bg-orange-50",
    },
    {
      title: "Bookings",
      value: stats.totalBookings ?? 0,
      route: "/admin/bookings",
      icon: "📅",
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Payments",
      value: stats.totalPayments ?? 0,
      route: "/admin/payments",
      icon: "💳",
      gradient: "from-purple-500 to-fuchsia-600",
      bg: "bg-purple-50",
    },
    {
      title: "Bills",
      value: stats.totalBills ?? 0,
      route: "/admin/bills",
      icon: "📄",
      gradient: "from-slate-700 to-slate-900",
      bg: "bg-slate-50",
    },
    {
      title: "Deliveries",
      value: stats.totalDeliveries ?? 0,
      route: "/admin/deliveries",
      icon: "🛵",
      gradient: "from-cyan-500 to-blue-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Revenue",
      value: `₹ ${stats.totalRevenue ?? 0}`,
      route: "/admin/revenue",
      icon: "💰",
      gradient: "from-amber-500 to-yellow-600",
      bg: "bg-amber-50",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-orange-300 font-semibold tracking-wide uppercase text-sm">
                Restaurant Control Center
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Admin Dashboard
              </h1>

              <p className="text-slate-300 mt-3 max-w-2xl">
                Welcome back, {admin.name || admin.fullName || "Admin"}. Manage
                users, orders, bookings, payments, billing, deliveries and
                revenue from one polished command deck.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/admin/menu")}
                className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition shadow-lg"
              >
                Manage Menu
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.route)}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className={`h-14 w-14 rounded-2xl ${card.bg} flex items-center justify-center text-3xl shadow-inner`}
                >
                  {card.icon}
                </div>

                <div
                  className={`h-10 w-10 rounded-full bg-gradient-to-r ${card.gradient} text-white flex items-center justify-center opacity-90 group-hover:scale-110 transition`}
                >
                  →
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-slate-500 font-semibold text-lg">
                  {card.title}
                </h2>

                <p className="text-4xl font-black text-slate-900 mt-2">
                  {card.value}
                </p>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.route);
                }}
                className="mt-6 inline-flex items-center gap-2 text-slate-900 font-bold group-hover:text-orange-600 transition cursor-pointer"
              >
                View Details <span>→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-3xl bg-white/10 border border-white/10 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white">
              Operations Snapshot
            </h2>

            <p className="text-slate-300 mt-2">
              Keep an eye on restaurant movement in one place.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-slate-400">Orders</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalOrders ?? 0}
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-slate-400">Bookings</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalBookings ?? 0}
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-slate-400">Payments</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalPayments ?? 0}
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-slate-400">Bills</p>
                <p className="text-2xl font-bold text-white">
                  {stats.totalBills ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-6 shadow-2xl text-white">
            <p className="text-orange-100 font-semibold">Total Revenue</p>

            <h2 className="text-4xl font-black mt-3">
              ₹ {stats.totalRevenue ?? 0}
            </h2>

            <p className="text-orange-100 mt-4">
              Revenue tracking gives your restaurant cockpit its golden
              speedometer.
            </p>

            <button
              onClick={() => navigate("/admin/payments")}
              className="mt-6 bg-white text-orange-700 px-5 py-3 rounded-2xl font-bold hover:bg-orange-50 transition"
            >
              View Payments →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;