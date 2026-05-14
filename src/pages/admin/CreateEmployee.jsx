import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post("/api/auth/create-employee", formData);
      setSuccess("Employee created successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "EMPLOYEE",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Create Employee</h1>
      <p className="text-gray-600 mb-5">Create staff account.</p>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 mt-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border p-3 rounded" required />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border p-3 rounded" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-3 rounded" />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full border p-3 rounded" required />

        <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-3 rounded">
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="DELIVERY_STAFF">DELIVERY_STAFF</option>
          <option value="BILLING_STAFF">BILLING_STAFF</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button disabled={loading} className="bg-black text-white px-5 py-3 rounded w-full disabled:opacity-60">
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;