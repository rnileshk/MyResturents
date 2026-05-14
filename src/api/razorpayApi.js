import axiosInstance from "./axiosInstance";

export const createRazorpayOrder = async (data) => {
  const response = await axiosInstance.post("/api/razorpay/create-order", data);
  return response.data;
};

export const verifyRazorpayPayment = async (data) => {
  const response = await axiosInstance.post("/api/razorpay/verify-payment", data);
  return response.data;
};