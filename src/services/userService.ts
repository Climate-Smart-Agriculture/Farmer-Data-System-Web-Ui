import apiService from "./apiService";
import { ManagedUser, CreateUserPayload, UpdateUserPayload } from "../types";
import { API_ENDPOINTS } from "../config/api.config";

class UserService {
  // Get all users
  async getAllUsers(): Promise<ManagedUser[]> {
    try {
      const response = await apiService.get<any>(API_ENDPOINTS.USERS.BASE);
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  // Get user by ID
  async getUserById(id: number): Promise<ManagedUser> {
    try {
      const response = await apiService.get<any>(API_ENDPOINTS.USERS.BY_ID(id));
      if (response.data) {
        return response.data;
      }
      throw new Error("User not found");
    } catch (error) {
      throw new Error("Failed to fetch user details");
    }
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<ManagedUser[]> {
    try {
      const response = await apiService.get<any>(
        API_ENDPOINTS.USERS.BY_ROLE(role),
      );
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching users by role:", error);
      throw new Error("Failed to fetch users by role");
    }
  }

  // Create new user
  async createUser(user: CreateUserPayload): Promise<ManagedUser> {
    try {
      const response = await apiService.post<any>(
        API_ENDPOINTS.USERS.BASE,
        user,
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to create user");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  }

  // Update user
  async updateUser(id: number, user: UpdateUserPayload): Promise<ManagedUser> {
    try {
      const response = await apiService.put<any>(
        API_ENDPOINTS.USERS.BY_ID(id),
        user,
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to update user");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.USERS.BY_ID(id));
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
}

const userService = new UserService();
export default userService;
