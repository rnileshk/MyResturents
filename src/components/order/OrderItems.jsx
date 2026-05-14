const OrderItems = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        No order items available.
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="font-bold text-gray-800 mb-3">Order Items</h3>

      <div className="space-y-3">
        {items.map((item, index) => {
          const menuItem = item.menuItem || item;
          const quantity = item.quantity || 1;
          const price = menuItem.price || item.price || 0;

          return (
            <div
              key={item.id || menuItem.id || index}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <h4 className="font-semibold">
                  {menuItem.name || item.name || "Food Item"}
                </h4>

                <p className="text-sm text-gray-500">
                  Qty: {quantity} × ₹{price}
                </p>
              </div>

              <p className="font-bold">₹{Number(price) * Number(quantity)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;