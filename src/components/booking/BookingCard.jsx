import { useState } from "react";
import {
  checkInBookingById,
  deleteBooking,
} from "../../api/bookingApi";
import BookingTicketButton from "./BookingTicketButton";

const BookingCard = ({ booking, onUpdated, onDeleted, showActions = true }) => {
  const [loading, setLoading] = useState(false);
  const [localBooking, setLocalBooking] = useState(booking);
  const [error, setError] = useState("");

  const handleCheckIn = async () => {
    if (!localBooking?.id) return;

    try {
      setLoading(true);
      setError("");

      const updatedBooking = await checkInBookingById(localBooking.id);

      setLocalBooking(updatedBooking);

      if (onUpdated) {
        onUpdated(updatedBooking);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Check-in failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!localBooking?.id) return;

    const confirmDelete = window.confirm(
      `Delete booking ${localBooking.bookingCode}?`
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");

      await deleteBooking(localBooking.id);

      if (onDeleted) {
        onDeleted(localBooking.id);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Delete failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!localBooking) return null;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-md">
      {error && (
        <div className="mb-3 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {localBooking.customerName}
          </h3>

          <p className="text-sm text-gray-500">
            Code:{" "}
            <span className="font-semibold text-gray-800">
              {localBooking.bookingCode}
            </span>
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            localBooking.checkedIn
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {localBooking.checkedIn ? "Checked In" : "Pending"}
        </span>
      </div>

      <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {localBooking.customerEmail}
        </p>

        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {localBooking.customerPhone}
        </p>

        <p>
          <span className="font-semibold">Persons:</span>{" "}
          {localBooking.totalPersons}
        </p>

        <p>
          <span className="font-semibold">Date:</span>{" "}
          {localBooking.bookingDate}
        </p>

        <p>
          <span className="font-semibold">Time:</span>{" "}
          {localBooking.bookingTime}
        </p>

        <p>
          <span className="font-semibold">Created:</span>{" "}
          {localBooking.createdAt
            ? new Date(localBooking.createdAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {localBooking.specialRequest && (
        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          <span className="font-semibold">Special Request:</span>{" "}
          {localBooking.specialRequest}
        </p>
      )}

      {localBooking.qrCode && (
        <div className="mt-4">
          <img
            src={localBooking.qrCode}
            alt="Booking QR Code"
            className="h-32 w-32 rounded-lg border object-cover"
          />
        </div>
      )}

      {showActions && (
        <div className="mt-5 flex flex-wrap gap-3">
          <BookingTicketButton bookingId={localBooking.id} />

          {!localBooking.checkedIn && (
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Check In"}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;