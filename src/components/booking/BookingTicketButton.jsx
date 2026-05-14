import { useState } from "react";
import { downloadBookingTicket } from "../../api/bookingApi";

const BookingTicketButton = ({ bookingId, fileName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!bookingId) {
      setError("Booking ID is missing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const blob = await downloadBookingTicket(bookingId);

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `booking-ticket-${bookingId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Ticket download failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="rounded-lg bg-black px-4 py-2 font-semibold text-white disabled:bg-gray-500"
      >
        {loading ? "Downloading..." : "Download Ticket"}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default BookingTicketButton;