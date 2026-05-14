import axiosInstance from "./axiosInstance";

export const loginUser = async (data) => {
  const response = await axiosInstance.post("/api/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/api/auth/register", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/api/auth/profile");
  return response.data;
};