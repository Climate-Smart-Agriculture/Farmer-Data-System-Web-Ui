// Authentication Types
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
  role?: string;
}

// Farmer Types
export interface Farmer {
  farmerId?: string;
  nic: string;
  fullName: string;
  address: string;
  contactNumber: string;
  email?: string;
  gender?: string;
  district?: string;
  villageName?: string;
  ascDivision?: string;
  dsdDivision?: string;
  isDisabled?: number;
  isWomanHeadedHousehold?: number;
  isSamurdhiBeneficiary?: number;
}

export interface FarmerSearch {
  totalCount: number;
  farmers: Farmer[];
}

// Equipment Types
export interface Equipment {
  equipmentId?: string;
  farmer?: string;
  year?: number;
  programName?: string;
  district?: string;
  dsdDivision?: string;
  ascDivision?: string;
  cascadeName?: string;
  farmerOrganizationName?: string;
  aiRange?: string;
  gramaNiladhariDivision?: string;
  villageName?: string;
  farmerName?: string;
  address?: string;
  nicNumber?: string;
  telephoneNumber?: string;
  isFemale?: number;
  isMale?: number;
  equipmentName?: string;
  isReplicated?: number;
  noOfEquipment?: number;
  extentHa?: number;
  stepApprovalNumber?: string;
  unitPriceRs?: number;
  totalProjectCostRs?: number;
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
  homeGardenId?: string;
  farmerId?: string;
  year?: number;
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
  farmerName?: string;
  address?: string;
  nicNumber?: string;
  telephoneNumber?: string;
  isFemale?: number;
  isMale?: number;
  isSamurdhiBeneficiary?: number;
  isWomanHeadedHousehold?: number;
  isDisabled?: number;
  isCsaConducted?: number;
  isIecConducted?: number;
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
}

export interface HomeGardenSearch {
  totalCount: number;
  homeGardens: HomeGarden[];
}

// CSA Agriculture Types
export interface CSAAgriculture {
  csaAgricultureId?: string;
  farmerId?: string;
  year?: number;
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
  farmerName?: string;
  address?: string;
  nicNumber?: string;
  telephoneNumber?: string;
  isFemale?: number;
  isMale?: number;
  isSamurdhiBeneficiary?: number;
  isWomanHeadedHousehold?: number;
  isDisabled?: number;
  cropType?: string;
  isReplicatedCrop?: number;
  grownIrrigatedPaddyIndicator?: number;
  grownRainfedPaddyIndicator?: number;
  grownIrrigatedHighlandIndicator?: number;
  grownRainfedHighlandIndicator?: number;
  csaCropDiversification?: number;
  csaSeedProduction?: number;
  csaInterseason?: number;
  csaMicroIrrigation?: number;
  csaHomeGardening?: number;
  csaAgronomicInterventions?: number;
  csaTrainingReceived?: number;
  iecConducted?: number;
  ftsTraining?: number;
  fbsTraining?: number;
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
  yieldIncreasePercent?: number;
  baselinePriceRsPerKg?: number;
  baselineValuePerHaRs?: number;
  productivityValuePerHaRs?: number;
  incrementalProductivityValueRs?: number;
  cdiScore?: number;
  croppingIntensityPercent?: number;
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
  agroWellId?: string;
  farmerId?: string;
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
  farmerName?: string;
  address?: string;
  nicNumber?: string;
  telephoneNumber?: string;
  isFemale?: number;
  isMale?: number;
  isSamurdhiBeneficiary?: number;
  isWomanHeadedHousehold?: number;
  isDisabled?: number;
  cultivations?: string;
  isReplicatedCrop?: number;
  extentHa?: number;
  noOfPlant?: number;
  totalCultivationCostRs?: number;
  agrowellDepreciationPerSeasonCostRs?: number;
  totalCostRs?: number;
  yieldKg?: number;
  incomeRs?: number;
  netIncomeRs?: number;
  irrigationMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgroWellSearch {
  totalCount: number;
  agroWellData: AgroWell[];
}

// Poultry Farming Types
export interface PoultryFarming {
  poultryId?: string;
  farmerId?: string;
  year?: number;
  programName?: string;
  district?: string;
  dsdDivision?: string;
  ascDivision?: string;
  cascadeName?: string;
  tankOrVisName?: string;
  producerSociety?: string;
  agriculturalInstructor?: string;
  gramaNiladhariDivision?: string;
  villageName?: string;
  farmerName?: string;
  address?: string;
  nicNumber?: string;
  telephoneNumber?: string;
  isFemale?: number;
  isMale?: number;
  isSamurdhiBeneficiary?: number;
  isWomanHeadedHousehold?: number;
  isDisabled?: number;
  chicksGiven?: number;
  isCsaConducted?: number;
  isIecConducted?: number;
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
