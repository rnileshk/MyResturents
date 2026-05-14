export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const APP_NAME = "Restaurant Management System";

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
  DELIVERY_STAFF: "DELIVERY_STAFF",
  BILLING_STAFF: "BILLING_STAFF",
};

export const ORDER_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY: "READY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

export const DELIVERY_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY: "READY",
  PICKED_UP: "PICKED_UP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_METHODS = {
  CASH: "CASH",
  CARD: "CARD",
  UPI: "UPI",
  ONLINE: "ONLINE",
};
export const IMAGE_FALLBACK = "https://placehold.co/600x400?text=Restaurant+Item";