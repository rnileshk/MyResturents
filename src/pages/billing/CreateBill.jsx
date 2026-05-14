import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";

const CreateBill = () => {
  const [billType, setBillType] = useState("manual");
  const [orderId, setOrderId] = useState("");
  const [bookingId, setBookingId] = useState("");

  const [formData, setFormData] = useState({
    subtotal: "",
    tax: "",
    deliveryCharge: "",
    paymentStatus: "PENDING",
  });

  const [createdBill, setCreatedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createManualBill = async () => {
    const payload = {
      subtotal: Number(formData.subtotal || 0),
      tax: Number(formData.tax || 0),
      deliveryCharge: Number(formData.deliveryCharge || 0),
      paymentStatus: formData.paymentStatus,
    };

    const response = await axiosInstance.post("/api/billing", payload);
    return response.data;
  };

  const createOrderBill = async () => {
    const response = await axiosInstance.post(`/api/billing/order/${orderId}`);
    return response.data;
  };

  const createBookingBill = async () => {
    const response = await axiosInstance.post(
      `/api/billing/booking/${bookingId}`
    );
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setCreatedBill(null);

      let data;

      if (billType === "manual") {
        data = await createManualBill();
      }

      if (billType === "order") {
        if (!orderId) {
          setError("Please enter order ID.");
          setLoading(false);
          return;
        }

        data = await createOrderBill();
      }

      if (billType === "booking") {
        if (!bookingId) {
          setError("Please enter booking ID.");
          setLoading(false);
          return;
        }

        data = await createBookingBill();
      }

      setCreatedBill(data);
      setSuccess("Bill created successfully.");

      setOrderId("");
      setBookingId("");
      setFormData({
        subtotal: "",
        tax: "",
        deliveryCharge: "",
        paymentStatus: "PENDING",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to create bill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Create Bill</h1>
        <p className="text-gray-600 mt-1">
          Generate manual bills, order bills, or booking bills.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div>
          <label className="block font-medium mb-2">Bill Type</label>
          <select
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="manual">Manual Bill</option>
            <option value="order">Create From Order ID</option>
            <option value="booking">Create From Booking ID</option>
          </select>
        </div>

        {billType === "manual" && (
          <>
            <input
              type="number"
              name="subtotal"
              value={formData.subtotal}
              onChange={handleChange}
              placeholder="Subtotal"
              className="w-full border p-3 rounded"
              min="0"
              step="0.01"
              required
            />

            <input
              type="number"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              placeholder="Tax"
              className="w-full border p-3 rounded"
              min="0"
              step="0.01"
            />

            <input
              type="number"
              name="deliveryCharge"
              value={formData.deliveryCharge}
              onChange={handleChange}
              placeholder="Delivery Charge"
              className="w-full border p-3 rounded"
              min="0"
              step="0.01"
            />

            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            >
              <option value="PENDING">PENDING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </>
        )}

        {billType === "order" && (
          <input
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID"
            className="w-full border p-3 rounded"
            min="1"
            required
          />
        )}

        {billType === "booking" && (
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Enter Booking ID"
            className="w-full border p-3 rounded"
            min="1"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded w-full disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Bill"}
        </button>
      </form>

      {createdBill && (
        <div className="bg-white p-6 rounded-lg shadow space-y-2">
          <h2 className="text-xl font-bold">Generated Bill</h2>
          <p>Bill ID: {createdBill.id}</p>
          <p>Subtotal: ₹ {createdBill.subtotal ?? 0}</p>
          <p>Tax: ₹ {createdBill.tax ?? 0}</p>
          <p>Delivery Charge: ₹ {createdBill.deliveryCharge ?? 0}</p>
          <p className="font-bold">
            Total Amount: ₹ {createdBill.totalAmount ?? 0}
          </p>
          <p>Payment Status: {createdBill.paymentStatus || "PENDING"}</p>
        </div>
      )}
    </div>
  );
};

export default CreateBill;