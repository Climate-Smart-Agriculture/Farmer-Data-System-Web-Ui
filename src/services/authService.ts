import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { LoginCredentials, AuthResponse, User } from "../types";
import { API_CONFIG, API_ENDPOINTS } from "../config/api.config";

const TOKEN_KEY = "jwt_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

class AuthService {
  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Store refresh token
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // Store user info
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Get user info
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log(
        "Making login request to:",
        `${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`
      );
      const response = await axios.post<AuthResponse>(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials
      );

      console.log("Login response:", response.data);
      const { data } = response.data;

      if (data && data.token) {
        console.log("Storing token:", data.token);
        this.setToken(data.token);
      } else {
        console.warn("No token in response");
      }

      return response.data;
    } catch (error) {
      console.error("Login request error:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }

  // Logout
  logout(): void {
    this.removeToken();
  }

  // Get current user from token
  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) {
      console.log("No token found");
      return null;
    }

    try {
      const decoded = jwtDecode<{
        exp: number;
        id?: string;
        sub?: string;
        username?: string;
        email?: string;
        role?: string;
      }>(token);
      console.log("Decoded token:", decoded);

      const user = {
        id: decoded.id || decoded.sub || "unknown",
        username: decoded.username || decoded.sub || "unknown",
        email: decoded.email,
        role: decoded.role,
      };
      console.log("Returning user:", user);
      return user;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await axios.post<AuthResponse>(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken },
        {
          headers: API_CONFIG.headers,
          timeout: API_CONFIG.timeout,
        }
      );

      const { token } = response.data.data;
      if (token) {
        this.setToken(token);
        return token;
      }

      return null;
    } catch (error) {
      this.removeToken();
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
