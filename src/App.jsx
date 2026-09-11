import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Seats from "./pages/Seats";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminMovies from "./admin/AdminMovies";
import AdminTheatres from "./admin/AdminTheatres";
import AdminScreens from "./admin/AdminScreens";
import AdminShows from "./admin/AdminShows";
import AdminBookings from "./admin/AdminBookings";
import AdminUsers from "./admin/AdminUsers";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";

function App() {

  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>

        {/* USER ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

        <Route
          path="/seats/:showId"
          element={<Seats />}
        />

        <Route
          path="/payment/:showId"
          element={<Payment />}
        />

        <Route
          path="/booking-success"
          element={<BookingSuccess />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />


        {/* ADMIN LOGIN */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* PROTECTED ADMIN ROUTES */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >

          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="movies"
            element={<AdminMovies />}
          />

          <Route
            path="theatres"
            element={<AdminTheatres />}
          />

          <Route
            path="screens"
            element={<AdminScreens />}
          />

          <Route
            path="shows"
            element={<AdminShows />}
          />

          <Route
            path="bookings"
            element={<AdminBookings />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

        </Route>

      </Routes>
    </>
  );
}

export default App;