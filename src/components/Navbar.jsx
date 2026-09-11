import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setToken(localStorage.getItem("token") || "");
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();

    setName("");
    setToken("");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
      <div className="container">

        <Link className="navbar-brand fw-bold brand-logo" to="/">
          MovieBooking
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >

          <div className="navbar-nav me-auto">

            <Link
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
              to="/"
            >
              Movies
            </Link>

            {token && (
              <Link
                className={`nav-link ${
                  location.pathname === "/my-bookings"
                    ? "active"
                    : ""
                }`}
                to="/my-bookings"
              >
                My Bookings
              </Link>
            )}

          </div>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">

            {token ? (
              <>
                <div className="user-box">
                  <div className="user-avatar">
                    {name
                      ? name.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <span className="user-name">
                    Hi, {name || "User"}
                  </span>
                </div>

                <button
                  className="btn logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn login-btn"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  className="btn register-btn"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;