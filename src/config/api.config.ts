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
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
  },
  // Farmer endpoints
  FARMERS: {
    BASE: "/farmers",
    BY_ID: (id: string) => `/farmers/${id}`,
    SEARCH: "/farmers/search",
  },
  // Equipment endpoints
  EQUIPMENT: {
    BASE: "/equipment",
    BY_ID: (id: string) => `/equipment/${id}`,
    BY_FARMER: (farmerId: string) => `/equipment/farmer/${farmerId}`,
  },
  // Home Garden endpoints
  HOME_GARDEN: {
    BASE: "/home-gardens",
    BY_ID: (id: string) => `/home-gardens/${id}`,
    BY_FARMER: (farmerId: string) => `/home-gardens/farmer/${farmerId}`,
  },
  // CSA Agriculture endpoints
  CSA_AGRICULTURE: {
    BASE: "/csa-agriculture",
    BY_ID: (id: string) => `/csa-agriculture/${id}`,
    BY_FARMER: (farmerId: string) => `/csa-agriculture/farmer/${farmerId}`,
  },
  // Agro Well endpoints
  AGRO_WELL: {
    BASE: "/agro-wells",
    BY_ID: (id: string) => `/agro-wells/${id}`,
    BY_FARMER: (farmerId: string) => `/agro-wells/farmer/${farmerId}`,
  },
  // Poultry Farming endpoints
  POULTRY: {
    BASE: "/poultry-farming",
    BY_ID: (id: string) => `/poultry-farming/${id}`,
    BY_FARMER: (farmerId: string) => `/poultry-farming/farmer/${farmerId}`,
  },
};

export default API_CONFIG;
