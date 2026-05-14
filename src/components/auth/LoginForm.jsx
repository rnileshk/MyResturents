import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ShieldCheck, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { loginUser } from "../../api/authApi";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizeRole = (role) => {
    if (!role) return "USER";
    return String(role).replace("ROLE_", "").toUpperCase();
  };

  const getRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return (
        payload.role ||
        payload.roles?.[0] ||
        payload.authority ||
        payload.authorities?.[0] ||
        null
      );
    } catch {
      return null;
    }
  };

  const getDashboardRoute = (role) => {
    const finalRole = normalizeRole(role);

    if (finalRole === "ADMIN") return "/admin/dashboard";
    if (finalRole === "EMPLOYEE") return "/employee/dashboard";
    if (finalRole === "DELIVERY_STAFF") return "/delivery/dashboard";
    if (finalRole === "BILLING_STAFF") return "/billing/dashboard";

    return "/user/dashboard";
  };

  const extractUser = (data, token) => {
    const role =
      data.role ||
      data.user?.role ||
      data.authority ||
      data.authorities?.[0]?.authority ||
      getRoleFromToken(token) ||
      "USER";

    return {
      id: data.id || data.user?.id || null,
      name:
        data.name ||
        data.user?.name ||
        data.user?.fullName ||
        data.fullName ||
        "User",
      email: data.email || data.user?.email || formData.email,
      role: normalizeRole(role),
    };
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(formData);

      const token =
        data.token ||
        data.accessToken ||
        data.jwtToken ||
        data.access_token;

      if (!token) {
        toast.error("Login failed: token not received");
        return;
      }

      const loggedInUser = extractUser(data, token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      toast.success(`Welcome ${loggedInUser.name} 🎉`);

      navigate(getDashboardRoute(loggedInUser.role), {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="mx-auto h-16 w-16 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-xl">
          <ShieldCheck size={34} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mt-4">
          Welcome Back
        </h2>

        <p className="text-slate-500 mt-1">
          Login to continue your restaurant journey.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="font-bold text-slate-700">Email Address</span>

        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 bg-white">
          <Mail size={20} className="text-slate-400" />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full outline-none bg-transparent"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </label>

      <label className="block space-y-2">
        <span className="font-bold text-slate-700">Password</span>

        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 bg-white">
          <Lock size={20} className="text-slate-400" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            className="w-full outline-none bg-transparent"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-slate-400 hover:text-orange-600 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl font-black text-lg transition disabled:opacity-60 shadow-lg"
      >
        <LogIn size={22} />
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;