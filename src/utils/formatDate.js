export const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (dateValue) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (timeValue) => {
  if (!timeValue) return "N/A";

  if (typeof timeValue === "string" && /^\d{2}:\d{2}/.test(timeValue)) {
    const [hour, minute] = timeValue.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const date = new Date(timeValue);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getTodayDateInputValue = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const isPastDate = (dateValue) => {
  if (!dateValue) return false;

  const inputDate = new Date(dateValue);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate < today;
};