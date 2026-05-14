import axiosInstance from "./axiosInstance";

const ORDER_BASE_URL = "/api/orders";

export const createOrder = async (data) => {
  const response = await axiosInstance.post(ORDER_BASE_URL, data);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axiosInstance.get(ORDER_BASE_URL);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get(`${ORDER_BASE_URL}/my`);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`${ORDER_BASE_URL}/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(
    `${ORDER_BASE_URL}/${id}/status`,
    null,
    { params: { status } }
  );

  return response.data;
};

export const updateDeliveryStatus = async (id, status) => {
  const response = await axiosInstance.put(
    `${ORDER_BASE_URL}/${id}/delivery-status`,
    null,
    { params: { status } }
  );

  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axiosInstance.delete(`${ORDER_BASE_URL}/${id}`);
  return response.data;
};