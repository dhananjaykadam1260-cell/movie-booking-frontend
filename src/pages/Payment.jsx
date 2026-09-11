import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import { useState } from "react";
import api from "../services/api";
import "./Payment.css";

function Payment() {
  const { showId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedSeats = [],
    selectedSeatNumbers = [],
    totalAmount = 0
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [upiId, setUpiId] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [bank, setBank] =
    useState("");

  const [wallet, setWallet] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const validatePayment = () => {
    if (paymentMethod === "UPI") {
      if (!upiId.trim()) {
        setError("Please enter your UPI ID");
        return false;
      }
    }

    if (paymentMethod === "CARD") {
      if (
        !cardNumber.trim() ||
        !cardName.trim() ||
        !expiry.trim() ||
        !cvv.trim()
      ) {
        setError(
          "Please enter all card details"
        );

        return false;
      }

      if (
        cardNumber.replace(/\s/g, "")
          .length < 16
      ) {
        setError(
          "Enter a valid 16-digit card number"
        );

        return false;
      }

      if (cvv.length !== 3) {
        setError(
          "Enter a valid 3-digit CVV"
        );

        return false;
      }
    }

    if (
      paymentMethod === "NET_BANKING" &&
      !bank
    ) {
      setError(
        "Please select your bank"
      );

      return false;
    }

    if (
      paymentMethod === "WALLET" &&
      !wallet
    ) {
      setError(
        "Please select a wallet"
      );

      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (processing) {
      return;
    }

    const userId = Number(
      localStorage.getItem("userId")
    );

    if (!userId) {
      navigate("/login");
      return;
    }

    if (!validatePayment()) {
      return;
    }

    try {
      setProcessing(true);
      setError("");

      /*
        DEMO PAYMENT

        In a real project:
        1. Create payment order
        2. Open Razorpay/Stripe
        3. Verify payment on backend
        4. Create booking
      */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 1500)
      );

      const bookingData = {
        userId,
        showId: Number(showId),
        seatIds: selectedSeats
      };

      const response =
        await api.post(
          "/bookings",
          bookingData
        );

      navigate(
        "/booking-success",
        {
          state: {
            booking: response.data,
            paymentMethod
          }
        }
      );

    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      let message =
        "Payment or booking failed. Please try again.";

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
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const numbers =
      value
        .replace(/\D/g, "")
        .slice(0, 16);

    return numbers
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  if (selectedSeats.length === 0) {
    return (
      <div className="payment-empty">

        <div className="payment-empty-icon">
          🎟️
        </div>

        <h2>
          No seats selected
        </h2>

        <p>
          Please select seats before
          continuing.
        </p>

        <button
          onClick={() =>
            navigate(-1)
          }
        >
          Select Seats
        </button>

      </div>
    );
  }

  return (
    <div className="payment-page">

      <div className="container">

        <div className="payment-header">

          <div>

            <span className="payment-small-title">
              SECURE CHECKOUT
            </span>

            <h1>
              Complete Payment
            </h1>

            <p>
              Choose your preferred payment
              method.
            </p>

          </div>

          <button
            className="payment-back-btn"
            onClick={() =>
              navigate(-1)
            }
            disabled={processing}
          >
            ← Back
          </button>

        </div>

        <div className="payment-layout">

          <div className="payment-main">

            {/* BOOKING DETAILS */}

            <div className="payment-card">

              <div className="payment-card-title">

                <div>

                  <span>
                    BOOKING DETAILS
                  </span>

                  <h3>
                    Movie Tickets
                  </h3>

                </div>

              </div>

              <div className="payment-info-grid">

                <div>

                  <span>
                    Show
                  </span>

                  <strong>
                    #{showId}
                  </strong>

                </div>

                <div>

                  <span>
                    Tickets
                  </span>

                  <strong>
                    {selectedSeats.length}
                  </strong>

                </div>

              </div>

              <div className="payment-seat-section">

                <span>
                  Selected Seats
                </span>

                <div className="payment-seat-list">

                  {selectedSeatNumbers.length > 0
                    ? selectedSeatNumbers.map(
                        (seat) => (
                          <span key={seat}>
                            {seat}
                          </span>
                        )
                      )
                    : selectedSeats.map(
                        (seat) => (
                          <span key={seat}>
                            #{seat}
                          </span>
                        )
                      )}

                </div>

              </div>

            </div>

            {/* PAYMENT METHOD */}

            <div className="payment-card">

              <div className="payment-card-title">

                <div>

                  <span>
                    PAYMENT METHOD
                  </span>

                  <h3>
                    How would you like to pay?
                  </h3>

                </div>

              </div>

              <div className="payment-methods">

                <button
                  className={`payment-method ${
                    paymentMethod === "UPI"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setPaymentMethod("UPI");
                    setError("");
                  }}
                >
                  <span>UPI</span>
                  <small>
                    Google Pay, PhonePe, BHIM
                  </small>
                </button>

                <button
                  className={`payment-method ${
                    paymentMethod === "CARD"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setPaymentMethod("CARD");
                    setError("");
                  }}
                >
                  <span>
                    Card
                  </span>

                  <small>
                    Credit / Debit Card
                  </small>
                </button>

                <button
                  className={`payment-method ${
                    paymentMethod ===
                    "NET_BANKING"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setPaymentMethod(
                      "NET_BANKING"
                    );

                    setError("");
                  }}
                >
                  <span>
                    Net Banking
                  </span>

                  <small>
                    Pay from your bank
                  </small>
                </button>

                <button
                  className={`payment-method ${
                    paymentMethod === "WALLET"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setPaymentMethod("WALLET");
                    setError("");
                  }}
                >
                  <span>
                    Wallet
                  </span>

                  <small>
                    Digital wallets
                  </small>
                </button>

              </div>

              {/* UPI */}

              {paymentMethod === "UPI" && (

                <div className="payment-form">

                  <label>
                    UPI ID
                  </label>

                  <input
                    type="text"
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) =>
                      setUpiId(
                        e.target.value
                      )
                    }
                  />

                  <small>
                    Enter your UPI ID such as
                    name@oksbi or number@ybl
                  </small>

                </div>

              )}

              {/* CARD */}

              {paymentMethod === "CARD" && (

                <div className="payment-form">

                  <label>
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(
                        formatCardNumber(
                          e.target.value
                        )
                      )
                    }
                  />

                  <label>
                    Name on Card
                  </label>

                  <input
                    type="text"
                    placeholder="Your Name"
                    value={cardName}
                    onChange={(e) =>
                      setCardName(
                        e.target.value
                      )
                    }
                  />

                  <div className="card-small-fields">

                    <div>

                      <label>
                        Expiry
                      </label>

                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <div>

                      <label>
                        CVV
                      </label>

                      <input
                        type="password"
                        placeholder="123"
                        maxLength="3"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(
                            e.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                          )
                        }
                      />

                    </div>

                  </div>

                </div>

              )}

              {/* NET BANKING */}

              {paymentMethod ===
                "NET_BANKING" && (

                <div className="payment-form">

                  <label>
                    Select Bank
                  </label>

                  <select
                    value={bank}
                    onChange={(e) =>
                      setBank(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Choose your bank
                    </option>

                    <option value="SBI">
                      State Bank of India
                    </option>

                    <option value="HDFC">
                      HDFC Bank
                    </option>

                    <option value="ICICI">
                      ICICI Bank
                    </option>

                    <option value="AXIS">
                      Axis Bank
                    </option>

                    <option value="KOTAK">
                      Kotak Mahindra Bank
                    </option>

                  </select>

                </div>

              )}

              {/* WALLET */}

              {paymentMethod === "WALLET" && (

                <div className="payment-form">

                  <label>
                    Select Wallet
                  </label>

                  <select
                    value={wallet}
                    onChange={(e) =>
                      setWallet(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Choose wallet
                    </option>

                    <option value="PAYTM">
                      Paytm
                    </option>

                    <option value="AMAZON_PAY">
                      Amazon Pay
                    </option>

                    <option value="MOBIKWIK">
                      MobiKwik
                    </option>

                  </select>

                </div>

              )}

              {error && (

                <div className="payment-error">

                  <strong>
                    Payment failed
                  </strong>

                  <p>
                    {error}
                  </p>

                </div>

              )}

            </div>

          </div>

          {/* SUMMARY */}

          <aside className="payment-summary">

            <span className="summary-label">
              ORDER SUMMARY
            </span>

            <h3>
              Your Booking
            </h3>

            <div className="payment-summary-row">

              <span>
                Tickets
              </span>

              <strong>
                {selectedSeats.length}
              </strong>

            </div>

            <div className="payment-summary-row">

              <span>
                Seats
              </span>

              <strong>
                {selectedSeatNumbers.length > 0
                  ? selectedSeatNumbers.join(
                      ", "
                    )
                  : `${selectedSeats.length} Seats`}
              </strong>

            </div>

            <div className="payment-summary-row">

              <span>
                Payment
              </span>

              <strong>
                {paymentMethod === "UPI"
                  ? "UPI"
                  : paymentMethod === "CARD"
                  ? "Card"
                  : paymentMethod ===
                    "NET_BANKING"
                  ? "Net Banking"
                  : "Wallet"}
              </strong>

            </div>

            <div className="payment-divider" />

            <div className="payment-total">

              <span>
                Amount Payable
              </span>

              <strong>
                ₹
                {Number(
                  totalAmount
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              className="confirm-payment-btn"
              onClick={handlePayment}
              disabled={processing}
            >

              {processing
                ? "Processing Payment..."
                : `Pay ₹${Number(
                    totalAmount
                  ).toLocaleString(
                    "en-IN"
                  )}`}

            </button>

            <p className="payment-note">
              Demo payment for project use.
              No real money will be charged.
            </p>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Payment;