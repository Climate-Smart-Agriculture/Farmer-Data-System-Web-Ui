// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    HEALTH: "/auth/health",
  },
  // Farmer endpoints
  FARMERS: {
    BASE: "/farmers",
    BY_ID: (id: string) => `/farmers/${id}`,
    BY_NIC: (nic: string) => `/farmers/nic/${nic}`,
    SEARCH: "/farmers/search",
  },
  // Equipment endpoints
  EQUIPMENT: {
    BASE: "/equipment",
    BY_ID: (id: string) => `/equipment/${id}`,
    BY_FARMER: (farmerId: string) => `/equipment/farmer/${farmerId}`,
    SEARCH: "/equipment/search",
  },
  // Home Garden endpoints
  HOME_GARDEN: {
    BASE: "/home-garden",
    BY_ID: (id: string) => `/home-garden/${id}`,
    BY_FARMER: (farmerId: string) => `/home-garden/farmer/${farmerId}`,
    SEARCH: "/home-garden/search",
  },
  // CSA Agriculture endpoints
  CSA_AGRICULTURE: {
    BASE: "/csa-agriculture",
    BY_ID: (id: string) => `/csa-agriculture/${id}`,
    BY_FARMER: (farmerId: string) => `/csa-agriculture/farmer/${farmerId}`,
    SEARCH: "/csa-agriculture/search",
  },
  // Agro Well endpoints
  AGRO_WELL: {
    BASE: "/agro-well",
    BY_ID: (id: string) => `/agro-well/${id}`,
    BY_FARMER: (farmerId: string) => `/agro-well/farmer/${farmerId}`,
    SEARCH: "/agro-well/search",
  },
  // Poultry Farming endpoints
  POULTRY: {
    BASE: "/poultry-farming",
    BY_ID: (id: string) => `/poultry-farming/${id}`,
    BY_FARMER: (farmerId: string) => `/poultry-farming/farmer/${farmerId}`,
    SEARCH: "/poultry-farming/search",
  },
};

export default API_CONFIG;
