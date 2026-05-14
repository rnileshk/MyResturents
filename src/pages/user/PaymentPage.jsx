import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  CreditCard,
  Receipt,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../api/razorpayApi";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const savedOrder = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lastOrder") || "null");
    } catch {
      return null;
    }
  }, []);

  const order = location.state?.order || savedOrder;
  const amount =
    location.state?.amount ||
    order?.totalAmount ||
    order?.amount ||
    0;

  const paymentMethod =
    location.state?.paymentMethod ||
    order?.paymentMethod ||
    "RAZORPAY";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCashPayment = () => {
    toast.success("Order placed with cash payment");
    navigate("/user/orders", { replace: true });
  };

  const handleRazorpayPayment = async () => {
    if (!order?.id) {
      toast.error("Order ID missing");
      setError("Order ID missing. Please place order again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const razorpayOrder = await createRazorpayOrder({
        orderId: order.id,
        amount,
      });

      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Restaurant App",
        description: `Payment for ${order.orderCode || "Order"}`,
        order_id: razorpayOrder.razorpayOrderId,

        handler: async function (response) {
          try {
            await verifyRazorpayPayment({
              orderId: order.id,
              amount,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success("Payment successful 🎉");
            setSuccess("Payment successful.");

            navigate("/user/orders", { replace: true });
          } catch (err) {
            console.error("VERIFY PAYMENT ERROR:", err);

            const message =
              err.response?.data?.message ||
              err.response?.data?.error ||
              "Payment verification failed.";

            toast.error(message);
            setError(message);
          }
        },

        prefill: {
          name: order.user?.name || "",
          email: order.user?.email || "",
          contact: order.user?.phone || "",
        },

        theme: {
          color: "#ea580c",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        toast.error("Payment failed");
        setError("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err) {
      console.error("RAZORPAY ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to start Razorpay payment.";

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <Receipt size={56} className="mx-auto text-slate-400" />
          <h1 className="text-3xl font-black mt-4">No Order Found</h1>
          <p className="text-slate-500 mt-2">
            Please place an order before payment.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="mt-6 bg-slate-950 text-white px-6 py-3 rounded-2xl font-bold"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <p className="text-orange-300 font-semibold uppercase text-sm tracking-widest">
            Secure Payment
          </p>

          <h1 className="text-4xl md:text-5xl font-black text-white mt-3">
            Complete Payment
          </h1>

          <p className="text-slate-300 mt-4">
            Pay securely using Razorpay.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6 space-y-5">
            <h2 className="text-3xl font-black text-slate-900">
              Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-slate-500 text-sm">Order</p>
                <p className="font-black">{order.orderCode || `#${order.id}`}</p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-slate-500 text-sm">Amount</p>
                <p className="font-black text-orange-600">₹ {amount}</p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-slate-500 text-sm">Method</p>
                <p className="font-black">{paymentMethod}</p>
              </div>
            </div>

            {paymentMethod === "CASH" ? (
              <button
                onClick={handleCashPayment}
                className="w-full bg-slate-950 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl font-black text-lg transition"
              >
                Confirm Cash Order
              </button>
            ) : (
              <button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-slate-950 hover:bg-orange-600 text-white px-5 py-4 rounded-2xl font-black text-lg transition disabled:opacity-60"
              >
                <CreditCard size={22} />
                {loading ? "Starting Razorpay..." : "Pay with Razorpay"}
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 h-fit">
            <div className="h-16 w-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white">
              <ShieldCheck size={34} />
            </div>

            <h2 className="text-3xl font-black mt-5">Summary</h2>

            <div className="border-y my-6 py-5 space-y-3">
              <div className="flex justify-between">
                <span>Order</span>
                <strong>{order.orderCode || `#${order.id}`}</strong>
              </div>

              <div className="flex justify-between">
                <span>Method</span>
                <strong>{paymentMethod}</strong>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Payable</span>
              <span className="text-4xl font-black text-orange-600">
                ₹ {amount}
              </span>
            </div>

            <button
              onClick={() => navigate("/user/orders")}
              className="w-full mt-6 flex items-center justify-center gap-2 border border-slate-300 hover:border-orange-500 hover:text-orange-600 px-5 py-3 rounded-2xl font-bold transition"
            >
              View Orders
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;