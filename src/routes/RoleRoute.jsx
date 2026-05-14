import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user =
      storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.startsWith("ROLE_")
    ? user.role.replace("ROLE_", "")
    : user.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;