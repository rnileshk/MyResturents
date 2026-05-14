import axiosInstance from "./axiosInstance";

export const createBooking = async (data) => {
  const response = await axiosInstance.post("/api/bookings", data);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await axiosInstance.get("/api/bookings");
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axiosInstance.get("/api/bookings/my");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(`/api/bookings/${id}`);
  return response.data;
};

export const verifyBooking = async (bookingCode) => {
  const response = await axiosInstance.get(`/api/bookings/verify/${bookingCode}`);
  return response.data;
};

export const checkInBookingByCode = async (bookingCode) => {
  const response = await axiosInstance.put(`/api/bookings/checkin/${bookingCode}`);
  return response.data;
};

export const checkInBookingById = async (id) => {
  const response = await axiosInstance.put(`/api/bookings/${id}/checkin`);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await axiosInstance.delete(`/api/bookings/${id}`);
  return response.data;
};

export const downloadBookingTicket = async (id) => {
  const response = await axiosInstance.get(`/api/bookings/${id}/ticket`, {
    responseType: "blob",
  });

  return response.data;
};