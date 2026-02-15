import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { validateLoginForm } from "../../utils/validation";
import { FormErrors } from "../../types";
import "./Login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Validate form
    const formData = { username, password };
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      console.log("Attempting login...");
      await login({ username, password });
      console.log("Login successful, navigating to dashboard...");
      // Navigate immediately after login completes
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setApiError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left side - Image panel */}
        <div className="login-image-panel">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80"
            alt="Lush green paddy field"
            className="login-bg-image"
          />
          <div className="login-image-overlay" />
          <div className="login-image-content">
            <div className="login-brand-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M7 12c0-2 1.5-5 5-5s5 3 5 5-1.5 5-5 5-5-3-5-5z" />
                <path d="M12 7v10" />
                <path d="M7 12h10" />
              </svg>
            </div>
            <h1>Farmer Data Management System</h1>
            <p>Climate Smart Irrigated Agriculture Project</p>
            <div className="login-image-features">
              <div className="login-feature">
                <span className="login-feature-dot" />
                Real-time farmer data tracking
              </div>
              <div className="login-feature">
                <span className="login-feature-dot" />
                Agriculture analytics &amp; insights
              </div>
              <div className="login-feature">
                <span className="login-feature-dot" />
                Equipment &amp; resource management
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form panel */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>
                Welcome Back
                <img
                  src="https://flagcdn.com/w40/lk.png"
                  srcSet="https://flagcdn.com/w80/lk.png 2x"
                  alt="Sri Lanka"
                  className="login-flag"
                />
              </h2>
              <p>Sign in to your account to continue</p>
            </div>

            {apiError && (
              <div className="error-message api-error">
                <svg
                  className="error-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={errors.username ? "error" : ""}
                    disabled={isLoading}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "error" : ""}
                    disabled={isLoading}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>&copy; 2026 CSIAP &middot; All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
