import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  Users,
  Phone,
  Mail,
  Download,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { downloadBookingTicket, getAllBookings } from "../../api/bookingApi";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setError("");

        const data = await getAllBookings();
        const list = normalizeList(data);

        const filtered = user?.email
          ? list.filter((booking) => booking.customerEmail === user.email)
          : list;

        setBookings(filtered);
      } catch (err) {
        console.error(err);
        setError("Unable to load your bookings.");
        toast.error("Unable to load your bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.email]);

  const handleDownloadTicket = async (booking) => {
    try {
      setDownloadingId(booking.id);

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

      toast.success("Booking ticket downloaded 🎟️");
    } catch (err) {
      console.error(err);
      setError("Unable to download ticket.");
      toast.error("Unable to download ticket");
    } finally {
      setDownloadingId(null);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const upcomingBookings = bookings.filter(
    (booking) => booking.bookingDate >= today
  ).length;

  const checkedInBookings = bookings.filter(
    (booking) => booking.checkedIn
  ).length;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-orange-300 font-semibold uppercase text-sm tracking-widest">
              Reservation Lounge
            </p>

            <h1 className="text-4xl md:text-5xl font-black text-white mt-3">
              My Bookings
            </h1>

            <p className="text-slate-300 mt-4 max-w-2xl text-lg">
              View your table reservations, check booking details and download
              digital tickets instantly.
            </p>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">Total Bookings</p>
            <h2 className="text-5xl font-black text-slate-900 mt-3">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">Upcoming</p>
            <h2 className="text-5xl font-black text-orange-600 mt-3">
              {upcomingBookings}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">Checked In</p>
            <h2 className="text-5xl font-black text-emerald-600 mt-3">
              {checkedInBookings}
            </h2>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <CalendarCheck size={56} className="mx-auto text-slate-400" />

            <h2 className="text-3xl font-black text-slate-900 mt-5">
              No bookings found
            </h2>

            <p className="text-slate-500 mt-2">
              Your reservation history will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`p-5 ${
                    booking.checkedIn
                      ? "bg-emerald-600"
                      : "bg-gradient-to-r from-orange-500 to-red-500"
                  } text-white`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white/80 text-sm font-semibold uppercase">
                        Booking Code
                      </p>

                      <h2 className="text-2xl font-black mt-1">
                        {booking.bookingCode || `Booking #${booking.id}`}
                      </h2>
                    </div>

                    <span className="px-4 py-2 rounded-full bg-white/20 font-bold">
                      {booking.checkedIn ? "Checked In" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {booking.customerName || "Customer"}
                    </h3>

                    <p className="text-slate-500 mt-1">
                      {booking.specialRequest || "No special request"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-3">
                      <Mail className="text-orange-600" size={21} />
                      <span className="font-semibold text-slate-700">
                        {booking.customerEmail || "N/A"}
                      </span>
                    </div>

                    <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-3">
                      <Phone className="text-emerald-600" size={21} />
                      <span className="font-semibold text-slate-700">
                        {booking.customerPhone || "N/A"}
                      </span>
                    </div>

                    <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-3">
                      <CalendarCheck className="text-blue-600" size={21} />
                      <span className="font-semibold text-slate-700">
                        {booking.bookingDate || "N/A"}
                      </span>
                    </div>

                    <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-3">
                      <Clock className="text-purple-600" size={21} />
                      <span className="font-semibold text-slate-700">
                        {booking.bookingTime || "N/A"}
                      </span>
                    </div>

                    <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-3 md:col-span-2">
                      <Users className="text-pink-600" size={21} />
                      <span className="font-semibold text-slate-700">
                        {booking.totalPersons || 0} Persons
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <ShieldCheck size={20} />
                      Digital reservation ticket
                    </div>

                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      disabled={downloadingId === booking.id}
                      className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold transition disabled:opacity-60"
                    >
                      <Download size={20} />
                      {downloadingId === booking.id
                        ? "Downloading..."
                        : "Download Ticket"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;