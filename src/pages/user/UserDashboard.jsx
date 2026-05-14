import { Link, useNavigate } from "react-router-dom";
import {
  User,
  CalendarCheck,
  ShoppingBag,
  UtensilsCrossed,
  Table2,
  ShoppingCart,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    user =
      storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
  } catch (error) {
    console.error("Invalid user data:", error);
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const cards = [
    {
      title: "Profile",
      description: "View and update your personal profile details.",
      path: "/user/profile",
      icon: User,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "My Bookings",
      description: "Track your restaurant table reservations.",
      path: "/user/bookings",
      icon: CalendarCheck,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "My Orders",
      description: "Track all your food orders and deliveries.",
      path: "/user/orders",
      icon: ShoppingBag,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Order Food",
      description: "Browse menu and order your favorite meals.",
      path: "/menu",
      icon: UtensilsCrossed,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Book Table",
      description: "Reserve your premium dining table instantly.",
      path: "/book-table",
      icon: Table2,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Cart",
      description: "Review selected food items before checkout.",
      path: "/user/cart",
      icon: ShoppingCart,
      gradient: "from-yellow-500 to-orange-500",
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
                Customer Space
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
                Welcome Back,
                <br />
                {user?.name ||
                  user?.fullName ||
                  user?.email ||
                  "Customer"} ✨
              </h1>

              <p className="text-slate-300 mt-4 max-w-2xl text-lg">
                Manage your bookings, orders, food cart and dining experience
                from one premium customer dashboard.
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    Open
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
              Dining Experience
            </p>

            <h2 className="text-5xl font-black text-orange-600 mt-3">
              Premium
            </h2>

            <p className="text-slate-600 mt-3">
              Enjoy seamless restaurant reservations and online ordering.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">
              Live Order Tracking
            </p>

            <h2 className="text-5xl font-black text-emerald-600 mt-3">
              Real-Time
            </h2>

            <p className="text-slate-600 mt-3">
              Track food preparation and delivery updates instantly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">
              Smart Reservations
            </p>

            <h2 className="text-5xl font-black text-blue-600 mt-3">
              Fast
            </h2>

            <p className="text-slate-600 mt-3">
              Book tables quickly with secure digital reservation support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;