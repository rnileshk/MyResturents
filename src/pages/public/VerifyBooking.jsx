import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyBooking } from "../../api/bookingApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";

const VerifyBooking = () => {
  const { bookingCode } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await verifyBooking(bookingCode);
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError("Invalid booking code or booking not found.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingCode) {
      checkBooking();
    } else {
      setError("Booking code is missing.");
      setLoading(false);
    }
  }, [bookingCode]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-[80vh] bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Booking Verification</h1>

        {error && <ErrorMessage message={error} />}

        {booking && (
          <div className="space-y-4">
            <SuccessMessage message="Booking verified successfully." />

            <div className="border rounded-lg p-5 space-y-2">
              <p>
                <strong>Booking Code:</strong>{" "}
                {booking.bookingCode || bookingCode}
              </p>

              <p>
                <strong>Name:</strong> {booking.customerName || "N/A"}
              </p>

              <p>
                <strong>Email:</strong> {booking.customerEmail || "N/A"}
              </p>

              <p>
                <strong>Phone:</strong> {booking.customerPhone || "N/A"}
              </p>

              <p>
                <strong>Date:</strong> {booking.bookingDate || "N/A"}
              </p>

              <p>
                <strong>Time:</strong> {booking.bookingTime || "N/A"}
              </p>

              <p>
                <strong>Total Persons:</strong>{" "}
                {booking.totalPersons || "N/A"}
              </p>

              <p>
                <strong>Checked In:</strong>{" "}
                {booking.checkedIn ? "Yes" : "No"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyBooking;