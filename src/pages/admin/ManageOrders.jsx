import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../api/orderApi";

const ORDER_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.orders)) return data.orders;
    if (Array.isArray(data?.foodOrders)) return data.foodOrders;
    return [];
  };

  const getStatus = (order) => order.status || order.orderStatus || "PENDING";

  const getPaymentStatus = (order) =>
    order.payment?.paymentStatus ||
    order.paymentStatus ||
    order.payment?.status ||
    "PENDING";

  const isPaidOrder = (order) => {
    const status = getStatus(order);
    const paymentStatus = getPaymentStatus(order);

    return status === "COMPLETED" || paymentStatus === "SUCCESS";
  };

  const getCustomer = (order) =>
    order.user?.name ||
    order.user?.fullName ||
    order.customerName ||
    order.customerEmail ||
    order.user?.email ||
    "N/A";

  const getAmount = (order) =>
    Number(order.totalAmount ?? order.amount ?? order.grandTotal ?? 0);

  const revenue = useMemo(() => {
    return orders
      .filter(isPaidOrder)
      .reduce((total, order) => total + getAmount(order), 0);
  }, [orders]);

  const pendingCount = useMemo(
    () => orders.filter((order) => getStatus(order) === "PENDING").length,
    [orders]
  );

  const completedCount = useMemo(
    () => orders.filter((order) => getStatus(order) === "COMPLETED").length,
    [orders]
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getAllOrders();
      setOrders(normalizeList(data));
    } catch (err) {
      console.error("Order load error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      const updatedOrder = await updateOrderStatus(id, status);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? {
                ...order,
                ...updatedOrder,
                status,
                orderStatus: status,
              }
            : order
        )
      );

      setSuccess("Order status updated successfully.");
    } catch (err) {
      console.error("Order update error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteOrder(id);

      setOrders((prev) => prev.filter((order) => order.id !== id));

      setSuccess("Order deleted successfully.");
    } catch (err) {
      console.error("Order delete error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete order."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
                Order Command
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Orders
              </h1>

              <p className="text-slate-300 mt-3">
                Track customer orders, payment modes, delivery state and kitchen
                progress.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Total Orders</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {orders.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Pending</p>
            <h2 className="text-4xl font-black text-orange-600 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Completed</p>
            <h2 className="text-4xl font-black text-emerald-600 mt-2">
              {completedCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Revenue</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              ₹ {revenue}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black text-slate-900">
              Order Records
            </h2>
            <p className="text-slate-500">Total orders: {orders.length}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Order Code</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Pay Status</th>
                  <th className="p-4 text-left">Delivery</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Update</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const currentStatus = getStatus(order);

                    return (
                      <tr
                        key={order.id}
                        className="border-t hover:bg-orange-50 transition"
                      >
                        <td className="p-4 font-semibold">
                          {order.orderCode || order.id}
                        </td>

                        <td className="p-4">{getCustomer(order)}</td>

                        <td className="p-4 font-bold">₹ {getAmount(order)}</td>

                        <td className="p-4">{order.paymentMethod || "N/A"}</td>

                        <td className="p-4">
                          <StatusBadge status={getPaymentStatus(order)} />
                        </td>

                        <td className="p-4">
                          {order.deliveryStatus ||
                            order.delivery?.status ||
                            "N/A"}
                        </td>

                        <td className="p-4">
                          <StatusBadge status={currentStatus} />
                        </td>

                        <td className="p-4">
                          <select
                            value={currentStatus}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="border border-slate-300 p-2 rounded-xl disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800"
                            >
                              View
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={deletingId === order.id}
                              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-60"
                            >
                              {deletingId === order.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showViewModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 relative">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedOrder(null);
                }}
                className="absolute top-4 right-5 text-2xl text-slate-500 hover:text-red-600"
              >
                ×
              </button>

              <h2 className="text-3xl font-black text-slate-900">
                Order Details
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Order Code</p>
                  <p className="font-bold">
                    {selectedOrder.orderCode || selectedOrder.id}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Customer</p>
                  <p className="font-bold">{getCustomer(selectedOrder)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Total Amount</p>
                  <p className="font-bold">₹ {getAmount(selectedOrder)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Payment Method</p>
                  <p className="font-bold">
                    {selectedOrder.paymentMethod || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Payment Status</p>
                  <p className="font-bold">{getPaymentStatus(selectedOrder)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Order Status</p>
                  <p className="font-bold">{getStatus(selectedOrder)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Delivery Status</p>
                  <p className="font-bold">
                    {selectedOrder.deliveryStatus ||
                      selectedOrder.delivery?.status ||
                      "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl md:col-span-2">
                  <p className="text-slate-500 text-sm">Delivery Address</p>
                  <p className="font-bold">
                    {selectedOrder.deliveryAddress || "N/A"}
                  </p>
                </div>
              </div>

              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-black text-slate-900 mb-3">
                      Items
                    </h3>

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

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedOrder(null);
                  }}
                  className="bg-slate-200 text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;