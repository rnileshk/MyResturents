import toast from "react-hot-toast";

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    localStorage.removeItem("cart");
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );
};

export const addToCart = (item) => {
  const cart = getCart();

  const existing = cart.find((cartItem) => cartItem.id === item.id);

  if (existing) {
    const updated = cart.map((cartItem) =>
      cartItem.id === item.id
        ? {
            ...cartItem,
            quantity: Number(cartItem.quantity || 1) + 1,
          }
        : cartItem
    );

    saveCart(updated);

    toast.success(`${item.name} quantity updated 🛒`);

    return;
  }

  saveCart([...cart, { ...item, quantity: 1 }]);

  toast.success(`${item.name} added to cart 🎉`);
};

export const removeFromCart = (id) => {
  const cart = getCart();

  const item = cart.find((i) => i.id === id);

  saveCart(cart.filter((item) => item.id !== id));

  toast.success(`${item?.name || "Item"} removed`);
};

export const clearCart = () => {
  localStorage.removeItem("cart");

  window.dispatchEvent(new Event("cartUpdated"));

  toast.success("Cart cleared 🧹");
};