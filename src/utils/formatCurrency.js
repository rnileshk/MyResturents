export const formatCurrency = (amount) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

export const calculateSubtotal = (items = []) => {
  return items.reduce((total, item) => {
    const price = Number(item.price || item.menuItem?.price || 0);
    const quantity = Number(item.quantity || 1);
    return total + price * quantity;
  }, 0);
};

export const calculateTax = (amount, taxPercentage = 5) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) return 0;

  return (numericAmount * taxPercentage) / 100;
};

export const calculateGrandTotal = ({ subtotal = 0, tax = 0, deliveryCharge = 0, discount = 0 }) => {
  return Number(subtotal) + Number(tax) + Number(deliveryCharge) - Number(discount);
};