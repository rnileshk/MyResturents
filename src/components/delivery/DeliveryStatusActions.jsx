import { useState } from "react";
import { updateDeliveryStatus } from "../../api/deliveryApi";

const DeliveryStatusActions = ({ deliveryId, currentStatus, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus || "ASSIGNED");
  const [loading, setLoading] = useState(false);

  const deliveryStatuses = [
    "ASSIGNED",
    "PICKED_UP",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  const handleUpdateStatus = async () => {
    if (!deliveryId) {
      alert("Delivery ID is missing");
      return;
    }

    try {
      setLoading(true);

      const updatedDelivery = await updateDeliveryStatus(deliveryId, status);

      alert("Delivery status updated successfully");

      if (onStatusUpdate) {
        onStatusUpdate(updatedDelivery);
      }
    } catch (error) {
      console.error("Delivery status update failed:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update delivery status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
      >
        {deliveryStatuses.map((item) => (
          <option key={item} value={item}>
            {item.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleUpdateStatus}
        disabled={loading}
        className="bg-black text-white px-5 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
};

export default DeliveryStatusActions;