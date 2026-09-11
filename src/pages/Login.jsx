import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";
import "./Login.css";

function Login() {
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

    if (!email.trim() || !password) {
      setError(
        "Please enter email and password."
      );

      return;
    }

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

      // BLOCK ADMIN FROM USER LOGIN
      if (data.role === "ADMIN") {
        clearAuth();

        setError(
          "Admin accounts cannot login here. Please use Admin Login."
        );

        return;
      }

      // ONLY USER ROLE
      if (data.role !== "USER") {
        clearAuth();

        setError(
          "This account cannot use the user login."
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

      navigate("/");

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      let message =
        "Invalid email or password.";

      if (
        typeof error.response?.data ===
        "string"
      ) {
        message =
          error.response.data;
      } else if (
        error.response?.data?.message
      ) {
        message =
          error.response.data.message;
      } else if (
        error.response?.data?.error
      ) {
        message =
          error.response.data.error;
      }

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-banner">

          <div className="login-banner-content">

            <span className="login-banner-label">
              MOVIEBOOKING
            </span>

            <h1>
              Your next movie experience
              starts here.
            </h1>

            <p>
              Login to book tickets,
              select seats and manage
              your bookings.
            </p>

          </div>

        </div>

        <div className="login-form-section">

          <div className="login-form-box">

            <span className="login-small-title">
              WELCOME BACK
            </span>

            <h2>
              Login to your account
            </h2>

            <p className="login-subtitle">
              Enter your details to continue.
            </p>

            <form onSubmit={handleLogin}>

              <div className="login-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="login-field">

                <label>
                  Password
                </label>

                <div className="password-input">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="button"
                    className="show-password-btn"
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
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>

            <div className="login-register">

              <span>
                Don't have an account?{" "}
              </span>

              <Link to="/register">
                Create Account
              </Link>

            </div>

            <div className="admin-login-link">

              <span>
                Are you an administrator?{" "}
              </span>

              <Link to="/admin/login">
                Admin Login
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;