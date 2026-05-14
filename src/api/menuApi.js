import axiosInstance from "./axiosInstance";

export const getAllMenuItems = async () => {
  const response = await axiosInstance.get("/api/menu");
  return response.data;
};

export const getMenuItemById = async (id) => {
  const response = await axiosInstance.get(`/api/menu/${id}`);
  return response.data;
};

export const createMenuItem = async (data) => {
  const response = await axiosInstance.post("/api/menu", data);
  return response.data;
};

export const updateMenuItem = async (id, data) => {
  const response = await axiosInstance.put(`/api/menu/${id}`, data);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await axiosInstance.delete(`/api/menu/${id}`);
  return response.data;
};