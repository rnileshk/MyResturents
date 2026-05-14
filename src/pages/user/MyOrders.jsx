import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Truck,
  CreditCard,
  MapPin,
  CalendarDays,
  PackageCheck,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllOrders, getMyOrders } from "../../api/orderApi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.orders)) return data.orders;
    return [];
  };

  const getStatus = (order) => order.status || order.orderStatus || "PENDING";

  const getAmount = (order) =>
    order.totalAmount ?? order.amount ?? order.grandTotal ?? 0;

  const getDate = (order) =>
    order.createdAt || order.orderDate || "Order date not available";

  const getDeliveryStatus = (order) =>
    order.deliveryStatus || order.delivery?.status || "N/A";

  const getAddress = (order) =>
    order.deliveryAddress || order.address || "N/A";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");

        let data;

        try {
          data = await getMyOrders();
        } catch (err) {
          console.error("GET MY ORDERS FAILED:", err);
          data = await getAllOrders();
        }

        setOrders(normalizeList(data));
      } catch (err) {
        console.error("ORDER LOAD ERROR:", err);

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load your orders.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = orders.filter(
    (order) => getStatus(order) !== "COMPLETED"
  ).length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(getAmount(order) || 0),
    0
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <p className="text-orange-300 font-semibold uppercase text-sm tracking-widest">
            Order Lounge
          </p>

          <h1 className="text-4xl md:text-5xl font-black text-white mt-3">
            My Orders
          </h1>

          <p className="text-slate-300 mt-4">
            Track your food orders and payment history.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">Total Orders</p>
            <h2 className="text-5xl font-black mt-3">{orders.length}</h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">Active Orders</p>
            <h2 className="text-5xl font-black text-orange-600 mt-3">
              {activeOrders}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <p className="text-slate-500 font-semibold">Total Spent</p>
            <h2 className="text-5xl font-black text-emerald-600 mt-3">
              ₹ {totalSpent}
            </h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <ShoppingBag size={56} className="mx-auto text-slate-400" />

            <h2 className="text-3xl font-black mt-5">No orders found</h2>

            <p className="text-slate-500 mt-2">
              Your food order history will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <p className="text-slate-400 uppercase text-sm font-bold">
                      Order Code
                    </p>

                    <h2 className="text-3xl font-black text-slate-900 mt-1">
                      {order.orderCode || `Order #${order.id}`}
                    </h2>

                    <div className="flex items-center gap-2 text-slate-500 mt-2">
                      <CalendarDays size={18} />
                      <span>{getDate(order)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={getStatus(order)} />

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowViewModal(true);
                      }}
                      className="flex items-center gap-2 bg-slate-950 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold"
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 pb-6">
                  <div className="bg-slate-100 rounded-2xl p-4">
                    <CreditCard size={18} />
                    <p className="font-black mt-2">
                      {order.paymentMethod || "N/A"}
                    </p>
                  </div>

                  <div className="bg-slate-100 rounded-2xl p-4">
                    <Truck size={18} />
                    <p className="font-black mt-2">
                      {getDeliveryStatus(order)}
                    </p>
                  </div>

                  <div className="bg-slate-100 rounded-2xl p-4">
                    <MapPin size={18} />
                    <p className="font-black mt-2 line-clamp-1">
                      {getAddress(order)}
                    </p>
                  </div>

                  <div className="bg-slate-100 rounded-2xl p-4">
                    <PackageCheck size={18} />
                    <p className="font-black text-orange-600 text-2xl mt-1">
                      ₹ {getAmount(order)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showViewModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 relative">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedOrder(null);
                }}
                className="absolute top-4 right-5 text-2xl"
              >
                ×
              </button>

              <h2 className="text-3xl font-black">Order Details</h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Order Code</p>
                  <p className="font-bold">
                    {selectedOrder.orderCode || selectedOrder.id}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Status</p>
                  <p className="font-bold">{getStatus(selectedOrder)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Amount</p>
                  <p className="font-bold">₹ {getAmount(selectedOrder)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Payment</p>
                  <p className="font-bold">
                    {selectedOrder.paymentMethod || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl md:col-span-2">
                  <p className="text-slate-500 text-sm">Address</p>
                  <p className="font-bold">{getAddress(selectedOrder)}</p>
                </div>
              </div>

              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-black mb-3">Items</h3>

                    <div className="bg-slate-100 rounded-2xl overflow-hidden">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex justify-between p-4 border-b last:border-b-0"
                        >
                          <span className="font-semibold">
                            {item.menuItem?.name || item.name || "Item"} ×{" "}
                            {item.quantity || 1}
                          </span>

                          <span className="font-bold">
                            ₹ {item.totalPrice || item.price || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;