import apiService from './apiService';
import { Equipment, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../config/api.config';

class EquipmentService {
  async getEquipmentByFarmer(farmerId: string): Promise<Equipment[]> {
    try {
      const response = await apiService.get<ApiResponse<Equipment[]>>(
        API_ENDPOINTS.EQUIPMENT.BY_FARMER(farmerId)
      );
      return response.data || [];
    } catch (error) {
      throw new Error('Failed to fetch equipment');
    }
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    try {
      const response = await apiService.get<ApiResponse<Equipment>>(
        API_ENDPOINTS.EQUIPMENT.BY_ID(id)
      );
      if (response.data) {
        return response.data;
      }
      throw new Error('Equipment not found');
    } catch (error) {
      throw new Error('Failed to fetch equipment details');
    }
  }

  async createEquipment(equipment: Equipment): Promise<Equipment> {
    try {
      const response = await apiService.post<ApiResponse<Equipment>>(
        API_ENDPOINTS.EQUIPMENT.BASE,
        equipment
      );
      if (response.data) {
        return response.data;
      }
      throw new Error('Failed to create equipment');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create equipment');
    }
  }

  async updateEquipment(id: string, equipment: Partial<Equipment>): Promise<Equipment> {
    try {
      const response = await apiService.put<ApiResponse<Equipment>>(
        API_ENDPOINTS.EQUIPMENT.BY_ID(id),
        equipment
      );
      if (response.data) {
        return response.data;
      }
      throw new Error('Failed to update equipment');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update equipment');
    }
  }

  async deleteEquipment(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.EQUIPMENT.BY_ID(id));
    } catch (error) {
      throw new Error('Failed to delete equipment');
    }
  }
}

const equipmentService = new EquipmentService();
export default equipmentService;
