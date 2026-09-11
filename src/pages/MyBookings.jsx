import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    loadBookings(userId);
  }, [navigate]);

  const loadBookings = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/bookings/user/${userId}`
      );

      setBookings(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load bookings:",
        error
      );

      setError(
        "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async (bookingId) => {
    try {
      setDownloadingId(bookingId);

      const response = await api.get(
        `/bookings/${bookingId}/ticket`,
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
        `Movie-Ticket-${bookingId}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        "Ticket download failed:",
        error
      );

      alert(
        "Failed to download ticket PDF"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      return (
        new Date(b.bookingTime || 0) -
        new Date(a.bookingTime || 0)
      );
    });
  }, [bookings]);

  const confirmedCount =
    bookings.filter(
      (booking) =>
        booking.status === "CONFIRMED"
    ).length;

  const expiredCount =
    bookings.filter(
      (booking) =>
        booking.status === "EXPIRED"
    ).length;

  const cancelledCount =
    bookings.filter(
      (booking) =>
        booking.status === "CANCELLED"
    ).length;

  const getStatusClass = (status) => {
    if (status === "CONFIRMED") {
      return "booking-status confirmed";
    }

    if (status === "EXPIRED") {
      return "booking-status expired";
    }

    if (status === "CANCELLED") {
      return "booking-status cancelled";
    }

    return "booking-status pending";
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatTime = (time) => {
    if (!time) {
      return "N/A";
    }

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

  if (loading) {
    return (
      <div className="bookings-loading">

        <div
          className="spinner-border text-danger"
          role="status"
        />

        <p>
          Loading your bookings...
        </p>

      </div>
    );
  }

  return (
    <div className="my-bookings-page">

      <div className="container">

        {/* HEADER */}

        <div className="bookings-header">

          <div>

            <span className="bookings-small-title">
              MY ACCOUNT
            </span>

            <h1>
              My Bookings
            </h1>

            <p>
              View your movie tickets and
              booking history.
            </p>

          </div>

          <button
            className="browse-movies-btn"
            onClick={() =>
              navigate("/")
            }
          >
            Browse Movies
          </button>

        </div>

        {/* STATS */}

        <div className="booking-stats">

          <div className="booking-stat-card">

            <div>
              <span>
                Total Bookings
              </span>

              <p>
                All your movie tickets
              </p>
            </div>

            <strong>
              {bookings.length}
            </strong>

          </div>

          <div className="booking-stat-card">

            <div>
              <span>
                Confirmed
              </span>

              <p>
                Upcoming tickets
              </p>
            </div>

            <strong>
              {confirmedCount}
            </strong>

          </div>

          <div className="booking-stat-card">

            <div>
              <span>
                Expired
              </span>

              <p>
                Previous shows
              </p>
            </div>

            <strong>
              {expiredCount}
            </strong>

          </div>

          <div className="booking-stat-card">

            <div>
              <span>
                Cancelled
              </span>

              <p>
                Cancelled bookings
              </p>
            </div>

            <strong>
              {cancelledCount}
            </strong>

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div className="bookings-error">

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                loadBookings(
                  localStorage.getItem(
                    "userId"
                  )
                )
              }
            >
              Try Again
            </button>

          </div>

        )}

        {/* EMPTY */}

        {!error &&
        sortedBookings.length === 0 ? (

          <div className="no-bookings">

            <div className="no-bookings-icon">
              🎟️
            </div>

            <h3>
              No bookings yet
            </h3>

            <p>
              You haven't booked any movie
              tickets yet.
            </p>

            <button
              onClick={() =>
                navigate("/")
              }
            >
              Find Movies
            </button>

          </div>

        ) : (

          <div className="booking-list">

            {sortedBookings.map(
              (booking) => (

                <div
                  className="booking-ticket"
                  key={booking.id}
                >

                  {/* POSTER */}

                  <div className="booking-poster">

                    {booking.show?.movie
                      ?.imageUrl ? (

                      <img
                        src={
                          booking.show.movie
                            .imageUrl
                        }
                        alt={
                          booking.show.movie
                            .title
                        }
                      />

                    ) : (

                      <div className="poster-placeholder">
                        🎬
                      </div>

                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="booking-content">

                    <div className="booking-top">

                      <div>

                        <span className="booking-id">
                          BOOKING #
                          {booking.id}
                        </span>

                        <h3>
                          {booking.show
                            ?.movie?.title ||
                            "Movie"}
                        </h3>

                        <p className="booking-genre">
                          {booking.show
                            ?.movie?.genre ||
                            "Movie Ticket"}
                        </p>

                      </div>

                      <span
                        className={
                          getStatusClass(
                            booking.status
                          )
                        }
                      >
                        {booking.status}
                      </span>

                    </div>

                    {/* SHOW INFO */}

                    <div className="booking-info-grid">

                      <div>

                        <span>
                          Theatre
                        </span>

                        <strong>
                          {booking.show
                            ?.theatre?.name ||
                            "N/A"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Screen
                        </span>

                        <strong>
                          {booking.show
                            ?.screen
                            ?.screenName ||
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

                    {/* SEATS + PRICE */}

                    <div className="booking-bottom">

                      <div className="booking-seats">

                        <span>
                          Seats
                        </span>

                        <div className="seat-badges">

                          {booking.seats
                            ?.length > 0 ? (

                            booking.seats.map(
                              (seat) => (

                                <span
                                  key={
                                    seat.id
                                  }
                                >
                                  {
                                    seat.seatNumber
                                  }
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

                      <div className="booking-price">

                        <span>
                          Total Amount
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

                    </div>

                    {/* ACTIONS */}

                    <div className="booking-actions">

                      <div className="booking-created">

                        Booked on{" "}
                        {booking.bookingTime
                          ? new Date(
                              booking.bookingTime
                            ).toLocaleString(
                              "en-IN"
                            )
                          : "N/A"}

                      </div>

                      <button
                        className="download-ticket-btn"
                        onClick={() =>
                          downloadTicket(
                            booking.id
                          )
                        }
                        disabled={
                          downloadingId ===
                          booking.id
                        }
                      >

                        {downloadingId ===
                        booking.id
                          ? "Downloading..."
                          : "Download Ticket PDF"}

                      </button>

                    </div>

                    {/* EXPIRED */}

                    {booking.status ===
                      "EXPIRED" && (

                      <div className="expired-message">

                        This show has ended.
                        You can still download
                        your ticket for your
                        booking history.

                      </div>

                    )}

                    {/* CANCELLED */}

                    {booking.status ===
                      "CANCELLED" && (

                      <div className="cancelled-message">

                        This booking has been
                        cancelled.

                      </div>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyBookings;