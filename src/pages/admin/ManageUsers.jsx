import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "USER",
  active: true,
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/api/admin/users");
      setUsers(normalizeList(res.data));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setShowForm(true);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "USER",
      active: user.active ?? true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        active: formData.active,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      if (editingId) {
        await axiosInstance.put(`/api/admin/users/${editingId}`, payload);
        setSuccess("User updated successfully.");
      } else {
        await axiosInstance.post("/api/auth/register", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        });
        setSuccess("User created successfully.");
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setError("");
      setSuccess("");

      await axiosInstance.delete(`/api/admin/users/${id}`);

      setUsers((prev) => prev.filter((user) => user.id !== id));
      setSuccess("User deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete user."
      );
    }
  };

  const handleToggleActive = async (user) => {
    try {
      setError("");
      setSuccess("");

      const updatedUser = {
        ...user,
        active: !user.active,
      };

      await axiosInstance.put(`/api/admin/users/${user.id}`, updatedUser);

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, active: !item.active } : item
        )
      );

      setSuccess("User status updated.");
    } catch (err) {
      console.error(err);
      setError("Unable to update user status.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
                Admin Control
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Users
              </h1>

              <p className="text-slate-300 mt-3">
                Create, view, update, activate/deactivate and delete restaurant users.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadUsers}
                className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition"
              >
                Refresh
              </button>

              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                className="bg-orange-500 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
              >
                Add User
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                {editingId ? "Update User" : "Create User"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="text-slate-500 hover:text-red-600 font-bold"
              >
                Close
              </button>
            </div>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={editingId ? "New password optional" : "Password"}
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required={!editingId}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="BILLING_STAFF">BILLING_STAFF</option>
              <option value="DELIVERY_STAFF">DELIVERY_STAFF</option>
            </select>

            <label className="flex items-center gap-3 bg-slate-100 p-3 rounded-2xl">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span className="font-semibold text-slate-700">Active User</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="md:col-span-2 bg-slate-950 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-600 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update User" : "Create User"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                User Records
              </h2>
              <p className="text-slate-500">
                Total users: {users.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Active</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-6 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-orange-50 transition"
                    >
                      <td className="p-4 font-semibold">{user.id}</td>

                      <td className="p-4">
                        {user.name || user.fullName || "N/A"}
                      </td>

                      <td className="p-4">{user.email || "N/A"}</td>

                      <td className="p-4">{user.phone || "N/A"}</td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-sm font-bold">
                          {user.role || "USER"}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            user.active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;