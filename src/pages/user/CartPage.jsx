import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getCart,
  saveCart,
  removeFromCart,
  clearCart,
} from "../../utils/cartUtils";

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity }
        : item
    );

    setCartItems(updated);

    saveCart(updated);

    toast.success("Cart updated 🛒");
  };

  const handleRemove = (id) => {
    const item = cartItems.find((i) => i.id === id);

    removeFromCart(id);

    setCartItems(getCart());

    toast.success(
      `${item?.name || "Item"} removed`
    );
  };

  const handleClear = () => {
    clearCart();

    setCartItems([]);

    toast.success("Cart cleared 🧹");
  };

  const handleCheckout = () => {
    toast.success("Redirecting to payment 💳");

    setTimeout(() => {
      navigate("/user/checkout");
    }, 1200);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-widest">
                Smart Food Cart
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-3 flex items-center gap-3">
                <ShoppingCart size={45} />
                My Cart
              </h1>

              <p className="text-slate-300 mt-4 max-w-2xl text-lg">
                Review selected meals, adjust quantity
                and continue securely to checkout.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-slate-300 text-sm">
                Cart Summary
              </p>

              <h2 className="text-4xl font-black text-white mt-2">
                {totalItems}
              </h2>

              <p className="text-orange-300 font-semibold mt-1">
                Total Items
              </p>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="h-24 w-24 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingCart
                size={45}
                className="text-slate-500"
              />
            </div>

            <h2 className="text-3xl font-black text-slate-900 mt-6">
              Your cart is empty
            </h2>

            <p className="text-slate-600 mt-3">
              Add delicious meals from menu to begin
              your restaurant experience.
            </p>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 mt-8 bg-slate-950 hover:bg-orange-600 text-white px-7 py-4 rounded-2xl font-bold transition"
            >
              Browse Menu
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl shadow-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-64 md:h-auto overflow-hidden">
                      <img
                        src={
                          item.imageUrl ||
                          "https://via.placeholder.com/600x400?text=Food"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-3xl font-black text-slate-900">
                              {item.name}
                            </h2>

                            <p className="text-slate-500 mt-2 line-clamp-2">
                              {item.description ||
                                "Freshly prepared restaurant special meal."}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleRemove(item.id)
                            }
                            className="h-12 w-12 rounded-2xl bg-red-100 hover:bg-red-600 hover:text-white text-red-600 flex items-center justify-center transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-6">
                          <div>
                            <p className="text-sm text-slate-400 font-bold uppercase">
                              Price
                            </p>

                            <p className="text-3xl font-black text-orange-600">
                              ₹{item.price}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-slate-400 font-bold uppercase">
                              Quantity
                            </p>

                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Number(
                                      item.quantity || 1
                                    ) - 1
                                  )
                                }
                                className="h-11 w-11 rounded-2xl bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center transition"
                              >
                                <Minus size={18} />
                              </button>

                              <span className="text-2xl font-black min-w-[40px] text-center">
                                {item.quantity || 1}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Number(
                                      item.quantity || 1
                                    ) + 1
                                  )
                                }
                                className="h-11 w-11 rounded-2xl bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center transition"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-slate-400 font-bold uppercase">
                              Total
                            </p>

                            <p className="text-3xl font-black text-emerald-600">
                              ₹
                              {Number(item.price || 0) *
                                Number(
                                  item.quantity || 1
                                )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2 text-emerald-600 font-semibold">
                        <ShieldCheck size={18} />
                        Freshly prepared & quality checked
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="sticky top-6 bg-white rounded-3xl shadow-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">
                    Order Summary
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Secure checkout with instant payment
                    processing.
                  </p>
                </div>

                <div className="space-y-4 border-y py-5">
                  <div className="flex justify-between text-slate-700">
                    <span>Total Items</span>

                    <span className="font-bold">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>

                    <span className="font-bold">
                      ₹ {totalAmount}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Delivery Fee</span>

                    <span className="font-bold text-emerald-600">
                      FREE
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-900">
                    Grand Total
                  </span>

                  <span className="text-4xl font-black text-orange-600">
                    ₹ {totalAmount}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-3 bg-slate-950 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition shadow-xl cursor-pointer"
                >
                  <CreditCard size={22} />
                  Proceed to Payment
                </button>

                <button
                  onClick={handleClear}
                  className="w-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-700 py-4 rounded-2xl font-bold transition cursor-pointer"
                >
                  Clear Cart
                </button>

                <Link
                  to="/menu"
                  className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:border-orange-500 hover:text-orange-600 py-4 rounded-2xl font-bold transition cursor-pointer text-slate-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;