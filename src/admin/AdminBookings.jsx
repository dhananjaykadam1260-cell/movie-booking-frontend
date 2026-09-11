import { useEffect, useState } from "react";
import api from "../services/api";

function AdminBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {

    try {

      const response = await api.get("/bookings");

      setBookings(response.data);

    } catch (error) {

      console.error(error);

      alert("Failed to load bookings");

    } finally {

      setLoading(false);
    }
  };

  const getStatusClass = (status) => {

    if (status === "CONFIRMED") {
      return "bg-success";
    }

    if (status === "EXPIRED") {
      return "bg-secondary";
    }

    if (status === "CANCELLED") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  if (loading) {
    return <h5>Loading bookings...</h5>;
  }

  return (
    <div>

      <h2 className="mb-4">
        Manage Bookings
      </h2>

      <div className="card p-4">

        <h5 className="mb-3">
          All Bookings
        </h5>

        {bookings.length === 0 ? (

          <p>No bookings found.</p>

        ) : (

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Screen</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Booked At</th>
                </tr>

              </thead>

              <tbody>

                {bookings.map((booking) => (

                  <tr key={booking.id}>

                    <td>
                      {booking.id}
                    </td>

                    <td>
                      {booking.user?.name || "N/A"}
                    </td>

                    <td>
                      {booking.user?.email || "N/A"}
                    </td>

                    <td>
                      {booking.show?.movie?.title || "N/A"}
                    </td>

                    <td>
                      {booking.show?.theatre?.name || "N/A"}
                    </td>

                    <td>
                      {booking.show?.screen?.screenName || "N/A"}
                    </td>

                    <td>
                      {booking.show?.showDate || "N/A"}
                    </td>

                    <td>
                      {booking.show?.showTime || "N/A"}
                    </td>

                    <td>

                      {booking.seats?.length > 0
                        ? booking.seats
                            .map(
                              (seat) =>
                                seat.seatNumber
                            )
                            .join(", ")
                        : "N/A"}

                    </td>

                    <td>
                      ₹{booking.totalAmount}
                    </td>

                    <td>

                      <span
                        className={`badge ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>

                    </td>

                    <td>
                      {booking.bookingTime
                        ? new Date(
                            booking.bookingTime
                          ).toLocaleString()
                        : "N/A"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminBookings;