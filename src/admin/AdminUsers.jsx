import { useEffect, useState } from "react";
import api from "../services/api";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      const response = await api.get("/auth/users");

      setUsers(response.data);

    } catch (error) {

      console.error(error);

      alert("Failed to load users");

    } finally {

      setLoading(false);
    }
  };

  if (loading) {
    return <h5>Loading users...</h5>;
  }

  return (
    <div>

      <h2 className="mb-4">
        Manage Users
      </h2>

      <div className="card p-4">

        <h5 className="mb-3">
          Registered Users
        </h5>

        {users.length === 0 ? (

          <p>No users found.</p>

        ) : (

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>
                      {user.id}
                    </td>

                    <td>
                      {user.name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>

                      <span
                        className={`badge ${
                          user.role === "ADMIN"
                            ? "bg-danger"
                            : "bg-primary"
                        }`}
                      >
                        {user.role}
                      </span>

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

export default AdminUsers;