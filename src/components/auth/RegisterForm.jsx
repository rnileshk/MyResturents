import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Phone,
} from "lucide-react";

import toast from "react-hot-toast";
import { registerUser } from "../../api/authApi";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await registerUser(formData);

      toast.success("Registration successful 🎉");

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      <div className="text-center mb-6">
        <div className="mx-auto h-10 w-16 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-xl">
          <ShieldCheck size={24} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mt-2">
          Create Account
        </h2>
      </div>

      <label className="block space-y-1">
        <span className="font-bold text-slate-700">Full Name</span>

        <div className="flex items-center gap-1 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 bg-white">
          <User size={20} className="text-slate-400" />

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full outline-none bg-transparent"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </label>

      <label className="block space-y-1">
        <span className="font-bold text-slate-700">Email Address</span>

        <div className="flex items-center gap-1 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 bg-white">
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

      <label className="block space-y-1">
        <span className="font-bold text-slate-700">Phone Number</span>

        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 bg-white">
          <Phone size={20} className="text-slate-400" />

          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            className="w-full outline-none bg-transparent"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </label>

      <label className="block space-y-1">
        <span className="font-bold text-slate-700">Password</span>

        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 bg-white">
          <Lock size={20} className="text-slate-400" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create password"
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
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl font-black text-lg transition disabled:opacity-60 shadow-lg"
      >
        <UserPlus size={22} />

        {loading ? "Creating Account..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;