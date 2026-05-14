import StatusBadge from "../common/StatusBadge";
import OrderItems from "./OrderItems";

const OrderCard = ({ order, showItems = true, children }) => {
  if (!order) return null;

  return (
    <div className="bg-white rounded-xl shadow p-5 border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Order #{order.orderCode || order.id}
          </h2>

          <p className="text-sm text-gray-500">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "Date not available"}
          </p>
        </div>

        <StatusBadge status={order.status || "PENDING"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
        <p>
          <span className="font-semibold">Total:</span> ₹
          {order.totalAmount || 0}
        </p>

        <p>
          <span className="font-semibold">Payment:</span>{" "}
          {order.paymentMethod || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Delivery:</span>{" "}
          {order.deliveryStatus || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Address:</span>{" "}
          {order.deliveryAddress || "N/A"}
        </p>
      </div>

      {showItems && <OrderItems items={order.items || []} />}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default OrderCard;