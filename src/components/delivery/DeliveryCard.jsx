import DeliveryStatusActions from "./DeliveryStatusActions";

const DeliveryCard = ({ delivery, onStatusUpdate }) => {
  if (!delivery) return null;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Delivery #{delivery.id}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Order Code:{" "}
            <span className="font-medium text-gray-700">
              {delivery.order?.orderCode || delivery.orderCode || "N/A"}
            </span>
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Delivery Boy:{" "}
            <span className="font-medium text-gray-700">
              {delivery.deliveryBoy?.name || delivery.deliveryBoyName || "Not assigned"}
            </span>
          </p>
        </div>

        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
          {delivery.status || "PENDING"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Delivery Address</p>
          <p className="font-medium text-gray-800">
            {delivery.deliveryAddress || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Assigned At</p>
          <p className="font-medium text-gray-800">
            {delivery.assignedAt
              ? new Date(delivery.assignedAt).toLocaleString()
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Latitude</p>
          <p className="font-medium text-gray-800">
            {delivery.latitude || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Longitude</p>
          <p className="font-medium text-gray-800">
            {delivery.longitude || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <DeliveryStatusActions
          deliveryId={delivery.id}
          currentStatus={delivery.status}
          onStatusUpdate={onStatusUpdate}
        />
      </div>
    </div>
  );
};

export default DeliveryCard;