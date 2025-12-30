import apiService from "./apiService";
import { HomeGarden, HomeGardenSearch, ApiResponse } from "../types";
import { API_ENDPOINTS } from "../config/api.config";

class HomeGardenService {
  async getAllHomeGardens(
    page: number = 0,
    pageSize: number = 10,
    filter?: HomeGarden
  ): Promise<HomeGardenSearch> {
    try {
      const response = await apiService.post<any>(
        `${API_ENDPOINTS.HOME_GARDEN.SEARCH}?page=${page}&pageSize=${pageSize}`,
        filter
      );
      if (
        response.data &&
        response.data.homeGardens &&
        Array.isArray(response.data.homeGardens)
      ) {
        return response.data;
      }
      return {
        homeGardens: [],
        totalCount: 0,
      };
    } catch (error) {
      console.error("Error fetching home gardens:", error);
      throw new Error("Failed to fetch home gardens");
    }
  }

  async getHomeGardensByFarmer(farmerId: string): Promise<HomeGarden[]> {
    try {
      const response = await apiService.get<ApiResponse<HomeGarden[]>>(
        API_ENDPOINTS.HOME_GARDEN.BY_FARMER(farmerId)
      );
      return response.data || [];
    } catch (error) {
      throw new Error("Failed to fetch home gardens");
    }
  }

  async getHomeGardenById(id: string): Promise<HomeGarden> {
    try {
      const response = await apiService.get<ApiResponse<HomeGarden>>(
        API_ENDPOINTS.HOME_GARDEN.BY_ID(id)
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Home garden not found");
    } catch (error) {
      throw new Error("Failed to fetch home garden details");
    }
  }

  async createHomeGarden(homeGarden: HomeGarden): Promise<HomeGarden> {
    try {
      const response = await apiService.post<ApiResponse<HomeGarden>>(
        API_ENDPOINTS.HOME_GARDEN.BASE,
        homeGarden
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to create home garden");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create home garden"
      );
    }
  }

  async updateHomeGarden(
    id: string,
    homeGarden: Partial<HomeGarden>
  ): Promise<HomeGarden> {
    try {
      const response = await apiService.put<ApiResponse<HomeGarden>>(
        API_ENDPOINTS.HOME_GARDEN.BY_ID(id),
        homeGarden
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to update home garden");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update home garden"
      );
    }
  }

  async deleteHomeGarden(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.HOME_GARDEN.BY_ID(id));
    } catch (error) {
      throw new Error("Failed to delete home garden");
    }
  }
}

const homeGardenService = new HomeGardenService();
export default homeGardenService;
