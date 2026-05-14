import { Pencil, Trash2, ShoppingCart, Star } from "lucide-react";
import { addToCart } from "../../utils/cartUtils";

const MenuCard = ({
  item,
  onEdit,
  onDelete,
  onAddToCart,
  showActions = false,
}) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.imageUrl || "https://via.placeholder.com/600x400?text=Food"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow">
          <Star size={15} className="text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-slate-900">Premium</span>
        </div>

        <div
          className={`absolute top-4 right-4 text-sm px-4 py-1 rounded-full font-bold shadow ${
            item.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.available ? "Available" : "Unavailable"}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-black text-white line-clamp-1">
            {item.name}
          </h3>

          <p className="text-white/80 text-sm mt-1 line-clamp-1">
            {item.category || "Restaurant Special"}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <p className="text-slate-600 line-clamp-2 min-h-[48px]">
          {item.description || "Freshly prepared restaurant special dish."}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Price
            </p>

            <p className="text-3xl font-black text-slate-900">
              ₹{item.price ?? 0}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Status
            </p>

            <p
              className={`font-bold ${
                item.available ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {item.available ? "Ready" : "Closed"}
            </p>
          </div>
        </div>

        {!showActions && item.available && (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        )}

        {!showActions && !item.available && (
          <button
            disabled
            className="w-full bg-slate-200 text-slate-500 py-3 rounded-2xl font-bold cursor-not-allowed"
          >
            Currently Unavailable
          </button>
        )}

        {showActions && (
          <div className="flex gap-3">
            <button
              onClick={() => onEdit?.(item)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition"
            >
              <Pencil size={18} />
              Edit
            </button>

            <button
              onClick={() => onDelete?.(item.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 transition"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;