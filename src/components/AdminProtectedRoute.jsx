import {
  Navigate,
  Outlet
} from "react-router-dom";

function AdminProtectedRoute() {
  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  if (role !== "ADMIN") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminProtectedRoute;