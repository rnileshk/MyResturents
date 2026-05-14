import StatusBadge from "../common/StatusBadge";

const PaymentCard = ({ payment, onStatusChange }) => {
  if (!payment) return null;

  const handleStatusChange = (e) => {
    if (onStatusChange) {
      onStatusChange(payment.id, e.target.value);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 border">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-xl font-bold">
            Payment #{payment.id}
          </h3>

          <p className="text-gray-600 mt-1">
            Transaction: {payment.transactionId || "N/A"}
          </p>
        </div>

        <StatusBadge status={payment.status || "PENDING"} />
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Order ID:</span>{" "}
          {payment.orderId || payment.order?.id || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Amount:</span> ₹
          {payment.amount || payment.totalAmount || 0}
        </p>

        <p>
          <span className="font-semibold">Method:</span>{" "}
          {payment.paymentMethod || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Date:</span>{" "}
          {payment.createdAt
            ? new Date(payment.createdAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {onStatusChange && (
        <div className="mt-4">
          <label className="block font-medium mb-1">Update Status</label>

          <select
            value={payment.status || "PENDING"}
            onChange={handleStatusChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;