import axiosInstance from "./axiosInstance";

export const createBill = async (data) => {
  const response = await axiosInstance.post("/api/billing", data);
  return response.data;
};

export const getAllBills = async () => {
  const response = await axiosInstance.get("/api/billing");
  return response.data;
};

export const getBillById = async (id) => {
  const response = await axiosInstance.get(`/api/billing/${id}`);
  return response.data;
};

export const deleteBill = async (id) => {
  const response = await axiosInstance.delete(`/api/billing/${id}`);
  return response.data;
};