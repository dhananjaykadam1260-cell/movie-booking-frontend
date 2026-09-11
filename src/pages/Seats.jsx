import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Seats.css";

function Seats() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSeats();
  }, [showId]);

  const loadSeats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/seats/show/${showId}`
      );

      setSeats(response.data || []);
    } catch (error) {
      console.error("Seat loading error:", error);

      setError(
        "Unable to load seats. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectSeat = (seat) => {
    if (seat.booked) return;

    setSelectedSeats((current) => {
      if (current.includes(seat.id)) {
        return current.filter(
          (id) => id !== seat.id
        );
      }

      return [...current, seat.id];
    });
  };

  const ticketPrice =
    seats.length > 0
      ? seats[0].show?.ticketPrice || 0
      : 0;

  const totalAmount =
    selectedSeats.length * ticketPrice;

  const selectedSeatNumbers = useMemo(() => {
    return seats
      .filter((seat) =>
        selectedSeats.includes(seat.id)
      )
      .map((seat) => seat.seatNumber);
  }, [seats, selectedSeats]);

  const groupedSeats = useMemo(() => {
    const groups = {};

    seats.forEach((seat) => {
      const row =
        seat.seatNumber?.charAt(0) || "?";

      if (!groups[row]) {
        groups[row] = [];
      }

      groups[row].push(seat);
    });

    Object.keys(groups).forEach((row) => {
      groups[row].sort((a, b) => {
        const aNum =
          parseInt(
            a.seatNumber.replace(/\D/g, ""),
            10
          ) || 0;

        const bNum =
          parseInt(
            b.seatNumber.replace(/\D/g, ""),
            10
          ) || 0;

        return aNum - bNum;
      });
    });

    return groups;
  }, [seats]);

  const show = seats[0]?.show;

  const goToPayment = () => {
    if (selectedSeats.length === 0) {
      return;
    }

    navigate(`/payment/${showId}`, {
      state: {
        selectedSeats,
        selectedSeatNumbers,
        totalAmount
      }
    });
  };

  if (loading) {
    return (
      <div className="seats-loading">
        <div
          className="spinner-border text-danger"
          role="status"
        />

        <p>Loading cinema seats...</p>
      </div>
    );
  }

  return (
    <div className="seats-page">

      <div className="container">

        {/* HEADER */}

        <div className="seats-header">

          <div>

            <span className="seats-small-title">
              SELECT YOUR SEATS
            </span>

            <h1>
              {show?.movie?.title ||
                "Choose Your Seats"}
            </h1>

            <div className="show-meta">

              {show?.theatre?.name && (
                <span>
                  {show.theatre.name}
                </span>
              )}

              {show?.screen?.screenName && (
                <span>
                  {show.screen.screenName}
                </span>
              )}

              {show?.showDate && (
                <span>
                  {show.showDate}
                </span>
              )}

              {show?.showTime && (
                <span>
                  {show.showTime}
                </span>
              )}

            </div>

          </div>

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

        </div>

        {error && (
          <div className="seat-error">

            <p>{error}</p>

            <button onClick={loadSeats}>
              Try Again
            </button>

          </div>
        )}

        {!error && seats.length === 0 && (

          <div className="no-seat-data">
            <h3>No seats available</h3>
            <p>
              No seats were found for this show.
            </p>
          </div>

        )}

        {!error && seats.length > 0 && (

          <div className="seat-layout">

            {/* CINEMA AREA */}

            <div className="cinema-area">

              {/* SCREEN */}

              <div className="screen-area">

                <div className="cinema-screen" />

                <p>
                  SCREEN THIS WAY
                </p>

              </div>

              {/* LEGEND */}

              <div className="seat-legend">

                <div>
                  <span className="legend-seat available" />
                  Available
                </div>

                <div>
                  <span className="legend-seat selected" />
                  Selected
                </div>

                <div>
                  <span className="legend-seat booked" />
                  Booked
                </div>

              </div>

              {/* SEATS */}

              <div className="seat-map">

                {Object.entries(groupedSeats).map(
                  ([row, rowSeats]) => (

                    <div
                      className="seat-row"
                      key={row}
                    >

                      <span className="row-label">
                        {row}
                      </span>

                      <div className="seat-row-buttons">

                        {rowSeats.map(
                          (seat, index) => {

                            const isSelected =
                              selectedSeats.includes(
                                seat.id
                              );

                            return (
                              <button
                                key={seat.id}
                                type="button"
                                disabled={seat.booked}
                                onClick={() =>
                                  selectSeat(seat)
                                }
                                title={
                                  seat.booked
                                    ? `${seat.seatNumber} - Booked`
                                    : `${seat.seatNumber} - ₹${ticketPrice}`
                                }
                                className={`cinema-seat ${
                                  seat.booked
                                    ? "booked"
                                    : isSelected
                                    ? "selected"
                                    : "available"
                                } ${
                                  index === 4
                                    ? "aisle-after"
                                    : ""
                                }`}
                              >
                                {seat.seatNumber.replace(
                                  row,
                                  ""
                                )}
                              </button>
                            );
                          }
                        )}

                      </div>

                      <span className="row-label">
                        {row}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* SUMMARY */}

            <aside className="seat-summary">

              <span className="summary-small-title">
                BOOKING SUMMARY
              </span>

              <h3>
                Your Tickets
              </h3>

              <div className="summary-line">

                <span>
                  Ticket Price
                </span>

                <strong>
                  ₹{ticketPrice}
                </strong>

              </div>

              <div className="summary-line">

                <span>
                  Selected Seats
                </span>

                <strong>
                  {selectedSeats.length}
                </strong>

              </div>

              <div className="summary-seats">

                <span>Seats</span>

                {selectedSeatNumbers.length > 0 ? (

                  <div className="selected-seat-list">

                    {selectedSeatNumbers.map(
                      (seatNumber) => (
                        <span key={seatNumber}>
                          {seatNumber}
                        </span>
                      )
                    )}

                  </div>

                ) : (

                  <p>
                    No seats selected
                  </p>

                )}

              </div>

              <div className="summary-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{totalAmount}
                </strong>

              </div>

              <button
                className="payment-btn"
                disabled={
                  selectedSeats.length === 0
                }
                onClick={goToPayment}
              >
                Proceed to Payment
              </button>

              <small>
                Please review your selected seats
                before continuing.
              </small>

            </aside>

          </div>

        )}

      </div>

    </div>
  );
}

export default Seats;