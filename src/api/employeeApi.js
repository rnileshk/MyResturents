import axiosInstance from "./axiosInstance";

export const createEmployee = async (data) => {
  const response = await axiosInstance.post("/api/employee", data);
  return response.data;
};

export const getAllEmployees = async () => {
  const response = await axiosInstance.get("/api/employee");
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(`/api/employee/${id}`);
  return response.data;
};