import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllDeliveries, updateDeliveryStatus } from "../../api/deliveryApi";

const DELIVERY_STATUSES = [
  "ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllDeliveries();
      setDeliveries(normalizeList(data));
    } catch (err) {
      console.error(err);
      setError("Unable to load deliveries.");
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
          delivery.id === id ? { ...delivery, status } : delivery
        )
      );

      setSuccess("Delivery status updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to update delivery status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Delivery List</h1>
          <p className="text-gray-600 mt-1">
            View and update food delivery status.
          </p>
        </div>

        <button
          onClick={fetchDeliveries}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Order Code</th>
              <th className="p-3 text-left">Delivery Boy</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Update Status</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No deliveries found.
                </td>
              </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr key={delivery.id} className="border-t">
                  <td className="p-3">{delivery.id}</td>

                  <td className="p-3">
                    {delivery.foodOrder?.orderCode ||
                      delivery.order?.orderCode ||
                      delivery.orderCode ||
                      "N/A"}
                  </td>

                  <td className="p-3">
                    {delivery.deliveryBoy?.name ||
                      delivery.deliveryBoy?.email ||
                      delivery.user?.name ||
                      "N/A"}
                  </td>

                  <td className="p-3">
                    {delivery.deliveryAddress || "N/A"}
                  </td>

                  <td className="p-3">
                    <StatusBadge status={delivery.status || "ASSIGNED"} />
                  </td>

                  <td className="p-3">
                    <select
                      value={delivery.status || "ASSIGNED"}
                      disabled={updatingId === delivery.id}
                      onChange={(e) =>
                        handleStatusChange(delivery.id, e.target.value)
                      }
                      className="border p-2 rounded"
                    >
                      {DELIVERY_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryList;