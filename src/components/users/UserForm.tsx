import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import { CreateUserPayload, UpdateUserPayload, UserRole } from "../../types";
import "./UserManagement.css";

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "GN" as UserRole,
    enabled: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (currentUser?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }

    if (isEditMode && id) {
      loadUser(parseInt(id));
    }
  }, [id, isEditMode, currentUser, navigate]);

  const loadUser = async (userId: number) => {
    setIsFetching(true);
    try {
      const user = await userService.getUserById(userId);
      setFormData({
        username: user.username,
        password: "", // Don't pre-fill password
        email: user.email,
        fullName: user.fullName || "",
        role: user.role,
        enabled: user.enabled,
      });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to load user");
    } finally {
      setIsFetching(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!isEditMode && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear field error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      if (isEditMode && id) {
        const updatePayload: UpdateUserPayload = {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName || undefined,
          role: formData.role,
          enabled: formData.enabled,
        };
        // Only include password if changed
        if (formData.password) {
          updatePayload.password = formData.password;
        }
        await userService.updateUser(parseInt(id), updatePayload);
      } else {
        const createPayload: CreateUserPayload = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
        };
        await userService.createUser(createPayload);
      }
      navigate("/users");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save user");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="loading-spinner">Loading user...</div>;
  }

  return (
    <div className="user-form-container">
      <h2>{isEditMode ? "Edit User" : "Create New User"}</h2>

      {submitError && <div className="alert alert-error">{submitError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
          {errors.username && (
            <div className="error-text">{errors.username}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password {isEditMode ? "(leave blank to keep current)" : "*"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={
              isEditMode
                ? "Leave blank to keep current password"
                : "Enter password"
            }
          />
          {errors.password && (
            <div className="error-text">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="ADMIN">Admin</option>
            <option value="AG">AG</option>
            <option value="GN">GN</option>
          </select>
          {errors.role && <div className="error-text">{errors.role}</div>}
          <div
            style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}
          >
            Hierarchy: Admin &gt; AG &gt; GN
          </div>
        </div>

        {isEditMode && (
          <div className="form-group">
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                name="enabled"
                checked={formData.enabled}
                onChange={handleChange}
                style={{ width: "auto" }}
              />
              Account Enabled
            </label>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update User"
                : "Create User"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/users")}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
