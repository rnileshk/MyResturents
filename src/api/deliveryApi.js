import axiosInstance from "./axiosInstance";

export const assignDelivery = async (data) => {
  const response = await axiosInstance.post("/api/delivery/assign", data);
  return response.data;
};

export const getAllDeliveries = async () => {
  const response = await axiosInstance.get("/api/delivery");
  return response.data;
};

export const updateDeliveryStatus = async (id, status) => {
  const response = await axiosInstance.put(`/api/delivery/${id}/status`, {
    status,
  });

  return response.data;
};