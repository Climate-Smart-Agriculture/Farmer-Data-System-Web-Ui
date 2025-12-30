import apiService from "./apiService";
import { CSAAgriculture, CSAAgricultureSearch, ApiResponse } from "../types";
import { API_ENDPOINTS } from "../config/api.config";

class CSAAgricultureService {
  async getAllCSAAgriculture(
    page: number = 0,
    pageSize: number = 10,
    filter?: Partial<CSAAgriculture>
  ): Promise<CSAAgricultureSearch> {
    try {
      const response = await apiService.post<ApiResponse<CSAAgricultureSearch>>(
        `${API_ENDPOINTS.CSA_AGRICULTURE.SEARCH}?page=${page}&pageSize=${pageSize}`,
        filter || {}
      );
      return response.data || { totalCount: 0, csaAgricultureData: [] };
    } catch (error) {
      throw new Error("Failed to fetch CSA agriculture records");
    }
  }

  async getCSAAgricultureByFarmer(farmerId: string): Promise<CSAAgriculture[]> {
    try {
      const response = await apiService.get<ApiResponse<CSAAgriculture[]>>(
        API_ENDPOINTS.CSA_AGRICULTURE.BY_FARMER(farmerId)
      );
      return response.data || [];
    } catch (error) {
      throw new Error("Failed to fetch CSA agriculture records");
    }
  }

  async getCSAAgricultureById(id: string): Promise<CSAAgriculture> {
    try {
      const response = await apiService.get<ApiResponse<CSAAgriculture>>(
        API_ENDPOINTS.CSA_AGRICULTURE.BY_ID(id)
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("CSA agriculture record not found");
    } catch (error) {
      throw new Error("Failed to fetch CSA agriculture details");
    }
  }

  async createCSAAgriculture(
    csaAgriculture: CSAAgriculture
  ): Promise<CSAAgriculture> {
    try {
      const response = await apiService.post<ApiResponse<CSAAgriculture>>(
        API_ENDPOINTS.CSA_AGRICULTURE.BASE,
        csaAgriculture
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to create CSA agriculture record");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create CSA agriculture record"
      );
    }
  }

  async updateCSAAgriculture(
    id: string,
    csaAgriculture: Partial<CSAAgriculture>
  ): Promise<CSAAgriculture> {
    try {
      const response = await apiService.put<ApiResponse<CSAAgriculture>>(
        API_ENDPOINTS.CSA_AGRICULTURE.BY_ID(id),
        csaAgriculture
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Failed to update CSA agriculture record");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to update CSA agriculture record"
      );
    }
  }

  async deleteCSAAgriculture(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.CSA_AGRICULTURE.BY_ID(id));
    } catch (error) {
      throw new Error("Failed to delete CSA agriculture record");
    }
  }
}

const csaAgricultureService = new CSAAgricultureService();
export default csaAgricultureService;
