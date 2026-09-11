import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    movies: 0,
    theatres: 0,
    screens: 0,
    shows: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        moviesRes,
        theatresRes,
        screensRes,
        showsRes,
        bookingsRes,
        usersRes
      ] = await Promise.all([
        api.get("/movies"),
        api.get("/theatres"),
        api.get("/screens"),
        api.get("/shows"),
        api.get("/bookings"),
        api.get("/auth/users")
      ]);

      const movies =
        moviesRes.data || [];

      const theatres =
        theatresRes.data || [];

      const screens =
        screensRes.data || [];

      const shows =
        showsRes.data || [];

      const bookings =
        bookingsRes.data || [];

      const users =
        usersRes.data || [];

      const totalRevenue = bookings
        .filter(
          (booking) =>
            booking.status !== "CANCELLED"
        )
        .reduce(
          (total, booking) =>
            total +
            Number(
              booking.totalAmount || 0
            ),
          0
        );

      setStats({
        movies: movies.length,
        theatres: theatres.length,
        screens: screens.length,
        shows: shows.length,
        bookings: bookings.length,
        users: users.length,
        revenue: totalRevenue
      });

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setError(
        "Unable to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <div className="dashboard-heading">

        <div>

          <span>
            OVERVIEW
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Overview of your movie booking
            platform.
          </p>

        </div>

        <button
          onClick={loadDashboard}
          className="dashboard-refresh"
        >
          Refresh
        </button>

      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="dashboard-card-grid">

        <DashboardCard
          title="Movies"
          value={stats.movies}
          icon="🎬"
          link="/admin/movies"
        />

        <DashboardCard
          title="Theatres"
          value={stats.theatres}
          icon="🏢"
          link="/admin/theatres"
        />

        <DashboardCard
          title="Screens"
          value={stats.screens}
          icon="📺"
          link="/admin/screens"
        />

        <DashboardCard
          title="Shows"
          value={stats.shows}
          icon="🎟️"
          link="/admin/shows"
        />

        <DashboardCard
          title="Bookings"
          value={stats.bookings}
          icon="📋"
          link="/admin/bookings"
        />

        <DashboardCard
          title="Users"
          value={stats.users}
          icon="👥"
          link="/admin/users"
        />

      </div>

      <div className="dashboard-revenue">

        <div>

          <span>
            TOTAL REVENUE
          </span>

          <h2>
            ₹
            {stats.revenue.toLocaleString(
              "en-IN"
            )}
          </h2>

          <p>
            Revenue from successful bookings
          </p>

        </div>

        <div className="dashboard-revenue-icon">
          ₹
        </div>

      </div>

      <div className="dashboard-actions">

        <h3>
          Quick Actions
        </h3>

        <div className="dashboard-action-grid">

          <Link to="/admin/movies">
            Manage Movies
          </Link>

          <Link to="/admin/theatres">
            Manage Theatres
          </Link>

          <Link to="/admin/screens">
            Manage Screens
          </Link>

          <Link to="/admin/shows">
            Manage Shows
          </Link>

          <Link to="/admin/bookings">
            View Bookings
          </Link>

          <Link to="/admin/users">
            View Users
          </Link>

        </div>

      </div>

    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  link
}) {
  return (
    <Link
      to={link}
      className="dashboard-stat-card"
    >

      <div className="dashboard-stat-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </Link>
  );
}

export default AdminDashboard;