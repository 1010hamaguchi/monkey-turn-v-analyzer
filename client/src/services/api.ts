import axios from 'axios';
import { InputData, AnalysisResult, MachineParameter, Category, ApiResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

export const apiService = {
  async getMachineParameters(machineName: string): Promise<{ parameters: MachineParameter[], categories: Category[] }> {
    const response = await api.get<ApiResponse<{ parameters: MachineParameter[], categories: Category[] }>>(`/parameters/${encodeURIComponent(machineName)}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'パラメータの取得に失敗しました');
    }
    
    return response.data.data!;
  },

  async analyzeSettings(machineName: string, inputData: InputData): Promise<AnalysisResult> {
    const response = await api.post<ApiResponse<AnalysisResult>>(`/analyze/${encodeURIComponent(machineName)}`, inputData);
    
    if (!response.data.success) {
      throw new Error(response.data.error || '設定解析に失敗しました');
    }
    
    return response.data.data!;
  },

  async updateMachineParameter(
    machineName: string, 
    categoryName: string, 
    indicatorName: string, 
    settingNumber: number, 
    theoreticalValue: number, 
    weight?: number
  ): Promise<void> {
    const response = await api.put<ApiResponse<void>>(`/parameters/${encodeURIComponent(machineName)}`, {
      categoryName,
      indicatorName,
      settingNumber,
      theoreticalValue,
      weight
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'パラメータの更新に失敗しました');
    }
  }
};

export default apiService;