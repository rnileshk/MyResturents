import { useState } from "react";
import { createBill } from "../../api/billingApi";

const BillForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    orderId: "",
    subTotal: "",
    taxAmount: "",
    discount: "",
    paymentMode: "CASH",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount =
    Number(formData.subTotal || 0) +
    Number(formData.taxAmount || 0) -
    Number(formData.discount || 0);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.customerName.trim()) {
      setError("Customer name is required");
      return;
    }

    if (!formData.subTotal || Number(formData.subTotal) <= 0) {
      setError("Subtotal must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        orderId: formData.orderId ? Number(formData.orderId) : null,
        subTotal: Number(formData.subTotal),
        taxAmount: Number(formData.taxAmount || 0),
        discount: Number(formData.discount || 0),
        totalAmount,
        paymentMode: formData.paymentMode,
        notes: formData.notes,
      };

      const savedBill = await createBill(payload);

      setFormData({
        customerName: "",
        customerPhone: "",
        orderId: "",
        subTotal: "",
        taxAmount: "",
        discount: "",
        paymentMode: "CASH",
        notes: "",
      });

      if (onSuccess) {
        onSuccess(savedBill);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create bill"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-900">Create Bill</h2>

      {error && (
        <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="text"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          placeholder="Customer Phone"
          className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="number"
          name="orderId"
          value={formData.orderId}
          onChange={handleChange}
          placeholder="Order ID optional"
          className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <select
          name="paymentMode"
          value={formData.paymentMode}
          onChange={handleChange}
          className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
          <option value="ONLINE">Online</option>
        </select>

        <input
          type="number"
          name="subTotal"
          value={formData.subTotal}
          onChange={handleChange}
          placeholder="Subtotal"
          className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="number"
          name="taxAmount"
          value={formData.taxAmount}
          onChange={handleChange}
          placeholder="Tax Amount"
          className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Discount"
          className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <div className="rounded-lg border bg-gray-50 px-4 py-3 font-bold">
          Total: ₹ {totalAmount.toFixed(2)}
        </div>
      </div>

      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes"
        rows="3"
        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading ? "Creating Bill..." : "Create Bill"}
      </button>
    </form>
  );
};

export default BillForm;