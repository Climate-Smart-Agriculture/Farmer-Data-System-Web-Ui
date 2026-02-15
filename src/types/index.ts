// Authentication Types
export type UserRole = "ADMIN" | "AG" | "GN";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  username: string;
  role?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role?: UserRole;
}

// User Management Types
export interface ManagedUser {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  email?: string;
  fullName?: string;
  role?: UserRole;
  enabled?: boolean;
}

// Farmer Types
export interface Farmer {
  farmerId?: number;
  farmerName: string;
  nicNumber: string;
  address?: string;
  telephoneNumber?: string;
  gender?: string;
  district?: string;
  villageName?: string;
  ascDivision?: string;
  dsdDivision?: string;
  aiRange?: string;
  gramaNiladhariDivision?: string;
  cascadeName?: string;
  tankOrVisName?: string;
  producerSociety?: string;
  farmerOrganizationName?: string;
  commandAreaHa?: number;
  isDisabled?: string;
  isWomanHeadedHousehold?: string;
  isSamurdhiBeneficiary?: string;
  isCsaConducted?: string;
  isIecConducted?: string;
  ftsTraining?: string;
  fbsTraining?: string;
  csaCropDiversification?: string;
  csaSeedProduction?: string;
  csaInterseason?: string;
  csaMicroIrrigation?: string;
  csaHomeGardening?: string;
  csaAgronomicInterventions?: string;
  provinceCode?: string;
  insertedAt?: string;
  updatedAt?: string;
}

export interface FarmerSearch {
  totalCount: number;
  farmers: Farmer[];
}

// Equipment Types
export interface Equipment {
  equipmentRecordPk?: number;
  recordId?: number;
  farmerId?: number;
  year?: string;
  programName?: string;
  district?: string;
  dsdDivision?: string;
  ascDivision?: string;
  cascadeName?: string;
  farmerOrganizationName?: string;
  aiRange?: string;
  gramaNiladhariDivision?: string;
  villageName?: string;
  equipmentName?: string;
  equipmentNameStandard?: string;
  isReplicated?: string;
  noOfEquipment?: number;
  descriptiveExtentHa?: string;
  extentHa?: number;
  stepApprovalNumber?: string;
  descriptiveUnitPriceRs?: string;
  unitPriceRs?: number;
  totalProjectCostRs?: number;
  descriptiveFarmerCostRs?: string;
  farmerCostRs?: number;
  provinceCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipmentSearch {
  totalCount: number;
  equipmentData: Equipment[];
}

// Home Garden Types
export interface HomeGarden {
  ehgRecordPk?: number;
  recordId?: number;
  farmerId?: number;
  year?: string;
  programName?: string;
  district?: string;
  dsdDivision?: string;
  ascDivision?: string;
  cascadeName?: string;
  tankOrVisName?: string;
  producerSociety?: string;
  aiRange?: string;
  gramaNiladhariDivision?: string;
  villageName?: string;
  extentHa?: number;
  seedPackCount?: number;
  bananaPlantsCount?: number;
  papayaPlantsCount?: number;
  passionfruitPlantsCount?: number;
  lemonPlantsCount?: number;
  compostBags25kgCount?: number;
  growBagsCount?: number;
  totalProjectCostRs?: number;
  vegetableProductionKg?: number;
  homeConsumptionKg?: number;
  shareWithNeighborsKg?: number;
  soldQuantityKg?: number;
  soldPriceRs?: number;
  incomeRs?: number;
  mangoCount?: number;
  orangeCount?: number;
  handSpadeCount?: number;
  handForkCount?: number;
  secateursCount?: number;
  pvcTank500mlCount?: number;
  wateringCanCount?: number;
  mulchingMatCount?: number;
  nurseryTraysCount?: number;
  blackPolytheneCount?: number;
  grossIncomeRs?: number;
  newCultivation1?: string;
  newCultivation2?: string;
  newCultivation3?: string;
  newCultivation4?: string;
  newCultivation5?: string;
  newCultivation6?: string;
  newCultivation7?: string;
  newCultivation8?: string;
  newCultivation9?: string;
  newCultivation10?: string;
  newCultivation11?: string;
  newCultivation12?: string;
  newCultivation13?: string;
  newCultivation14?: string;
  newCultivation15?: string;
  provinceCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeGardenSearch {
  totalCount: number;
  homeGardens: HomeGarden[];
}

// CSA Agriculture Types
export interface CSAAgriculture {
  csaRecordPk?: number;
  recordId?: number;
  farmerId?: number;
  year?: string;
  programName?: string;
  district?: string;
  dsdDivision?: string;
  ascDivision?: string;
  cascadeName?: string;
  tankOrVisName?: string;
  commandAreaHa?: string;
  producerSociety?: string;
  farmerOrganizationName?: string;
  aiRange?: string;
  gramaNiladhariDivision?: string;
  villageName?: string;
  cropType?: string;
  isReplicatedCrop?: string;
  grownIrrigatedPaddyIndicator?: string;
  grownRainfedPaddyIndicator?: string;
  grownIrrigatedHighlandIndicator?: string;
  grownRainfedHighlandIndicator?: string;
  csaCropDiversification?: string;
  csaSeedProduction?: string;
  csaInterseason?: string;
  csaMicroIrrigation?: string;
  csaHomeGardening?: string;
  csaAgronomicInterventions?: string;
  ftsTraining?: string;
  fbsTraining?: string;
  varietyName?: string;
  seedQuantityKg?: number;
  extentHa?: number;
  preLossesHa?: number;
  harvestedAreaHa?: number;
  seedUnitPriceRs?: number;
  projectSeedExpenseRs?: number;
  farmerContributionSeedRs?: number;
  totalSeedCostRs?: number;
  farmerCostRs?: number;
  totalCultivationCostRs?: number;
  postLossesKg?: number;
  yieldKg?: number;
  soldUnitPriceRs?: number;
  incomeRs?: number;
  netIncomeRs?: number;
  productivityKgPerHa?: number;
  baselineProductivityKgPerHa?: number;
  yieldIncreaseMt?: number;
  yieldIncreasePercent?: string;
  baselinePriceRsPerKg?: number;
  baselineValuePerHaRs?: number;
  productivityValuePerHaRs?: number;
  incrementalProductivityPercent?: string;
  cdiScore?: number;
  croppingIntensityPercent?: string;
  provinceCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CSAAgricultureSearch {
  totalCount: number;
  csaAgricultureData: CSAAgriculture[];
}

// Agro Well Types
export interface AgroWell {
  agroWellPk?: number;
  recordId?: number;
  farmerId?: number;
  year?: string;
  programName?: string;
  district?: string;
  dsdDivision?: string;
  ascDivision?: string;
  cascadeName?: string;
  tankOrVisName?: string;
  commandAreaHa?: number;
  producerSociety?: string;
  farmerOrganizationName?: string;
  aiRange?: string;
  gramaNiladhariDivision?: string;
  villageName?: string;
  cultivations?: string;
  isReplicatedCrop?: string;
  extentHa?: number;
  noOfPlant?: number;
  totalCultivationCostRs?: number;
  agrowellDepreciationPerSeasonCostRs?: number;
  totalCostRs?: number;
  yieldKg?: number;
  incomeRs?: number;
  netIncomeRs?: number;
  irrigationMethod?: string;
  provinceCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgroWellSearch {
  totalCount: number;
  agroWellData: AgroWell[];
}

// Poultry Farming Types
export interface PoultryFarming {
  poultryRecordPk?: number;
  recordId?: number;
  farmerId?: number;
  year?: string;
  programName?: string;
  district?: string;
  dsdDivision?: string;
  ascDivision?: string;
  cascadeName?: string;
  tankOrVisName?: string;
  producerSociety?: string;
  agriculturalInstructor?: string;
  gramaNiladhariDivision?: string;
  chicksGiven?: number;
  chickUnitPriceRs?: number;
  totalProjectCostRs?: number;
  farmerContributionRs?: number;
  totalCostRs?: number;
  deadChicks?: number;
  totalEggProduction?: number;
  flockSizeIncrement?: number;
  feedExpenditureRs?: number;
  eggUnitPriceRs?: number;
  incomeRs?: number;
  netIncomeRs?: number;
  provinceCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PoultryFarmingSearch {
  totalCount: number;
  poultryFarmingData: PoultryFarming[];
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
