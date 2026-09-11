import { useEffect, useState } from "react";
import api from "../services/api";

function AdminShows() {

  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);

  const [form, setForm] = useState({
    movieId: "",
    theatreId: "",
    screenId: "",
    showDate: "",
    showTime: "",
    ticketPrice: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {

      const [
        showsRes,
        moviesRes,
        theatresRes,
        screensRes
      ] = await Promise.all([
        api.get("/shows"),
        api.get("/movies"),
        api.get("/theatres"),
        api.get("/screens")
      ]);

      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheatres(theatresRes.data);
      setScreens(screensRes.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const addShow = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        `/shows?movieId=${form.movieId}&theatreId=${form.theatreId}&screenId=${form.screenId}`,
        {
          showDate: form.showDate,
          showTime: form.showTime,
          ticketPrice: Number(form.ticketPrice)
        }
      );

      alert("Show added successfully");

      setForm({
        movieId: "",
        theatreId: "",
        screenId: "",
        showDate: "",
        showTime: "",
        ticketPrice: ""
      });

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add show"
      );
    }
  };

  const deleteShow = async (id) => {

    const confirmDelete =
      window.confirm("Are you sure you want to delete this show?");

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/shows/${id}`);

      alert("Show deleted successfully");

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Cannot delete show because bookings may exist"
      );
    }
  };

  const filteredScreens = screens.filter(
    (screen) =>
      !form.theatreId ||
      String(screen.theatre?.id) === String(form.theatreId)
  );

  return (
    <div>

      <h2 className="mb-4">Manage Shows</h2>

      <div className="card p-4 mb-4">

        <h5>Add Show</h5>

        <form onSubmit={addShow}>

          <div className="row">

            <div className="col-md-4 mb-3">
              <label>Movie</label>

              <select
                className="form-control"
                name="movieId"
                value={form.movieId}
                onChange={handleChange}
                required
              >
                <option value="">Select Movie</option>

                {movies.map((movie) => (
                  <option
                    key={movie.id}
                    value={movie.id}
                  >
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label>Theatre</label>

              <select
                className="form-control"
                name="theatreId"
                value={form.theatreId}
                onChange={(e) => {
                  setForm({
                    ...form,
                    theatreId: e.target.value,
                    screenId: ""
                  });
                }}
                required
              >
                <option value="">Select Theatre</option>

                {theatres.map((theatre) => (
                  <option
                    key={theatre.id}
                    value={theatre.id}
                  >
                    {theatre.name} - {theatre.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label>Screen</label>

              <select
                className="form-control"
                name="screenId"
                value={form.screenId}
                onChange={handleChange}
                required
                disabled={!form.theatreId}
              >
                <option value="">Select Screen</option>

                {filteredScreens.map((screen) => (
                  <option
                    key={screen.id}
                    value={screen.id}
                  >
                    {screen.screenName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label>Show Date</label>

              <input
                type="date"
                className="form-control"
                name="showDate"
                value={form.showDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Show Time</label>

              <input
                type="time"
                className="form-control"
                name="showTime"
                value={form.showTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Ticket Price</label>

              <input
                type="number"
                className="form-control"
                name="ticketPrice"
                value={form.ticketPrice}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

          </div>

          <button
            className="btn btn-primary"
            type="submit"
          >
            Add Show
          </button>

        </form>

      </div>

      <div className="card p-4">

        <h5>All Shows</h5>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead>
              <tr>
                <th>ID</th>
                <th>Movie</th>
                <th>Theatre</th>
                <th>Screen</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {shows.map((show) => (

                <tr key={show.id}>

                  <td>{show.id}</td>

                  <td>
                    {show.movie?.title}
                  </td>

                  <td>
                    {show.theatre?.name}
                  </td>

                  <td>
                    {show.screen?.screenName}
                  </td>

                  <td>
                    {show.showDate}
                  </td>

                  <td>
                    {show.showTime}
                  </td>

                  <td>
                    ₹{show.ticketPrice}
                  </td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteShow(show.id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminShows;