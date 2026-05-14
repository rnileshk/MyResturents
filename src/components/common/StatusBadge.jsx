const StatusBadge = ({ status = "PENDING" }) => {
  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-purple-100 text-purple-700",
    READY: "bg-indigo-100 text-indigo-700",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
    PICKED_UP: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    COMPLETED: "bg-green-100 text-green-700",
    SUCCESS: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
  };

  const className = statusStyles[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
};

export default StatusBadge;