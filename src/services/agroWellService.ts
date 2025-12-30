import apiService from "./apiService";
import { AgroWell, AgroWellSearch, ApiResponse } from "../types";
import { API_ENDPOINTS } from "../config/api.config";

class AgroWellService {
  async getAllAgroWells(
    page: number = 0,
    pageSize: number = 10,
    filter?: Partial<AgroWell>
  ): Promise<AgroWellSearch> {
    try {
      const response = await apiService.post<ApiResponse<AgroWellSearch>>(
        `${API_ENDPOINTS.AGRO_WELL.SEARCH}?page=${page}&pageSize=${pageSize}`,
        filter || {}
      );
      return response.data || { totalCount: 0, agroWellData: [] };
    } catch (error) {
      throw new Error("Failed to fetch agro wells");
    }
  }

  async getAgroWellsByFarmer(farmerId: string): Promise<AgroWell[]> {
    try {
      const response = await apiService.get<ApiResponse<AgroWell[]>>(
        API_ENDPOINTS.AGRO_WELL.BY_FARMER(farmerId)
      );
      return response.data || [];
    } catch (error) {
      throw new Error("Failed to fetch agro wells");
    }
  }

  async getAgroWellById(id: string): Promise<AgroWell> {
    try {
      const response = await apiService.get<ApiResponse<AgroWell>>(
        API_ENDPOINTS.AGRO_WELL.BY_ID(id)
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Agro well not found");
    } catch (error) {
      throw new Error("Failed to fetch agro well details");
    }
  }

  async createAgroWell(agroWell: AgroWell): Promise<AgroWell> {
    try {
      const response = await apiService.post<ApiResponse<AgroWell>>(
        API_ENDPOINTS.AGRO_WELL.BASE,
        agroWell
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to create agro well");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create agro well"
      );
    }
  }

  async updateAgroWell(
    id: string,
    agroWell: Partial<AgroWell>
  ): Promise<AgroWell> {
    try {
      const response = await apiService.put<ApiResponse<AgroWell>>(
        API_ENDPOINTS.AGRO_WELL.BY_ID(id),
        agroWell
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to update agro well");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update agro well"
      );
    }
  }

  async deleteAgroWell(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.AGRO_WELL.BY_ID(id));
    } catch (error) {
      throw new Error("Failed to delete agro well");
    }
  }
}

const agroWellService = new AgroWellService();
export default agroWellService;
