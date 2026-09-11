import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate
} from "react-router-dom";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");

  const adminName =
    localStorage.getItem("name") || "Admin";

  if (!token || role !== "ADMIN") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/admin/login", {
      replace: true
    });
  };

  const getLinkClass = ({ isActive }) =>
    isActive
      ? "admin-nav-link active"
      : "admin-nav-link";

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-logo">
          MovieBooking
        </div>

        <div className="admin-user">

          <small>
            Welcome
          </small>

          <strong>
            {adminName}
          </strong>

        </div>

        <nav className="admin-nav">

          <NavLink
            to="/admin"
            end
            className={getLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/movies"
            className={getLinkClass}
          >
            Movies
          </NavLink>

          <NavLink
            to="/admin/theatres"
            className={getLinkClass}
          >
            Theatres
          </NavLink>

          <NavLink
            to="/admin/screens"
            className={getLinkClass}
          >
            Screens
          </NavLink>

          <NavLink
            to="/admin/shows"
            className={getLinkClass}
          >
            Shows
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={getLinkClass}
          >
            Bookings
          </NavLink>

          <NavLink
            to="/admin/users"
            className={getLinkClass}
          >
            Users
          </NavLink>

        </nav>

        <button
          type="button"
          className="admin-logout"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      <main className="admin-content">

        <div className="admin-topbar">

          <div>

            <span className="admin-topbar-label">
              ADMINISTRATION
            </span>

            <h5>
              Admin Panel
            </h5>

          </div>

          <div className="admin-topbar-user">

            <div className="admin-topbar-avatar">
              {adminName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <span>
                Administrator
              </span>

              <strong>
                {adminName}
              </strong>

            </div>

          </div>

        </div>

        <div className="admin-page-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default AdminLayout;