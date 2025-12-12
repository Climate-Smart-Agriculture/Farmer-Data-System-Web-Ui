import apiService from "./apiService";
import { FarmerSearch, Farmer, ApiResponse, PaginatedResponse } from "../types";
import { API_ENDPOINTS } from "../config/api.config";

class FarmerService {
  // Get all farmers
  async getAllFarmers(
    page: number = 1,
    pageSize: number = 10,
    filter?: Farmer
  ): Promise<FarmerSearch> {
    try {
      const response = await apiService.post<any>(
        `${API_ENDPOINTS.FARMERS.SEARCH}?page=${page}&pageSize=${pageSize}`,
        filter
      );
      console.log("getAllFarmers response:", response);

      // API returns { data: { farmers: [...], totalCount: X }, message: "", success: true }
      if (
        response.data &&
        response.data.farmers &&
        Array.isArray(response.data.farmers)
      ) {
        return response.data;
      }

      // Fallback to empty array
      return {
        farmers: [],
        totalCount: 0,
      };
    } catch (error) {
      console.error("Error fetching farmers:", error);
      throw new Error("Failed to fetch farmers");
    }
  }

  // Get farmer by ID
  async getFarmerById(id: string): Promise<Farmer> {
    try {
      const response = await apiService.get<ApiResponse<Farmer>>(
        API_ENDPOINTS.FARMERS.BY_ID(id)
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Farmer not found");
    } catch (error) {
      throw new Error("Failed to fetch farmer details");
    }
  }

  // Create new farmer
  async createFarmer(farmer: Farmer): Promise<Farmer> {
    try {
      const response = await apiService.post<ApiResponse<Farmer>>(
        API_ENDPOINTS.FARMERS.BASE,
        farmer
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to create farmer");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create farmer"
      );
    }
  }

  // Update farmer
  async updateFarmer(id: string, farmer: Partial<Farmer>): Promise<Farmer> {
    try {
      const response = await apiService.put<ApiResponse<Farmer>>(
        API_ENDPOINTS.FARMERS.BY_ID(id),
        farmer
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to update farmer");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update farmer"
      );
    }
  }

  // Delete farmer
  async deleteFarmer(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.FARMERS.BY_ID(id));
    } catch (error) {
      throw new Error("Failed to delete farmer");
    }
  }
}

const farmerService = new FarmerService();
export default farmerService;
