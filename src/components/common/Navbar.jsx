import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import { getCartCount } from "../../utils/cartUtils";

const Navbar = () => {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [cartCount, setCartCount] = useState(getCartCount());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user =
      storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const normalizeRole = (role) => {
    if (!role) return "USER";
    return String(role).replace("ROLE_", "").toUpperCase();
  };

  const role = normalizeRole(user?.role);
  const isNormalUser = token && user && role === "USER";

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());

    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeSidebar();
    navigate("/");
  };

  const getDashboardRoute = () => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "EMPLOYEE") return "/employee/dashboard";
    if (role === "DELIVERY_STAFF") return "/delivery/dashboard";
    if (role === "BILLING_STAFF") return "/billing/dashboard";
    return "/user/dashboard";
  };

  const openLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
    closeSidebar();
  };

  const NavLinks = ({ mobile = false }) => (
    <div
      className={
        mobile
          ? "flex flex-col gap-4 text-base"
          : "hidden md:flex items-center gap-5"
      }
    >
      <Link onClick={closeSidebar} to="/" className="hover:text-orange-400">
        Home
      </Link>

      <Link onClick={closeSidebar} to="/menu" className="hover:text-orange-400">
        Menu
      </Link>

      <Link
        onClick={closeSidebar}
        to="/book-table"
        className="hover:text-orange-400"
      >
        Book Table
      </Link>

      {isNormalUser && (
        <button
          onClick={() => {
            closeSidebar();
            navigate("/user/cart");
          }}
          className="relative bg-white/10 hover:bg-orange-500 px-4 py-2 rounded-xl transition w-fit"
        >
          <ShoppingCart size={22} />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs h-5 min-w-5 px-1 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      )}

      {token && user ? (
        <>
          <Link
            onClick={closeSidebar}
            to={getDashboardRoute()}
            className="hover:text-orange-400"
          >
            Dashboard
          </Link>

          <button
            onClick={() => {
              closeSidebar();
              navigate(getDashboardRoute());
            }}
            className="text-orange-400 font-semibold text-left"
          >
            {user.name || user.fullName || user.email || "User"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white font-semibold w-fit"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={openLogin}
          className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 w-fit"
        >
          Login
        </button>
      )}
    </div>
  );

  return (
    <>
      <nav className="bg-black text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl sm:text-2xl font-bold">
          Restaurant App
        </Link>

        <NavLinks />

        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden bg-white/10 p-2 rounded-lg hover:bg-white/20"
        >
          <Menu size={24} />
        </button>
      </nav>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={closeSidebar}
            className="absolute inset-0 bg-black/60"
          ></div>

          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-black text-white shadow-2xl p-5">
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/"
                onClick={closeSidebar}
                className="text-xl font-bold text-orange-400"
              >
                Restaurant App
              </Link>

              <button
                onClick={closeSidebar}
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
              >
                <X size={22} />
              </button>
            </div>

            <NavLinks mobile />
          </aside>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl p-5 sm:p-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-center">
              {authMode === "login" ? "Login" : "Register"}
            </h2>

            <div className="mt-6">
              {authMode === "login" ? <LoginForm /> : <RegisterForm />}
            </div>

            <div className="text-center mt-6">
              {authMode === "login" ? (
                <p className="text-gray-600">
                  Do not have an account?{" "}
                  <button
                    onClick={() => setAuthMode("register")}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;