import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  CalendarCheck,
  Receipt,
  ShieldCheck,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user") || "null") || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const cards = [
    {
      title: "Manage Orders",
      description: "View and update customer food orders.",
      path: "/employee/orders",
      icon: ShoppingCart,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Manage Bookings",
      description: "View table bookings and customer reservations.",
      path: "/employee/bookings",
      icon: CalendarCheck,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Billing",
      description: "Create and manage customer bills.",
      path: "/employee/billing",
      icon: Receipt,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Verify Booking",
      description: "Verify booking using customer booking code.",
      path: "/employee/verify-booking",
      icon: ShieldCheck,
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-widest">
                Employee Control Panel
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
                Welcome Back,
                <br />
                {user?.name || "Employee"} 👨‍🍳
              </h1>

              <p className="text-slate-300 mt-4 max-w-2xl text-lg">
                Handle restaurant operations, monitor bookings,
                manage billing and control customer orders from one
                premium workspace.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold transition shadow-lg cursor-pointer"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.path}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-orange-500/20"
              >
                <div
                  className={`absolute top-0 right-0 h-40 w-40 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-3xl`}
                />

                <div
                  className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}
                >
                  <Icon size={30} />
                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-black text-slate-900">
                    {card.title}
                  </h2>

                  <p className="text-slate-600 mt-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-slate-900 font-bold text-lg">
                    Open Panel
                  </span>

                  <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition">
                    <ArrowUpRight size={22} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">
              Orders Management
            </p>

            <h2 className="text-5xl font-black text-orange-600 mt-3">
              24/7
            </h2>

            <p className="text-slate-600 mt-3">
              Manage active restaurant food workflow and kitchen operations.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">
              Booking Verification
            </p>

            <h2 className="text-5xl font-black text-emerald-600 mt-3">
              Live
            </h2>

            <p className="text-slate-600 mt-3">
              Verify customer reservations instantly using booking codes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">
              Billing Operations
            </p>

            <h2 className="text-5xl font-black text-blue-600 mt-3">
              Fast
            </h2>

            <p className="text-slate-600 mt-3">
              Access billing records and customer payment information quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;