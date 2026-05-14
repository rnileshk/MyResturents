import { useState } from "react";
import { createBooking } from "../../api/bookingApi";

const BookingForm = ({ onBookingCreated }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    totalPersons: 1,
    bookingDate: "",
    bookingTime: "",
    specialRequest: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalPersons" ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return "Customer name is required";
    if (!formData.customerEmail.trim()) return "Customer email is required";
    if (!formData.customerPhone.trim()) return "Customer phone is required";
    if (!formData.totalPersons || formData.totalPersons < 1) {
      return "At least 1 person is required";
    }
    if (!formData.bookingDate) return "Booking date is required";
    if (!formData.bookingTime) return "Booking time is required";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setCreatedBooking(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const booking = await createBooking(formData);

      setCreatedBooking(booking);
      setSuccess(`Booking created successfully. Code: ${booking.bookingCode}`);

      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        totalPersons: 1,
        bookingDate: "",
        bookingTime: "",
        specialRequest: "",
      });

      if (onBookingCreated) {
        onBookingCreated(booking);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Booking failed. Please login and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Book a Table</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
          {success}
        </div>
      )}

      {createdBooking && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-semibold text-green-800">Booking Confirmed</p>
          <p className="text-sm text-green-700">
            Booking Code: {createdBooking.bookingCode}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          className="w-full rounded-lg border p-3 outline-none focus:border-black"
        />

        <input
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          placeholder="Customer Email"
          className="w-full rounded-lg border p-3 outline-none focus:border-black"
        />

        <input
          type="tel"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          placeholder="Customer Phone"
          className="w-full rounded-lg border p-3 outline-none focus:border-black"
        />

        <input
          type="number"
          name="totalPersons"
          value={formData.totalPersons}
          onChange={handleChange}
          min="1"
          placeholder="Total Persons"
          className="w-full rounded-lg border p-3 outline-none focus:border-black"
        />

        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 outline-none focus:border-black"
        />

        <input
          type="time"
          name="bookingTime"
          value={formData.bookingTime}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 outline-none focus:border-black"
        />

        <textarea
          name="specialRequest"
          value={formData.specialRequest}
          onChange={handleChange}
          placeholder="Special Request"
          rows="3"
          className="w-full rounded-lg border p-3 outline-none focus:border-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          {loading ? "Booking..." : "Book Table"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;