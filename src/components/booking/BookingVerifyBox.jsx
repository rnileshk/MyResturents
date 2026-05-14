import { useState } from "react";
import {
  verifyBooking,
  checkInBookingByCode,
} from "../../api/bookingApi";
import BookingTicketButton from "./BookingTicketButton";

const BookingVerifyBox = ({ initialBookingCode = "" }) => {
  const [bookingCode, setBookingCode] = useState(initialBookingCode);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    if (e) e.preventDefault();

    if (!bookingCode.trim()) {
      setError("Booking code is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);

      const data = await verifyBooking(bookingCode.trim());

      setBooking(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Booking not found"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking?.bookingCode) return;

    try {
      setCheckInLoading(true);
      setError("");

      const updatedBooking = await checkInBookingByCode(booking.bookingCode);

      setBooking(updatedBooking);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Check-in failed"
      );
    } finally {
      setCheckInLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Verify Booking
      </h2>

      <form onSubmit={handleVerify} className="mb-5 flex gap-3">
        <input
          type="text"
          value={bookingCode}
          onChange={(e) => setBookingCode(e.target.value)}
          placeholder="Enter booking code, example BOOK-ABC123"
          className="flex-1 rounded-lg border p-3 outline-none focus:border-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-5 py-3 font-semibold text-white disabled:bg-gray-500"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {booking && (
        <div className="rounded-xl border p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">{booking.customerName}</h3>
              <p className="text-sm text-gray-500">{booking.bookingCode}</p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                booking.checkedIn
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.checkedIn ? "Checked In" : "Not Checked In"}
            </span>
          </div>

          <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {booking.customerEmail}
            </p>

            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {booking.customerPhone}
            </p>

            <p>
              <span className="font-semibold">Persons:</span>{" "}
              {booking.totalPersons}
            </p>

            <p>
              <span className="font-semibold">Date:</span>{" "}
              {booking.bookingDate}
            </p>

            <p>
              <span className="font-semibold">Time:</span>{" "}
              {booking.bookingTime}
            </p>
          </div>

          {booking.specialRequest && (
            <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
              <span className="font-semibold">Special Request:</span>{" "}
              {booking.specialRequest}
            </p>
          )}

          {booking.qrCode && (
            <img
              src={booking.qrCode}
              alt="Booking QR Code"
              className="mt-4 h-32 w-32 rounded-lg border object-cover"
            />
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <BookingTicketButton bookingId={booking.id} />

            {!booking.checkedIn && (
              <button
                onClick={handleCheckIn}
                disabled={checkInLoading}
                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
              >
                {checkInLoading ? "Checking In..." : "Check In"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingVerifyBox;