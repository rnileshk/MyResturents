import { ROLE_DASHBOARD_PATHS, ROLES, DEFAULT_ROUTES } from "./constants";
import { getUserRole } from "./tokenUtils";

export const normalizeRole = (role) => {
  if (!role) return null;

  if (Array.isArray(role)) {
    return normalizeRole(role[0]);
  }

  return String(role).replace("ROLE_", "").toUpperCase();
};

export const hasRole = (allowedRoles = [], userRole = getUserRole()) => {
  const normalizedUserRole = normalizeRole(userRole);

  if (!normalizedUserRole) return false;

  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  return normalizedAllowedRoles.includes(normalizedUserRole);
};

export const isAdmin = (role = getUserRole()) => {
  return normalizeRole(role) === ROLES.ADMIN;
};

export const isUser = (role = getUserRole()) => {
  return normalizeRole(role) === ROLES.USER;
};

export const isEmployee = (role = getUserRole()) => {
  return normalizeRole(role) === ROLES.EMPLOYEE;
};

export const isBillingStaff = (role = getUserRole()) => {
  return normalizeRole(role) === ROLES.BILLING_STAFF;
};

export const isDeliveryStaff = (role = getUserRole()) => {
  return normalizeRole(role) === ROLES.DELIVERY_STAFF;
};

export const getDashboardPathByRole = (role = getUserRole()) => {
  const normalizedRole = normalizeRole(role);
  return ROLE_DASHBOARD_PATHS[normalizedRole] || DEFAULT_ROUTES.PUBLIC_HOME;
};

export const canManageUsers = (role = getUserRole()) => {
  return isAdmin(role);
};

export const canManageMenu = (role = getUserRole()) => {
  return isAdmin(role) || isEmployee(role);
};

export const canManageBookings = (role = getUserRole()) => {
  return isAdmin(role) || isEmployee(role);
};
};