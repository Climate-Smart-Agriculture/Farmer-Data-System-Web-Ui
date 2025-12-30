import { FormErrors } from "../types";

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Sri Lankan format)
export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, "");
  // Sri Lankan format: +94 followed by 9 digits, or 0 followed by 9 digits
  const phoneRegex = /^(\+94[0-9]{9}|0[0-9]{9})$/;
  return phoneRegex.test(cleanPhone);
};

// NIC validation (Sri Lankan format)
export const validateNIC = (nic: string): boolean => {
  // Old format: 9 digits + V or X
  const oldFormat = /^[0-9]{9}[VvXx]$/;
  // New format: 12 digits
  const newFormat = /^[0-9]{12}$/;
  return oldFormat.test(nic) || newFormat.test(nic);
};

// Required field validation
export const validateRequired = (value: any): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

// Number validation
export const validateNumber = (
  value: any,
  min?: number,
  max?: number
): boolean => {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

// Date validation
export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// Farmer form validation
export const validateFarmerForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateRequired(data.nic)) {
    errors.nic = "NIC is required";
  } else if (!validateNIC(data.nic)) {
    errors.nic = "Invalid NIC format";
  }

  if (!validateRequired(data.fullName)) {
    errors.fullName = "Full name is required";
  }

  if (!validateRequired(data.address)) {
    errors.address = "Address is required";
  }

  if (!validateRequired(data.contactNumber)) {
    errors.contactNumber = "Contact number is required";
  } else if (!validatePhoneNumber(data.contactNumber)) {
    errors.contactNumber = "Invalid phone number format";
  }

  if (data.email && !validateEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  return errors;
};

// Equipment form validation
export const validateEquipmentForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateRequired(data.farmerId)) {
    errors.farmerId = "Farmer must be selected";
  }

  if (!validateRequired(data.equipmentType)) {
    errors.equipmentType = "Equipment type is required";
  }

  if (!validateRequired(data.quantity)) {
    errors.quantity = "Quantity is required";
  } else if (!validateNumber(data.quantity, 1)) {
    errors.quantity = "Quantity must be at least 1";
  }

  if (data.purchaseDate && !validateDate(data.purchaseDate)) {
    errors.purchaseDate = "Invalid date format";
  }

  return errors;
};

// Home Garden form validation
export const validateHomeGardenForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateRequired(data.farmerId)) {
    errors.farmerId = "Farmer must be selected";
  }

  if (!validateRequired(data.gardenSize)) {
    errors.gardenSize = "Garden size is required";
  } else if (!validateNumber(data.gardenSize, 0)) {
    errors.gardenSize = "Garden size must be a positive number";
  }

  if (!validateRequired(data.cropTypes) || data.cropTypes.length === 0) {
    errors.cropTypes = "At least one crop type is required";
  }

  if (data.startDate && !validateDate(data.startDate)) {
    errors.startDate = "Invalid date format";
  }

  return errors;
};

// CSA Agriculture form validation
export const validateCSAAgricultureForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateRequired(data.farmerId)) {
    errors.farmerId = "Farmer must be selected";
  }

  if (!validateRequired(data.landSize)) {
    errors.landSize = "Land size is required";
  } else if (!validateNumber(data.landSize, 0)) {
    errors.landSize = "Land size must be a positive number";
  }

  if (!validateRequired(data.cropType)) {
    errors.cropType = "Crop type is required";
  }

  if (!validateRequired(data.season)) {
    errors.season = "Season is required";
  }

  if (data.expectedYield && !validateNumber(data.expectedYield, 0)) {
    errors.expectedYield = "Expected yield must be a positive number";
  }

  if (data.actualYield && !validateNumber(data.actualYield, 0)) {
    errors.actualYield = "Actual yield must be a positive number";
  }

  return errors;
};

// Agro Well form validation
export const validateAgroWellForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateRequired(data.farmerId)) {
    errors.farmerId = "Farmer must be selected";
  }

  if (!validateRequired(data.wellType)) {
    errors.wellType = "Well type is required";
  }

  if (!validateRequired(data.depth)) {
    errors.depth = "Depth is required";
  } else if (!validateNumber(data.depth, 0)) {
    errors.depth = "Depth must be a positive number";
  }

  if (data.diameter && !validateNumber(data.diameter, 0)) {
    errors.diameter = "Diameter must be a positive number";
  }

  if (data.waterLevel && !validateNumber(data.waterLevel, 0)) {
    errors.waterLevel = "Water level must be a positive number";
  }

  if (!validateRequired(data.usageType)) {
    errors.usageType = "Usage type is required";
  }

  if (!validateRequired(data.status)) {
    errors.status = "Status is required";
  }

  if (data.constructionDate && !validateDate(data.constructionDate)) {
    errors.constructionDate = "Invalid date format";
  }

  return errors;
};

// Poultry Farming form validation
export const validatePoultryForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateRequired(data.farmerId)) {
    errors.farmerId = "Farmer must be selected";
  }

  if (!validateRequired(data.poultryType)) {
    errors.poultryType = "Poultry type is required";
  }

  if (!validateRequired(data.numberOfBirds)) {
    errors.numberOfBirds = "Number of birds is required";
  } else if (!validateNumber(data.numberOfBirds, 1)) {
    errors.numberOfBirds = "Number of birds must be at least 1";
  }

  if (!validateRequired(data.farmingMethod)) {
    errors.farmingMethod = "Farming method is required";
  }

  if (!validateRequired(data.purpose)) {
    errors.purpose = "Purpose is required";
  }

  if (data.startDate && !validateDate(data.startDate)) {
    errors.startDate = "Invalid date format";
  }

  return errors;
};

// Login form validation
export const validateLoginForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  if (!validateRequired(data.username)) {
    errors.username = "Username is required";
  }

  if (!validateRequired(data.password)) {
    errors.password = "Password is required";
  }

  return errors;
};

// Agriculture Fact form validation
export const validateAgricultureForm = (data: any): FormErrors => {
  const errors: FormErrors = {};

  // --- Program / Location details ---
  if (!validateRequired(data.seasonMonth)) {
    errors.seasonMonth = "Season / Month is required";
  }

  if (!validateRequired(data.district)) {
    errors.district = "District is required";
  }

  if (!validateRequired(data.dsdDivision)) {
    errors.dsdDivision = "DSD Division is required";
  }

  if (!validateRequired(data.ascDivision)) {
    errors.ascDivision = "ASC Division is required";
  }

  // --- Farmer details ---
  if (!validateRequired(data.nameofthefarmer)) {
    errors.nameofthefarmer = "Farmer name is required";
  }

  if (!validateRequired(data.address)) {
    errors.address = "Address is required";
  }

  if (!validateRequired(data.idno)) {
    errors.idno = "NIC number is required";
  } else if (!validateNIC(data.idno)) {
    errors.idno = "Invalid NIC format";
  }

  if (!validateRequired(data.telephoneno)) {
    errors.telephoneno = "Telephone number is required";
  } else if (!validatePhoneNumber(data.telephoneno)) {
    errors.telephoneno = "Invalid phone number format";
  }

  // --- Gender & social indicators (optional but validated if provided) ---
  if (data.female && data.male) {
    errors.gender = "Select either Male or Female, not both";
  }

  // --- Cultivation details ---
  if (!validateRequired(data.cropcultivated)) {
    errors.cropcultivated = "Crop cultivated is required";
  }

  if (!validateRequired(data.extentHa)) {
    errors.extentHa = "Extent (Ha) is required";
  } else if (!validateNumber(data.extentHa, 0)) {
    errors.extentHa = "Extent must be a positive number";
  }

  if (data.noOfPlant && !validateNumber(data.noOfPlant, 1)) {
    errors.noOfPlant = "Number of plants must be at least 1";
  }

  // --- Cost & income ---
  if (data.totalCultivationCostRs && !validateNumber(data.totalCultivationCostRs, 0)) {
    errors.totalCultivationCostRs = "Total cultivation cost must be positive";
  }

  if (
    data.agrowellDepreciationPerSeasonCostRs &&
    !validateNumber(data.agrowellDepreciationPerSeasonCostRs, 0)
  ) {
    errors.agrowellDepreciationPerSeasonCostRs =
      "Agro-well depreciation cost must be positive";
  }

  if (data.totalcost && !validateNumber(data.totalcost, 0)) {
    errors.totalcost = "Total cost must be positive";
  }

  if (data.yieldKg && !validateNumber(data.yieldKg, 0)) {
    errors.yieldKg = "Yield must be a positive number";
  }

  if (data.incomeRs && !validateNumber(data.incomeRs, 0)) {
    errors.incomeRs = "Income must be a positive number";
  }

  if (data.netIncomeRs && !validateNumber(data.netIncomeRs)) {
    errors.netIncomeRs = "Net income must be a valid number";
  }

  // --- Irrigation ---
  if (
    data.irrigationmethod !== undefined &&
    !validateNumber(data.irrigationmethod, 0)
  ) {
    errors.irrigationmethod = "Invalid irrigation method";
  }

  return errors;
};

