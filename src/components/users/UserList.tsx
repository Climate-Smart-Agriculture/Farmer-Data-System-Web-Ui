import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import { ManagedUser } from "../../types";
import "./UserManagement.css";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only admin can access
    if (currentUser?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
    loadUsers();
  }, [currentUser, navigate]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userService.deleteUser(deleteTarget.userId);
      setSuccess(`User "${deleteTarget.username}" deleted successfully`);
      setDeleteTarget(null);
      loadUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      setDeleteTarget(null);
    }
  };

  const filteredUsers = roleFilter
    ? users.filter((u) => u.role === roleFilter)
    : users;

  if (isLoading) {
    return <div className="loading-spinner">Loading users...</div>;
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <Link to="/users/new" className="btn btn-primary">
          + Add User
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <label style={{ fontWeight: 500 }}>Filter by role:</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: "0.4rem 0.75rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="AG">AG</option>
          <option value="GN">GN</option>
        </select>
        <span style={{ color: "#666", fontSize: "0.9rem" }}>
          ({filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""})
        </span>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>
                  <strong>{user.username}</strong>
                </td>
                <td>{user.fullName || "-"}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${user.enabled ? "active" : "disabled"}`}
                  >
                    {user.enabled ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <div className="actions-cell">
                    <Link
                      to={`/users/${user.userId}/edit`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTarget(user)}
                      disabled={user.username === currentUser?.username}
                      title={
                        user.username === currentUser?.username
                          ? "Cannot delete your own account"
                          : "Delete user"
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete user{" "}
              <strong>{deleteTarget.username}</strong>? This action cannot be
              undone.
            </p>
            <div className="confirm-dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
