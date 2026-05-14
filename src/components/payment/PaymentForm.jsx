import { useState } from "react";
import { createPayment } from "../../api/paymentApi";

const PaymentForm = ({ orderId, amount, onSuccess }) => {
  const [formData, setFormData] = useState({
    orderId: orderId || "",
    amount: amount || "",
    paymentMethod: "CASH",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const paymentData = {
        ...formData,
        orderId: Number(formData.orderId),
        amount: Number(formData.amount),
      };

      const result = await createPayment(paymentData);

      alert("Payment created successfully");

      if (onSuccess) {
        onSuccess(result);
      }

      setFormData({
        orderId: orderId || "",
        amount: amount || "",
        paymentMethod: "CASH",
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-5">Create Payment</h2>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Order ID</label>
          <input
            type="number"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
            placeholder="Enter order ID"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Create Payment"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;