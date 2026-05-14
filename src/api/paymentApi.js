import axiosInstance from "./axiosInstance";

export const createPayment = async (data) => {
  const response = await axiosInstance.post("/api/payments", data);
  return response.data;
};

export const getAllPayments = async () => {
  const response = await axiosInstance.get("/api/payments");
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await axiosInstance.get(`/api/payments/${id}`);
  return response.data;
};

export const updatePaymentStatus = async (id, status) => {
  const response = await axiosInstance.put(
    `/api/payments/${id}/status?status=${encodeURIComponent(status)}`
  );

  return response.data;
};