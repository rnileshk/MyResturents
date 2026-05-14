import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { getUserProfile, updateUserProfile } from "../../api/userApi";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");

        const data = await getUserProfile();

        setFormData({
          name: data?.name || data?.fullName || "",
          email: data?.email || "",
          phone: data?.phone || "",
          address: data?.address || "",
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load profile.");
        toast.error("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await updateUserProfile(formData);

      const updatedUser = data || formData;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully.");
      toast.success("Profile updated successfully ✨");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to update profile.";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-widest">
                Account Settings
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-3">
                My Profile
              </h1>

              <p className="text-slate-300 mt-4 max-w-2xl text-lg">
                Manage your personal details, contact information and delivery
                address from one secure profile panel.
              </p>
            </div>

            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
              <User size={44} className="text-white" />
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-4xl font-black shadow-xl">
              {(formData.name || formData.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <h2 className="text-2xl font-black text-slate-900 mt-5">
              {formData.name || "Customer"}
            </h2>

            <p className="text-slate-500 mt-1">
              {formData.email || "No email available"}
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <ShieldCheck className="text-emerald-600" size={22} />
                <span className="font-semibold">Secure customer account</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="text-orange-600" size={22} />
                <span>{formData.phone || "Phone not added"}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="text-blue-600" size={22} />
                <span>{formData.address || "Address not added"}</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6 space-y-5"
          >
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                Edit Profile
              </h2>

              <p className="text-slate-500 mt-1">
                Keep your account details fresh and accurate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="font-bold text-slate-700">Full Name</span>

                <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500">
                  <User size={20} className="text-slate-400" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="font-bold text-slate-700">Email</span>

                <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500">
                  <Mail size={20} className="text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="font-bold text-slate-700">Phone</span>

                <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500">
                  <Phone size={20} className="text-slate-400" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full outline-none"
                  />
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="font-bold text-slate-700">Address</span>

                <div className="flex items-start gap-3 border border-slate-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500">
                  <MapPin size={20} className="text-slate-400 mt-1" />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Delivery address"
                    className="w-full outline-none resize-none"
                    rows="4"
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl font-black text-lg transition disabled:opacity-60"
            >
              <Save size={22} />
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;