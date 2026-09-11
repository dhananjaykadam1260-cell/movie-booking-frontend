import { useEffect, useState } from "react";
import api from "../services/api";

function AdminTheatres() {

  const [theatres, setTheatres] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: ""
  });

  useEffect(() => {
    loadTheatres();
  }, []);

  const loadTheatres = async () => {

    try {

      const response = await api.get("/theatres");

      setTheatres(response.data);

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

  const saveTheatre = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await api.put(
          `/theatres/${editingId}`,
          form
        );

        alert("Theatre updated successfully");

      } else {

        await api.post(
          "/theatres",
          form
        );

        alert("Theatre added successfully");
      }

      resetForm();

      loadTheatres();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save theatre"
      );
    }
  };

  const editTheatre = (theatre) => {

    setEditingId(theatre.id);

    setForm({
      name: theatre.name,
      city: theatre.city,
      address: theatre.address
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteTheatre = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this theatre?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/theatres/${id}`);

      alert("Theatre deleted successfully");

      loadTheatres();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Cannot delete theatre. Delete its shows and screens first."
      );
    }
  };

  const resetForm = () => {

    setEditingId(null);

    setForm({
      name: "",
      city: "",
      address: ""
    });
  };

  return (
    <div>

      <h2 className="mb-4">
        Manage Theatres
      </h2>

      <div className="card p-4 mb-4">

        <h5>
          {editingId
            ? "Edit Theatre"
            : "Add Theatre"}
        </h5>

        <form onSubmit={saveTheatre}>

          <div className="row">

            <div className="col-md-4 mb-3">

              <label>Theatre Name</label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: PVR Phoenix"
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label>City</label>

              <input
                type="text"
                className="form-control"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Example: Pune"
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label>Address</label>

              <input
                type="text"
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Theatre address"
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary me-2"
          >
            {editingId
              ? "Update Theatre"
              : "Add Theatre"}
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

        <h5>All Theatres</h5>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {theatres.map((theatre) => (

                <tr key={theatre.id}>

                  <td>{theatre.id}</td>

                  <td>{theatre.name}</td>

                  <td>{theatre.city}</td>

                  <td>{theatre.address}</td>

                  <td>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        editTheatre(theatre)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteTheatre(theatre.id)
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

export default AdminTheatres;