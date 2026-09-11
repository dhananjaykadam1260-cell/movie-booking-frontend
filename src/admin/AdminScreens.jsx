import { useEffect, useState } from "react";
import api from "../services/api";

function AdminScreens() {

  const [screens, setScreens] = useState([]);
  const [theatres, setTheatres] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    theatreId: "",
    screenName: "",
    totalSeats: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {

      const [screensRes, theatresRes] = await Promise.all([
        api.get("/screens"),
        api.get("/theatres")
      ]);

      setScreens(screensRes.data);
      setTheatres(theatresRes.data);

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

  const saveScreen = async (e) => {

    e.preventDefault();

    try {

      const screenData = {
        screenName: form.screenName,
        totalSeats: Number(form.totalSeats)
      };

      if (editingId) {

        await api.put(
          `/screens/${editingId}?theatreId=${form.theatreId}`,
          screenData
        );

        alert("Screen updated successfully");

      } else {

        await api.post(
          `/screens?theatreId=${form.theatreId}`,
          screenData
        );

        alert("Screen added successfully");
      }

      resetForm();

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save screen"
      );
    }
  };

  const editScreen = (screen) => {

    setEditingId(screen.id);

    setForm({
      theatreId: String(screen.theatre?.id || ""),
      screenName: screen.screenName,
      totalSeats: screen.totalSeats
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteScreen = async (id) => {

    const confirmDelete =
      window.confirm("Are you sure you want to delete this screen?");

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/screens/${id}`);

      alert("Screen deleted successfully");

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Cannot delete screen because shows are assigned to it"
      );
    }
  };

  const resetForm = () => {

    setEditingId(null);

    setForm({
      theatreId: "",
      screenName: "",
      totalSeats: ""
    });
  };

  return (
    <div>

      <h2 className="mb-4">Manage Screens</h2>

      <div className="card p-4 mb-4">

        <h5>
          {editingId ? "Edit Screen" : "Add Screen"}
        </h5>

        <form onSubmit={saveScreen}>

          <div className="row">

            <div className="col-md-4 mb-3">

              <label>Theatre</label>

              <select
                className="form-control"
                name="theatreId"
                value={form.theatreId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Theatre
                </option>

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

              <label>Screen Name</label>

              <input
                type="text"
                className="form-control"
                name="screenName"
                value={form.screenName}
                onChange={handleChange}
                placeholder="Example: Screen 1"
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label>Total Seats</label>

              <input
                type="number"
                className="form-control"
                name="totalSeats"
                value={form.totalSeats}
                onChange={handleChange}
                min="1"
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary me-2"
          >
            {editingId ? "Update Screen" : "Add Screen"}
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

        <h5>All Screens</h5>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead>

              <tr>
                <th>ID</th>
                <th>Screen</th>
                <th>Theatre</th>
                <th>City</th>
                <th>Total Seats</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {screens.map((screen) => (

                <tr key={screen.id}>

                  <td>{screen.id}</td>

                  <td>{screen.screenName}</td>

                  <td>
                    {screen.theatre?.name}
                  </td>

                  <td>
                    {screen.theatre?.city}
                  </td>

                  <td>
                    {screen.totalSeats}
                  </td>

                  <td>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editScreen(screen)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteScreen(screen.id)}
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

export default AdminScreens;