import apiService from './apiService';
import { HomeGarden, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../config/api.config';

class HomeGardenService {
  async getHomeGardensByFarmer(farmerId: string): Promise<HomeGarden[]> {
    try {
      const response = await apiService.get<ApiResponse<HomeGarden[]>>(
        API_ENDPOINTS.HOME_GARDEN.BY_FARMER(farmerId)
      );
      return response.data || [];
    } catch (error) {
      throw new Error('Failed to fetch home gardens');
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
      throw new Error('Home garden not found');
    } catch (error) {
      throw new Error('Failed to fetch home garden details');
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
      throw new Error('Failed to create home garden');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create home garden');
    }
  }

  async updateHomeGarden(id: string, homeGarden: Partial<HomeGarden>): Promise<HomeGarden> {
    try {
      const response = await apiService.put<ApiResponse<HomeGarden>>(
        API_ENDPOINTS.HOME_GARDEN.BY_ID(id),
        homeGarden
      );
      if (response.data) {
        return response.data;
      }
      throw new Error('Failed to update home garden');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update home garden');
    }
  }

  async deleteHomeGarden(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.HOME_GARDEN.BY_ID(id));
    } catch (error) {
      throw new Error('Failed to delete home garden');
    }
  }
}

const homeGardenService = new HomeGardenService();
export default homeGardenService;
