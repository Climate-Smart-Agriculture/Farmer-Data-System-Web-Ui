// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: User;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

// Farmer Types
export interface Farmer {
  id?: string;
  nic: string;
  firstName: string;
  lastName: string;
  address: string;
  contactNumber: string;
  email?: string;
  district?: string;
  gsDivision?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Equipment Types
export interface Equipment {
  id?: string;
  farmerId: string;
  equipmentType: string;
  brand?: string;
  model?: string;
  purchaseDate?: string;
  condition?: string;
  quantity: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Home Garden Types
export interface HomeGarden {
  id?: string;
  farmerId: string;
  gardenSize: number; // in square meters
  cropTypes: string[];
  irrigationMethod?: string;
  organicFertilizer: boolean;
  chemicalFertilizer: boolean;
  startDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// CSA Agriculture Types
export interface CSAAgriculture {
  id?: string;
  farmerId: string;
  landSize: number; // in acres
  cropType: string;
  season: string;
  irrigationSystem?: string;
  waterSource?: string;
  fertilizationType?: string;
  expectedYield?: number;
  actualYield?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Agro Well Types
export interface AgroWell {
  id?: string;
  farmerId: string;
  wellType: string;
  depth: number; // in meters
  diameter?: number; // in meters
  constructionDate?: string;
  waterLevel?: number; // in meters
  waterQuality?: string;
  usageType: string;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Poultry Farming Types
export interface PoultryFarming {
  id?: string;
  farmerId: string;
  poultryType: string; // chicken, duck, etc.
  numberOfBirds: number;
  farmingMethod: string; // free-range, cage, etc.
  purpose: string; // eggs, meat, both
  feedType?: string;
  housingType?: string;
  startDate?: string;
  vaccinationStatus?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Form Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
