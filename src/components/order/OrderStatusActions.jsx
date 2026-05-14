import { updateOrderStatus } from "../../api/orderApi";

const ORDER_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

const OrderStatusActions = ({ orderId, currentStatus, onStatusUpdated }) => {
  const handleStatusChange = async (status) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      onStatusUpdated?.(updatedOrder);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ORDER_STATUSES.map((status) => (
        <button
          key={status}
          disabled={status === currentStatus}
          onClick={() => handleStatusChange(status)}
          className={`px-3 py-2 rounded text-sm font-medium ${
            status === currentStatus
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default OrderStatusActions;