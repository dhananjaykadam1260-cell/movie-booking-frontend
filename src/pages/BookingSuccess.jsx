import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import "./BookingSuccess.css";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  const [downloading, setDownloading] =
    useState(false);

  const downloadTicket = async () => {
    if (!booking?.id) {
      return;
    }

    try {
      setDownloading(true);

      const response = await api.get(
        `/bookings/${booking.id}/ticket`,
        {
          responseType: "blob"
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf"
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `Movie-Ticket-${booking.id}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        "Ticket download error:",
        error
      );

      alert(
        "Failed to download ticket PDF"
      );

    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }
    );
  };

  if (!booking) {
    return (
      <div className="booking-success-empty">

        <div className="success-empty-icon">
          🎟️
        </div>

        <h2>
          Booking not found
        </h2>

        <p>
          We couldn't find booking details
          for this page.
        </p>

        <button
          onClick={() =>
            navigate("/my-bookings")
          }
        >
          View My Bookings
        </button>

      </div>
    );
  }

  const movie =
    booking.show?.movie;

  const theatre =
    booking.show?.theatre;

  const screen =
    booking.show?.screen;

  return (
    <div className="booking-success-page">

      <div className="container">

        {/* SUCCESS HEADER */}

        <div className="success-header">

          <div className="success-check">
            ✓
          </div>

          <span className="success-small-title">
            BOOKING SUCCESSFUL
          </span>

          <h1>
            Booking Confirmed!
          </h1>

          <p>
            Your movie tickets have been booked
            successfully.
          </p>

        </div>

        {/* TICKET */}

        <div className="success-ticket">

          {/* LEFT POSTER */}

          <div className="success-poster">

            {movie?.imageUrl ? (

              <img
                src={movie.imageUrl}
                alt={
                  movie.title ||
                  "Movie"
                }
              />

            ) : (

              <div className="success-poster-placeholder">
                🎬
              </div>

            )}

          </div>

          {/* RIGHT DETAILS */}

          <div className="success-content">

            <div className="success-ticket-top">

              <div>

                <span className="booking-reference">
                  BOOKING #
                  {booking.id}
                </span>

                <h2>
                  {movie?.title ||
                    "Movie"}
                </h2>

                <p>
                  {movie?.language}
                  {movie?.genre &&
                    ` • ${movie.genre}`}
                </p>

              </div>

              <span className="confirmed-badge">
                {booking.status ||
                  "CONFIRMED"}
              </span>

            </div>

            {/* DETAILS */}

            <div className="success-details-grid">

              <div>

                <span>
                  Theatre
                </span>

                <strong>
                  {theatre?.name ||
                    "N/A"}
                </strong>

              </div>

              <div>

                <span>
                  Screen
                </span>

                <strong>
                  {screen?.screenName ||
                    "N/A"}
                </strong>

              </div>

              <div>

                <span>
                  Date
                </span>

                <strong>
                  {formatDate(
                    booking.show
                      ?.showDate
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Time
                </span>

                <strong>
                  {formatTime(
                    booking.show
                      ?.showTime
                  )}
                </strong>

              </div>

            </div>

            {/* SEATS */}

            <div className="success-seats-section">

              <span>
                Your Seats
              </span>

              <div className="success-seat-list">

                {booking.seats?.length >
                0 ? (

                  booking.seats.map(
                    (seat) => (
                      <span key={seat.id}>
                        {seat.seatNumber}
                      </span>
                    )
                  )

                ) : (

                  <span>
                    N/A
                  </span>

                )}

              </div>

            </div>

            {/* TOTAL */}

            <div className="success-total">

              <div>

                <span>
                  Total Amount Paid
                </span>

                <strong>
                  ₹
                  {Number(
                    booking.totalAmount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="success-ticket-count">

                <span>
                  Tickets
                </span>

                <strong>
                  {booking.seats
                    ?.length || 0}
                </strong>

              </div>

            </div>

            {/* BOOKING DATE */}

            <div className="success-booked-on">

              Booking created on{" "}

              {booking.bookingTime
                ? new Date(
                    booking.bookingTime
                  ).toLocaleString(
                    "en-IN"
                  )
                : "N/A"}

            </div>

          </div>

        </div>

        {/* MESSAGE */}

        <div className="success-message">

          <div className="success-message-icon">
            🎟️
          </div>

          <div>

            <h4>
              Your ticket is ready
            </h4>

            <p>
              Download your PDF ticket and
              keep it available when you visit
              the theatre.
            </p>

          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="success-actions">

          <button
            className="download-success-btn"
            onClick={downloadTicket}
            disabled={downloading}
          >
            {downloading
              ? "Downloading..."
              : "Download Ticket PDF"}
          </button>

          <button
            className="my-bookings-btn"
            onClick={() =>
              navigate("/my-bookings")
            }
          >
            My Bookings
          </button>

          <button
            className="back-movies-btn"
            onClick={() =>
              navigate("/")
            }
          >
            Browse More Movies
          </button>

        </div>

      </div>

    </div>
  );
}

export default BookingSuccess;