import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getAllDeliveries,
  updateDeliveryStatus,
} from "../../api/deliveryApi";

const DELIVERY_STATUSES = [
  "ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const ManageDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const getOrderCode = (delivery) => {
    return (
      delivery.order?.orderCode ||
      delivery.foodOrder?.orderCode ||
      delivery.orderId ||
      "N/A"
    );
  };

  const getDeliveryBoy = (delivery) => {
    return (
      delivery.deliveryBoy?.name ||
      delivery.deliveryBoy?.email ||
      delivery.deliveryAgent?.name ||
      "Not Assigned"
    );
  };

  const getCustomer = (delivery) => {
    return (
      delivery.order?.user?.name ||
      delivery.foodOrder?.user?.name ||
      delivery.customerName ||
      "N/A"
    );
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getAllDeliveries();
      setDeliveries(normalizeList(data));
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load deliveries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      await updateDeliveryStatus(id, status);

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === id
            ? { ...delivery, status }
            : delivery
        )
      );

      setSuccess("Delivery status updated successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update delivery."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  const deliveredCount = deliveries.filter(
    (delivery) => delivery.status === "DELIVERED"
  ).length;

  const pendingCount = deliveries.filter(
    (delivery) => delivery.status !== "DELIVERED"
  ).length;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
                Delivery Command
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Deliveries
              </h1>

              <p className="text-slate-300 mt-3">
                Track delivery movement, delivery staff and live order transportation status.
              </p>
            </div>

            <button
              onClick={fetchDeliveries}
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
            <p className="text-slate-500 font-semibold">Total Deliveries</p>

            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {deliveries.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Delivered</p>

            <h2 className="text-4xl font-black text-emerald-600 mt-2">
              {deliveredCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Pending</p>

            <h2 className="text-4xl font-black text-orange-600 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Out For Delivery</p>

            <h2 className="text-4xl font-black text-blue-600 mt-2">
              {
                deliveries.filter(
                  (delivery) =>
                    delivery.status === "OUT_FOR_DELIVERY"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black text-slate-900">
              Delivery Records
            </h2>

            <p className="text-slate-500">
              Total deliveries: {deliveries.length}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Delivery Boy</th>
                  <th className="p-4 text-left">Address</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Update</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {deliveries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-6 text-center text-slate-500"
                    >
                      No deliveries found.
                    </td>
                  </tr>
                ) : (
                  deliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="border-t hover:bg-orange-50 transition"
                    >
                      <td className="p-4 font-semibold">
                        #{delivery.id}
                      </td>

                      <td className="p-4">
                        {getOrderCode(delivery)}
                      </td>

                      <td className="p-4">
                        {getCustomer(delivery)}
                      </td>

                      <td className="p-4">
                        {getDeliveryBoy(delivery)}
                      </td>

                      <td className="p-4">
                        {delivery.deliveryAddress || "N/A"}
                      </td>

                      <td className="p-4">
                        <StatusBadge
                          status={delivery.status || "ASSIGNED"}
                        />
                      </td>

                      <td className="p-4">
                        <select
                          value={delivery.status || "ASSIGNED"}
                          disabled={updatingId === delivery.id}
                          onChange={(e) =>
                            handleStatusChange(
                              delivery.id,
                              e.target.value
                            )
                          }
                          className="border border-slate-300 p-2 rounded-xl disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {DELIVERY_STATUSES.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleViewDelivery(delivery)
                          }
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showViewModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDelivery(null);
                }}
                className="absolute top-4 right-5 text-2xl text-slate-500 hover:text-red-600"
              >
                ×
              </button>

              <h2 className="text-3xl font-black text-slate-900">
                Delivery Details
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">
                    Delivery ID
                  </p>

                  <p className="font-bold">
                    #{selectedDelivery.id}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">
                    Order
                  </p>

                  <p className="font-bold">
                    {getOrderCode(selectedDelivery)}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">
                    Customer
                  </p>

                  <p className="font-bold">
                    {getCustomer(selectedDelivery)}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">
                    Delivery Boy
                  </p>

                  <p className="font-bold">
                    {getDeliveryBoy(selectedDelivery)}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl md:col-span-2">
                  <p className="text-slate-500 text-sm">
                    Address
                  </p>

                  <p className="font-bold">
                    {selectedDelivery.deliveryAddress ||
                      "N/A"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">
                    Status
                  </p>

                  <p className="font-bold">
                    {selectedDelivery.status ||
                      "ASSIGNED"}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">
                    Assigned At
                  </p>

                  <p className="font-bold">
                    {selectedDelivery.assignedAt ||
                      selectedDelivery.createdAt ||
                      "N/A"}
                  </p>
                </div>

                {selectedDelivery.latitude &&
                  selectedDelivery.longitude && (
                    <div className="bg-slate-100 p-4 rounded-2xl md:col-span-2">
                      <p className="text-slate-500 text-sm">
                        Coordinates
                      </p>

                      <p className="font-bold">
                        {selectedDelivery.latitude},{" "}
                        {selectedDelivery.longitude}
                      </p>
                    </div>
                  )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedDelivery(null);
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

export default ManageDeliveries;