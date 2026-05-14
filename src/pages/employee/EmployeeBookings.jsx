import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { downloadBookingTicket, getAllBookings } from "../../api/bookingApi";

const EmployeeBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
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
      setSuccess("Booking ticket downloaded successfully.");
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

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const today = new Date().toISOString().slice(0, 10);

  const todayBookings = bookings.filter(
    (booking) => booking.bookingDate === today
  ).length;

  const checkedInBookings = bookings.filter(
    (booking) => booking.checkedIn
  ).length;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
                Reservation Desk
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Employee Bookings
              </h1>

              <p className="text-slate-300 mt-3">
                View table reservations, customer details and download booking
                tickets from one polished station.
              </p>
            </div>

            <button
              onClick={fetchBookings}
              className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Total Bookings</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Today</p>
            <h2 className="text-4xl font-black text-orange-600 mt-2">
              {todayBookings}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Checked In</p>
            <h2 className="text-4xl font-black text-emerald-600 mt-2">
              {checkedInBookings}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Pending</p>
            <h2 className="text-4xl font-black text-blue-600 mt-2">
              {bookings.length - checkedInBookings}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black text-slate-900">
              Booking Records
            </h2>
            <p className="text-slate-500">
              Total bookings: {bookings.length}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Booking Code</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Persons</th>
                  <th className="p-4 text-left">Check-In</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
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
                        {booking.customerName || "N/A"}
                      </td>

                      <td className="p-4">
                        {booking.customerEmail || "N/A"}
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
                        {booking.totalPersons || "N/A"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            booking.checkedIn
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.checkedIn ? "Checked In" : "Pending"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDownloadTicket(booking)}
                            disabled={downloadingId === booking.id}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {downloadingId === booking.id
                              ? "Downloading..."
                              : "Ticket"}
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
                    {selectedBooking.totalPersons || "N/A"}
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

              <div className="mt-6 flex justify-end gap-3">
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

export default EmployeeBookings;