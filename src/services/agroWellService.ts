import apiService from "./apiService";
import { AgricultureFact } from "../types";
import { API_ENDPOINTS } from "../config/api.config";
import { AxiosResponse } from "axios";

class AgroWellService {
  async createAgricultureFact(data: AgricultureFact): Promise<AgricultureFact> {
    try {
      const response: AxiosResponse<AgricultureFact> = await apiService.post(
        API_ENDPOINTS.AGRICULTURE_FACT.BASE,
        data
      );

      console.log("Agriculture fact created:", response.data);
      return response.data; // ✅ response.data is the actual record
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create agriculture fact"
      );
    }
  }

  async deleteAgricultureFact(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.AGRICULTURE_FACT.BY_ID(id));
  }
}

export default new AgroWellService();
