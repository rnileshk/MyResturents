import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  ShoppingBag,
  Truck,
  Star,
  Clock,
  ShieldCheck,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      title: "Table Booking",
      description: "Reserve your table quickly and get booking confirmation.",
      icon: CalendarCheck,
    },
    {
      title: "Online Orders",
      description: "Browse menu items, add food to cart and place orders.",
      icon: ShoppingBag,
    },
    {
      title: "Delivery Tracking",
      description: "Track your order status from kitchen to delivery.",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-orange-700">
            <Star size={16} className="fill-orange-500 text-orange-500" />
            Premium Restaurant Management System
          </div>

          <h1 className="mt-6 text-5xl lg:text-7xl font-black text-gray-950 leading-tight">
            Delicious Food,
            <span className="block text-orange-600">
              Smart Dining.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed">
            Book tables, explore menu items, place food orders, make payments,
            and track delivery with a smooth digital restaurant experience.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="bg-gray-950 text-white px-7 py-4 rounded-2xl font-bold hover:bg-orange-600 transition flex items-center gap-2"
            >
              Explore Menu
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/book-table"
              className="bg-white text-gray-950 px-7 py-4 rounded-2xl font-bold shadow hover:shadow-lg transition"
            >
              Book Table
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-3xl font-black text-gray-950">150+</h3>
              <p className="text-gray-500 text-sm">Menu Items</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-3xl font-black text-gray-950">24/7</h3>
              <p className="text-gray-500 text-sm">Order System</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-3xl font-black text-gray-950">Fast</h3>
              <p className="text-gray-500 text-sm">Delivery</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-[2rem] shadow-2xl p-4">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
              alt="Restaurant dining"
              className="w-full h-[460px] object-cover rounded-[1.5rem]"
            />
          </div>

          <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-3xl shadow-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-950">
                Fresh. Fast. Smart.
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Your complete restaurant platform.
              </p>
            </div>

            <div className="bg-orange-600 text-white h-14 w-14 rounded-2xl flex items-center justify-center text-2xl">
              🍽️
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-white p-7 rounded-3xl shadow-sm hover:shadow-xl transition"
              >
                <div className="h-14 w-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Icon size={28} />
                </div>

                <h3 className="text-2xl font-black text-gray-950 mt-6">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 bg-gray-950 rounded-[2rem] p-8 md:p-12 text-white grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <Clock className="text-orange-400" size={32} />
            <div>
              <h3 className="font-black text-xl">Quick Service</h3>
              <p className="text-gray-400 mt-1">
                Smooth ordering and fast processing.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <ShieldCheck className="text-green-400" size={32} />
            <div>
              <h3 className="font-black text-xl">Secure Payments</h3>
              <p className="text-gray-400 mt-1">
                Safe checkout and payment records.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Truck className="text-blue-400" size={32} />
            <div>
              <h3 className="font-black text-xl">Live Tracking</h3>
              <p className="text-gray-400 mt-1">
                Know your delivery status anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;