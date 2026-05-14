import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
} from "lucide-react";

import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { createOrder } from "../../api/orderApi";
import { getCart, clearCart } from "../../utils/cartUtils";

const Checkout = () => {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [cartItems, setCartItems] = useState(getCart());

  const [formData, setFormData] = useState({
    customerName: user.name || user.fullName || "",
    customerEmail: user.email || "",
    customerPhone: user.phone || "",
    deliveryAddress: user.address || "",
    paymentMethod: "RAZORPAY",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const buildOrderPayload = () => ({
    deliveryAddress: formData.deliveryAddress,
    paymentMethod: formData.paymentMethod,
    totalAmount,
    status: "PENDING",
    deliveryStatus: "PENDING",

    items: cartItems.map((item) => ({
      name: item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      totalPrice: Number(item.price || 0) * Number(item.quantity || 1),
    })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const savedOrder = await createOrder(buildOrderPayload());

      if (!savedOrder?.id) {
        console.error("CREATE ORDER RESPONSE:", savedOrder);
        toast.error("Backend did not return order ID");
        setError("Order saved, but backend did not return order ID.");
        return;
      }

      localStorage.setItem("lastOrder", JSON.stringify(savedOrder));

      clearCart();
      setCartItems([]);

      toast.success("Order created successfully 🎉");
      setSuccess("Order created successfully.");

      navigate("/user/payment", {
        state: {
          order: savedOrder,
          amount: savedOrder.totalAmount || totalAmount,
          paymentMethod: formData.paymentMethod,
        },
      });
    } catch (err) {
      console.error("ORDER CREATE ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to place order.";

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <p className="text-orange-300 font-semibold uppercase text-sm tracking-widest">
            Secure Checkout
          </p>

          <h1 className="text-4xl md:text-5xl font-black text-white mt-3">
            Place Your Order
          </h1>

          <p className="text-slate-300 mt-4 max-w-2xl">
            Confirm delivery details and continue to Razorpay payment.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6 space-y-5"
          >
            <h2 className="text-3xl font-black text-slate-900">
              Delivery Details
            </h2>

            <label className="block space-y-2">
              <span className="font-bold text-slate-700">Customer Name</span>
              <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3">
                <User size={20} className="text-slate-400" />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="font-bold text-slate-700">Email</span>
              <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3">
                <Mail size={20} className="text-slate-400" />
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="font-bold text-slate-700">Phone</span>
              <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3">
                <Phone size={20} className="text-slate-400" />
                <input
                  type="text"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="font-bold text-slate-700">Delivery Address</span>
              <div className="flex items-start gap-3 border border-slate-300 rounded-2xl px-4 py-3">
                <MapPin size={20} className="text-slate-400 mt-1" />
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="w-full outline-none resize-none"
                  rows="4"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="font-bold text-slate-700">Payment Method</span>
              <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3">
                <CreditCard size={20} className="text-slate-400" />

                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="RAZORPAY">Razorpay</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl font-black text-lg transition disabled:opacity-60"
            >
              {loading ? "Creating Order..." : "Continue to Payment"}
            </button>
          </form>

          <div className="bg-white rounded-3xl shadow-2xl p-6 h-fit sticky top-6">
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag />
              Order Summary
            </h2>

            <div className="mt-6 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between bg-slate-100 p-3 rounded-2xl"
                >
                  <span className="font-semibold">
                    {item.name} × {item.quantity || 1}
                  </span>

                  <span className="font-bold">
                    ₹ {Number(item.price || 0) * Number(item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-5 space-y-3">
              <div className="flex justify-between">
                <span>Total Items</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="flex justify-between text-2xl">
                <span className="font-black">Total</span>
                <strong className="text-orange-600">₹ {totalAmount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;