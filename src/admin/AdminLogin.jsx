import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response =
        await api.post(
          "/auth/login",
          {
            email: email.trim(),
            password
          }
        );

      const data = response.data;

      if (data.role !== "ADMIN") {
        clearAuth();

        setError(
          "Access denied. This account is not an administrator."
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "userId",
        data.userId
      );

      localStorage.setItem(
        "name",
        data.name
      );

      localStorage.setItem(
        "email",
        data.email
      );

      localStorage.setItem(
        "role",
        data.role
      );

      navigate("/admin", {
        replace: true
      });

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Invalid admin email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-logo">
          MovieBooking
        </div>

        <span className="admin-login-label">
          ADMIN PANEL
        </span>

        <h1>
          Admin Login
        </h1>

        <p>
          Login using your administrator
          account.
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-login-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              placeholder="Admin email"
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="admin-login-field">

            <label>
              Password
            </label>

            <div className="admin-password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                placeholder="Password"
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login as Admin"}
          </button>

        </form>

        <div className="admin-user-login-link">

          Not an administrator?

          <Link to="/login">
            User Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;