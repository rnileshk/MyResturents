import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import {
  createBooking,
  downloadBookingTicket,
  getAllBookings,
} from "../../api/bookingApi";

const emptyForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  totalPersons: 1,
  bookingDate: "",
  bookingTime: "",
  specialRequest: "",
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getAllBookings();
      setBookings(normalizeList(data));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,
        totalPersons: Number(formData.totalPersons),
      };

      await createBooking(payload);

      setSuccess("Booking created successfully.");
      resetForm();
      await fetchBookings();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create booking."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleDownloadTicket = async (booking) => {
    try {
      setDownloadingId(booking.id);
      setError("");
      setSuccess("");

      const blob = await downloadBookingTicket(booking.id);
      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `booking-${booking.bookingCode || booking.id}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setSuccess("Ticket downloaded successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to download booking ticket."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await axiosInstance.delete(`/api/bookings/${id}`);

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== id)
      );

      setSuccess("Booking deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete booking. Check if backend has DELETE /api/bookings/{id}."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleCheckInToggle = async (booking) => {
    try {
      setError("");
      setSuccess("");

      const updatedPayload = {
        ...booking,
        checkedIn: !booking.checkedIn,
      };

      const res = await axiosInstance.put(
        `/api/bookings/${booking.id}`,
        updatedPayload
      );

      const updatedBooking = res.data || updatedPayload;

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id ? updatedBooking : item
        )
      );

      setSuccess(
        updatedBooking.checkedIn
          ? "Booking marked as checked in."
          : "Booking marked as not checked in."
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update booking. Check if backend has PUT /api/bookings/{id}."
      );
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
                Reservation Control
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Bookings
              </h1>

              <p className="text-slate-300 mt-3">
                Create, view, check-in, download tickets and manage table
                reservations.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchBookings}
                className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition"
              >
                Refresh
              </button>

              <button
                onClick={() => {
                  setShowForm(true);
                  setFormData(emptyForm);
                }}
                className="bg-orange-500 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
              >
                Add Booking
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        {showForm && (
          <form
            onSubmit={handleCreateBooking}
            className="bg-white rounded-3xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">
                Create Booking
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
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Customer name"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="Customer email"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="Customer phone"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              type="number"
              name="totalPersons"
              min="1"
              value={formData.totalPersons}
              onChange={handleChange}
              placeholder="Total persons"
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              type="time"
              name="bookingTime"
              value={formData.bookingTime}
              onChange={handleChange}
              className="border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <textarea
              name="specialRequest"
              value={formData.specialRequest}
              onChange={handleChange}
              placeholder="Special request"
              rows="3"
              className="md:col-span-2 border border-slate-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="md:col-span-2 bg-slate-950 text-white px-5 py-3 rounded-2xl font-bold hover:bg-orange-600 transition disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Booking"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Booking Records
              </h2>

              <p className="text-slate-500">
                Total bookings: {bookings.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Booking Code</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Persons</th>
                  <th className="p-4 text-left">Check-In</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-6 text-center text-slate-500"
                    >
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t hover:bg-orange-50 transition"
                    >
                      <td className="p-4 font-semibold">
                        {booking.bookingCode || booking.id}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-900">
                          {booking.customerName || "N/A"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {booking.customerEmail || "N/A"}
                        </div>
                      </td>

                      <td className="p-4">
                        {booking.customerPhone || "N/A"}
                      </td>

                      <td className="p-4">
                        {booking.bookingDate || "N/A"}
                      </td>

                      <td className="p-4">
                        {booking.bookingTime || "N/A"}
                      </td>

                      <td className="p-4">
                        {booking.totalPersons || 0}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleCheckInToggle(booking)}
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            booking.checkedIn
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.checkedIn ? "Checked In" : "Pending"}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="bg-slate-900 text-white px-3 py-2 rounded-xl hover:bg-slate-800"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDownloadTicket(booking)}
                            disabled={downloadingId === booking.id}
                            className="bg-emerald-600 text-white px-3 py-2 rounded-xl hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {downloadingId === booking.id
                              ? "Downloading..."
                              : "Ticket"}
                          </button>

                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            disabled={deletingId === booking.id}
                            className="bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700 disabled:opacity-60"
                          >
                            {deletingId === booking.id
                              ? "Deleting..."
                              : "Delete"}
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

        {showViewModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedBooking(null);
                }}
                className="absolute top-4 right-5 text-2xl text-slate-500 hover:text-red-600"
              >
                ×
              </button>

              <h2 className="text-3xl font-black text-slate-900">
                Booking Details
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Booking Code</p>
                  <p className="font-bold">
                    {selectedBooking.bookingCode || selectedBooking.id}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Customer</p>
                  <p className="font-bold">
                    {selectedBooking.customerName || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="font-bold">
                    {selectedBooking.customerEmail || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Phone</p>
                  <p className="font-bold">
                    {selectedBooking.customerPhone || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Date</p>
                  <p className="font-bold">
                    {selectedBooking.bookingDate || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Time</p>
                  <p className="font-bold">
                    {selectedBooking.bookingTime || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Persons</p>
                  <p className="font-bold">
                    {selectedBooking.totalPersons || 0}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Check-In</p>
                  <p className="font-bold">
                    {selectedBooking.checkedIn ? "Checked In" : "Pending"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl md:col-span-2">
                  <p className="text-slate-500 text-sm">Special Request</p>
                  <p className="font-bold">
                    {selectedBooking.specialRequest || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleDownloadTicket(selectedBooking)}
                  className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-emerald-700"
                >
                  Download Ticket
                </button>

                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedBooking(null);
                  }}
                  className="bg-slate-200 text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;