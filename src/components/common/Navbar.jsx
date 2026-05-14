import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import { getCartCount } from "../../utils/cartUtils";

const Navbar = () => {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [cartCount, setCartCount] = useState(getCartCount());

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getDashboardRoute = () => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "EMPLOYEE") return "/employee/dashboard";
    if (role === "DELIVERY_STAFF") return "/delivery/dashboard";
    if (role === "BILLING_STAFF") return "/billing/dashboard";
    return "/user/dashboard";
  };

  return (
    <>
      <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Restaurant App
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/book-table">Book Table</Link>

          {isNormalUser && (
            <button
              onClick={() => navigate("/user/cart")}
              className="relative bg-white/10 hover:bg-orange-500 px-4 py-2 rounded-xl transition"
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
              <Link to={getDashboardRoute()}>Dashboard</Link>

              <button
                onClick={() => navigate(getDashboardRoute())}
                className="text-orange-400 font-semibold cursor-pointer"
              >
                {user.name || user.fullName || user.email || "User"}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 cursor-pointer text-white font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-center">
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