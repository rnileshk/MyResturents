import {
  CalendarCheck,
  Clock3,
  Sparkles,
  ShieldCheck,
  Users,
} from "lucide-react";

import BookingForm from "../../components/booking/BookingForm";

const BookTable = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-10 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-8 md:p-12">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-orange-300 font-semibold uppercase tracking-[4px] text-sm">
                Premium Dining Experience
              </p>

              <h1 className="text-5xl md:text-6xl font-black text-white mt-5 leading-tight">
                Reserve
                <br />
                Your Table 🍽️
              </h1>

              <p className="text-slate-300 mt-6 text-lg leading-relaxed max-w-2xl">
                Book your favorite dining spot in seconds.
                Experience elegant ambience, delicious cuisine
                and seamless reservation management.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5">
                  <Clock3 className="text-orange-400" size={28} />

                  <h3 className="text-white font-black mt-3">
                    Instant Booking
                  </h3>

                  <p className="text-slate-300 text-sm mt-1">
                    Reserve tables instantly without waiting.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5">
                  <Users className="text-blue-400" size={28} />

                  <h3 className="text-white font-black mt-3">
                    Group Dining
                  </h3>

                  <p className="text-slate-300 text-sm mt-1">
                    Perfect for couples, family and events.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5">
                  <ShieldCheck
                    className="text-emerald-400"
                    size={28}
                  />

                  <h3 className="text-white font-black mt-3">
                    Secure Access
                  </h3>

                  <p className="text-slate-300 text-sm mt-1">
                    Safe and verified reservation system.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />

                <div className="relative bg-gradient-to-br from-orange-500 to-red-600 p-10 rounded-[40px] shadow-2xl">
                  <CalendarCheck
                    size={180}
                    className="text-white"
                  />

                  <div className="absolute -top-4 -right-4 bg-white text-slate-900 rounded-2xl px-4 py-2 font-black shadow-xl flex items-center gap-2">
                    <Sparkles size={18} />
                    VIP Booking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="absolute top-0 right-0 h-52 w-52 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="relative p-6 md:p-10">
            <div className="mb-8">
              <p className="text-orange-600 font-semibold uppercase tracking-[3px] text-sm">
                Reservation Form
              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-3">
                Book Your Experience
              </h2>

              <p className="text-slate-500 mt-3 text-lg">
                Fill your details below and receive instant confirmation for
                your reservation.
              </p>
            </div>

            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTable;