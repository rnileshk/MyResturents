import { downloadBookingTicket } from "../api/bookingApi";

export const downloadBlobFile = (blob, fileName = "download.pdf") => {
  if (!blob) {
    throw new Error("No file data received from server");
  }

  const fileUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(fileUrl);
};

export const downloadTicket = async (bookingId, bookingCode = "booking-ticket") => {
  if (!bookingId) {
    throw new Error("Booking ID is required to download ticket");
  }

  const blob = await downloadBookingTicket(bookingId);
  const safeBookingCode = String(bookingCode).replace(/[^a-zA-Z0-9-_]/g, "_");

  downloadBlobFile(blob, `${safeBookingCode}.pdf`);
};