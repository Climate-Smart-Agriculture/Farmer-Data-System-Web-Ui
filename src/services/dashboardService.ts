import apiService from "./apiService";
import { DashboardSummary, DistrictStatistics, ApiResponse } from "../types";
import { API_ENDPOINTS } from "../config/api.config";

class DashboardService {
  /**
   * Get overall dashboard summary (total counts across all domains).
   */
  async getSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiService.get<ApiResponse<DashboardSummary>>(
        API_ENDPOINTS.DASHBOARD.SUMMARY,
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("No summary data received");
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw new Error("Failed to fetch dashboard summary");
    }
  }

  /**
   * Get all district names that have farmer data.
   */
  async getDistricts(): Promise<string[]> {
    try {
      const response = await apiService.get<ApiResponse<string[]>>(
        API_ENDPOINTS.DASHBOARD.DISTRICTS,
      );
      if (response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw new Error("Failed to fetch districts");
    }
  }

  /**
   * Get statistics for all districts.
   */
  async getAllDistrictStatistics(): Promise<DistrictStatistics[]> {
    try {
      const response = await apiService.get<ApiResponse<DistrictStatistics[]>>(
        API_ENDPOINTS.DASHBOARD.DISTRICT_STATISTICS,
      );
      if (response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching district statistics:", error);
      throw new Error("Failed to fetch district statistics");
    }
  }

  /**
   * Get statistics for a specific district.
   */
  async getDistrictStatistics(district: string): Promise<DistrictStatistics> {
    try {
      const response = await apiService.get<ApiResponse<DistrictStatistics>>(
        API_ENDPOINTS.DASHBOARD.BY_DISTRICT(district),
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("No district statistics received");
    } catch (error) {
      console.error(`Error fetching statistics for ${district}:`, error);
      throw new Error(`Failed to fetch statistics for ${district}`);
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
