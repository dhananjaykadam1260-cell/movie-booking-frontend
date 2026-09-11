import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/register",
        form
      );

      alert(
        typeof response.data === "string"
          ? response.data
          : "Registration successful"
      );

      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* LEFT SIDE */}
        <div className="register-banner">

          <div className="register-banner-content">

            <span className="register-small-title">
              JOIN MOVIEBOOKING
            </span>

            <h1>
              Create your account and start booking.
            </h1>

            <p>
              Discover movies, select your favourite shows,
              choose seats and manage your bookings easily.
            </p>

            <div className="register-features">
              <span>✓ Fast movie booking</span>
              <span>✓ Select your favourite seats</span>
              <span>✓ Receive ticket by email</span>
              <span>✓ View booking history</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="register-form-section">

          <div className="register-card">

            <div className="register-heading">

              <span className="create-text">
                GET STARTED
              </span>

              <h2>Create Account</h2>

              <p>
                Fill in your details to create your account.
              </p>

            </div>

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="register-field">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="register-field">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="register-field">

                <label>Password</label>

                <div className="register-password-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    minLength="6"
                    required
                  />

                  <button
                    type="button"
                    className="register-show-password"
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

              <button
                type="submit"
                className="main-register-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            <div className="register-login">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Login
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;