import apiService from "./apiService";
import { PoultryFarming, PoultryFarmingSearch, ApiResponse } from "../types";
import { API_ENDPOINTS } from "../config/api.config";

class PoultryService {
  async getAllPoultry(
    page: number,
    pageSize: number,
    filter?: Partial<PoultryFarming>
  ): Promise<PoultryFarmingSearch> {
    try {
      const response = await apiService.post<ApiResponse<PoultryFarmingSearch>>(
        `${API_ENDPOINTS.POULTRY.SEARCH}?page=${page}&pageSize=${pageSize}`,
        filter || {}
      );
      return response.data || { totalCount: 0, poultryFarmingData: [] };
    } catch (error) {
      throw new Error("Failed to fetch poultry farming records");
    }
  }

  async getPoultryByFarmer(farmerId: string): Promise<PoultryFarming[]> {
    try {
      const response = await apiService.get<ApiResponse<PoultryFarming[]>>(
        API_ENDPOINTS.POULTRY.BY_FARMER(farmerId)
      );
      return response.data || [];
    } catch (error) {
      throw new Error("Failed to fetch poultry farming records");
    }
  }

  async getPoultryById(id: string): Promise<PoultryFarming> {
    try {
      const response = await apiService.get<ApiResponse<PoultryFarming>>(
        API_ENDPOINTS.POULTRY.BY_ID(id)
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Poultry farming record not found");
    } catch (error) {
      throw new Error("Failed to fetch poultry farming details");
    }
  }

  async createPoultry(poultry: PoultryFarming): Promise<PoultryFarming> {
    try {
      const response = await apiService.post<ApiResponse<PoultryFarming>>(
        API_ENDPOINTS.POULTRY.BASE,
        poultry
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to create poultry farming record");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create poultry farming record"
      );
    }
  }

  async updatePoultry(
    id: string,
    poultry: Partial<PoultryFarming>
  ): Promise<PoultryFarming> {
    try {
      const response = await apiService.put<ApiResponse<PoultryFarming>>(
        API_ENDPOINTS.POULTRY.BY_ID(id),
        poultry
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to update poultry farming record");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to update poultry farming record"
      );
    }
  }

  async deletePoultry(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.POULTRY.BY_ID(id));
    } catch (error) {
      throw new Error("Failed to delete poultry farming record");
    }
  }
}

const poultryService = new PoultryService();
export default poultryService;
