import { STORAGE_KEYS } from "./constants";

export const saveToken = (token) => {
  if (!token) return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const saveUser = (user) => {
  if (!user) return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data in localStorage", error);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const clearAuthStorage = () => {
  removeToken();
  removeUser();
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || user?.roles?.[0] || null;
};

export const parseJwt = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT", error);
    return null;
  }
};