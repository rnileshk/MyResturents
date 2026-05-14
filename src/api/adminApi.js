import axiosInstance from "./axiosInstance";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/api/admin/dashboard");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/api/admin/users");
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/users/${id}`);
  return response.data;
};