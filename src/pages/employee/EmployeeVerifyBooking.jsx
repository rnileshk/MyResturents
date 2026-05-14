import { useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { verifyBooking } from "../../api/bookingApi";

const EmployeeVerifyBooking = () => {
  const [bookingCode, setBookingCode] = useState("");
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!bookingCode.trim()) {
      setError("Please enter booking code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setBooking(null);

      const data = await verifyBooking(bookingCode.trim().toUpperCase());

      setBooking(data);
      setSuccess("Booking verified successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid booking code or booking not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setBookingCode("");
    setBooking(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div>
            <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
              Entry Verification
            </p>

            <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
              Verify Booking
            </h1>

            <p className="text-slate-300 mt-3">
              Enter customer booking code to confirm table reservation and
              check guest details instantly.
            </p>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <form
          onSubmit={handleVerify}
          className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col lg:flex-row gap-4"
        >
          <input
            type="text"
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
            placeholder="Enter booking code, example: BOOK-ABC123"
            className="border border-slate-300 p-4 rounded-2xl flex-1 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Booking"}
          </button>

          <button
            type="button"
            onClick={clearResult}
            className="bg-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-300 transition"
          >
            Clear
          </button>
        </form>

        {booking && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div
              className={`p-6 ${
                booking.checkedIn
                  ? "bg-emerald-600"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              } text-white`}
            >
              <p className="uppercase text-sm font-bold tracking-wider opacity-90">
                Verification Result
              </p>

              <h2 className="text-3xl font-black mt-2">
                {booking.checkedIn
                  ? "Already Checked In"
                  : "Valid Booking Found"}
              </h2>

              <p className="mt-2 opacity-90">
                Booking Code: {booking.bookingCode || bookingCode}
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Booking Code</p>
                <p className="font-bold text-slate-900">
                  {booking.bookingCode || bookingCode}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Customer</p>
                <p className="font-bold text-slate-900">
                  {booking.customerName || "N/A"}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Email</p>
                <p className="font-bold text-slate-900">
                  {booking.customerEmail || "N/A"}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Phone</p>
                <p className="font-bold text-slate-900">
                  {booking.customerPhone || "N/A"}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Date</p>
                <p className="font-bold text-slate-900">
                  {booking.bookingDate || "N/A"}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Time</p>
                <p className="font-bold text-slate-900">
                  {booking.bookingTime || "N/A"}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Total Persons</p>
                <p className="font-bold text-slate-900">
                  {booking.totalPersons || "N/A"}
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl">
                <p className="text-slate-500 text-sm">Check-In Status</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold ${
                    booking.checkedIn
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.checkedIn ? "Checked In" : "Pending"}
                </span>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl md:col-span-2">
                <p className="text-slate-500 text-sm">Special Request</p>
                <p className="font-bold text-slate-900">
                  {booking.specialRequest || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeVerifyBooking;