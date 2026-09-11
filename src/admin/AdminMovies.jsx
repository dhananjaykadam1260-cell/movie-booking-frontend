import { useEffect, useState } from "react";
import api from "../services/api";

function AdminMovies() {

  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    language: "",
    genre: "",
    duration: "",
    imageUrl: "",
    description: ""
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {

    try {

      const response = await api.get("/movies");

      setMovies(response.data);

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

  const saveMovie = async (e) => {

    e.preventDefault();

    try {

      const movieData = {
        title: form.title,
        language: form.language,
        genre: form.genre,
        duration: Number(form.duration),
        imageUrl: form.imageUrl,
        description: form.description
      };

      if (editingId) {

        await api.put(
          `/movies/${editingId}`,
          movieData
        );

        alert("Movie updated successfully");

      } else {

        await api.post(
          "/movies",
          movieData
        );

        alert("Movie added successfully");
      }

      resetForm();

      loadMovies();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save movie"
      );
    }
  };

  const editMovie = (movie) => {

    setEditingId(movie.id);

    setForm({
      title: movie.title || "",
      language: movie.language || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      imageUrl: movie.imageUrl || "",
      description: movie.description || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteMovie = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this movie?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/movies/${id}`);

      alert("Movie deleted successfully");

      loadMovies();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Cannot delete movie. Delete its shows first."
      );
    }
  };

  const resetForm = () => {

    setEditingId(null);

    setForm({
      title: "",
      language: "",
      genre: "",
      duration: "",
      imageUrl: "",
      description: ""
    });
  };

  return (
    <div>

      <h2 className="mb-4">
        Manage Movies
      </h2>

      <div className="card p-4 mb-4">

        <h5>
          {editingId
            ? "Edit Movie"
            : "Add Movie"}
        </h5>

        <form onSubmit={saveMovie}>

          <div className="row">

            <div className="col-md-4 mb-3">

              <label>Movie Title</label>

              <input
                type="text"
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label>Language</label>

              <input
                type="text"
                className="form-control"
                name="language"
                value={form.language}
                onChange={handleChange}
                placeholder="English / Hindi"
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label>Genre</label>

              <input
                type="text"
                className="form-control"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                placeholder="Action / Drama"
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label>Duration (minutes)</label>

              <input
                type="number"
                className="form-control"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min="1"
                required
              />

            </div>

            <div className="col-md-8 mb-3">

              <label>Poster Image URL</label>

              <input
                type="url"
                className="form-control"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                required
              />

            </div>

            <div className="col-12 mb-3">

              <label>Description</label>

              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                required
              />

            </div>

          </div>

          {form.imageUrl && (

            <div className="mb-3">

              <p className="mb-2">
                Poster Preview
              </p>

              <img
                src={form.imageUrl}
                alt="Movie Poster"
                style={{
                  width: "120px",
                  height: "170px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

            </div>

          )}

          <button
            type="submit"
            className="btn btn-primary me-2"
          >
            {editingId
              ? "Update Movie"
              : "Add Movie"}
          </button>

          {editingId && (

            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>

          )}

        </form>

      </div>

      <div className="card p-4">

        <h5>All Movies</h5>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead>

              <tr>
                <th>ID</th>
                <th>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {movies.map((movie) => (

                <tr key={movie.id}>

                  <td>{movie.id}</td>

                  <td>

                    {movie.imageUrl && (

                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        style={{
                          width: "55px",
                          height: "75px",
                          objectFit: "cover",
                          borderRadius: "5px"
                        }}
                      />

                    )}

                  </td>

                  <td>{movie.title}</td>

                  <td>{movie.genre}</td>

                  <td>{movie.language}</td>

                  <td>
                    {movie.duration} min
                  </td>

                  <td>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        editMovie(movie)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteMovie(movie.id)
                      }
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

export default AdminMovies;