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
  role: "EMPLOYEE",
  active: true,
};

const EMPLOYEE_ROLES = ["EMPLOYEE", "BILLING_STAFF", "DELIVERY_STAFF"];

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
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

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("/api/employee/all");
      setEmployees(normalizeList(res.data));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setShowForm(true);

    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      password: "",
      role: employee.role || "EMPLOYEE",
      active: employee.active ?? true,
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
        await axiosInstance.put(`/api/employee/${editingId}`, payload);
        setSuccess("Employee updated successfully.");
      } else {
        await axiosInstance.post("/api/auth/create-employee", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        });
        setSuccess("Employee created successfully.");
      }

      resetForm();
      await loadEmployees();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save employee."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      setError("");
      setSuccess("");

      await axiosInstance.delete(`/api/employee/${id}`);

      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== id)
      );

      setSuccess("Employee deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete employee."
      );
    }
  };

  const handleToggleActive = async (employee) => {
    try {
      setError("");
      setSuccess("");

      const updatedEmployee = {
        ...employee,
        active: !employee.active,
      };

      await axiosInstance.put(`/api/employee/${employee.id}`, updatedEmployee);

      setEmployees((prev) =>
        prev.map((item) =>
          item.id === employee.id
            ? { ...item, active: !item.active }
            : item
        )
      );

      setSuccess("Employee status updated.");
    } catch (err) {
      console.error(err);
      setError("Unable to update employee status.");
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
                Staff Control
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Employees
              </h1>

              <p className="text-slate-300 mt-3">
                Create, view, update, activate/deactivate and delete restaurant staff accounts.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadEmployees}
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
                Add Employee
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
                {editingId ? "Update Employee" : "Create Employee"}
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
              placeholder="Employee name"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Employee email"
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
              {EMPLOYEE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-3 bg-slate-100 p-3 rounded-2xl">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span className="font-semibold text-slate-700">
                Active Employee
              </span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="md:col-span-2 bg-slate-950 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-600 transition disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Employee"
                : "Create Employee"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Employee Records
              </h2>

              <p className="text-slate-500">
                Total employees: {employees.length}
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
                {employees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-6 text-center text-slate-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-t hover:bg-orange-50 transition"
                    >
                      <td className="p-4 font-semibold">{employee.id}</td>

                      <td className="p-4">
                        {employee.name || employee.fullName || "N/A"}
                      </td>

                      <td className="p-4">{employee.email || "N/A"}</td>

                      <td className="p-4">{employee.phone || "N/A"}</td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-sm font-bold">
                          {employee.role || "EMPLOYEE"}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(employee)}
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            employee.active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {employee.active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(employee.id)}
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

export default ManageEmployees;