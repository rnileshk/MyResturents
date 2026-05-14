import { Trash2, Plus, Minus } from "lucide-react";

const Cart = ({ cartItems = [], onIncrease, onDecrease, onRemove }) => {
  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add food items to place an order.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onDecrease?.(item.id)}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Minus size={16} />
              </button>

              <span className="font-bold">{item.quantity || 1}</span>

              <button
                onClick={() => onIncrease?.(item.id)}
                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={() => onRemove?.(item.id)}
                className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 text-xl font-bold">
        <span>Total</span>
        <span>₹{totalAmount}</span>
      </div>
    </div>
  );
};

export default Cart;