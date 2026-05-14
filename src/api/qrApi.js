import axiosInstance from "./axiosInstance";

export const generateQRCode = async (text) => {
  const response = await axiosInstance.get(
    `/api/qr/generate?text=${encodeURIComponent(text)}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};