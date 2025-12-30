import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import csaAgricultureService from "../../services/csaAgricultureService";
import { CSAAgriculture, FormErrors } from "../../types";
import "../farmer/Farmer.css";
import "./CSAAgriculture.css";

const initialFormData: CSAAgriculture = {
  farmerId: "",
  year: undefined,
  programName: "",
  district: "",
  dsdDivision: "",
  ascDivision: "",
  cascadeName: "",
  tankOrVisName: "",
  commandAreaHa: undefined,
  producerSociety: "",
  farmerOrganizationName: "",
  aiRange: "",
  gramaNiladhariDivision: "",
  villageName: "",
  farmerName: "",
  address: "",
  nicNumber: "",
  telephoneNumber: "",
  isFemale: 0,
  isMale: 0,
  isSamurdhiBeneficiary: 0,
  isWomanHeadedHousehold: 0,
  isDisabled: 0,
  cropType: "",
  isReplicatedCrop: 0,
  grownIrrigatedPaddyIndicator: 0,
  grownRainfedPaddyIndicator: 0,
  grownIrrigatedHighlandIndicator: 0,
  grownRainfedHighlandIndicator: 0,
  csaCropDiversification: 0,
  csaSeedProduction: 0,
  csaInterseason: 0,
  csaMicroIrrigation: 0,
  csaHomeGardening: 0,
  csaAgronomicInterventions: 0,
  csaTrainingReceived: 0,
  iecConducted: 0,
  ftsTraining: 0,
  fbsTraining: 0,
  varietyName: "",
  seedQuantityKg: undefined,
  extentHa: undefined,
  preLossesHa: undefined,
  harvestedAreaHa: undefined,
  seedUnitPriceRs: undefined,
  projectSeedExpenseRs: undefined,
  farmerContributionSeedRs: undefined,
  totalSeedCostRs: undefined,
  farmerCostRs: undefined,
  totalCultivationCostRs: undefined,
  postLossesKg: undefined,
  yieldKg: undefined,
  soldUnitPriceRs: undefined,
  incomeRs: undefined,
  netIncomeRs: undefined,
  productivityKgPerHa: undefined,
  baselineProductivityKgPerHa: undefined,
  yieldIncreaseMt: undefined,
  yieldIncreasePercent: undefined,
  baselinePriceRsPerKg: undefined,
  baselineValuePerHaRs: undefined,
  productivityValuePerHaRs: undefined,
  incrementalProductivityValueRs: undefined,
  cdiScore: undefined,
  croppingIntensityPercent: undefined,
  provinceCode: "",
};

const CSAAgricultureForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CSAAgriculture>({
    ...initialFormData,
    farmerId: farmerIdFromUrl,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadCSAData(id);
    }
  }, [id, isEditing]);

  const loadCSAData = async (csaId: string) => {
    setIsLoading(true);
    try {
      const data = await csaAgricultureService.getCSAAgricultureById(csaId);
      setFormData(data);
    } catch (error: any) {
      console.error("Failed to load CSA agriculture data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isEditing && !formData.farmerId?.trim()) {
      newErrors.farmerId = "Farmer ID is required";
    }
    if (!formData.nicNumber?.trim()) {
      newErrors.nicNumber = "NIC is required";
    }
    if (!formData.farmerName?.trim()) {
      newErrors.farmerName = "Farmer name is required";
    }
    if (!formData.district?.trim()) {
      newErrors.district = "District is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        await csaAgricultureService.updateCSAAgriculture(id, formData);
      } else {
        await csaAgricultureService.createCSAAgriculture(formData);
      }
      navigate("/csa-agriculture");
    } catch (error: any) {
      setErrors({
        submit: error.message || "Failed to save CSA agriculture data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading CSA agriculture details...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>
          {isEditing ? "Edit CSA Agriculture" : "Add New CSA Agriculture"}
        </h2>
      </div>

      {errors.submit && <div className="error-banner">{errors.submit}</div>}

      <form className="form" onSubmit={handleSubmit}>
        {/* Farmer ID */}
        {farmerIdFromUrl && !isEditing && (
          <div className="form-section">
            <h3 className="form-section-title">Farmer Reference</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Farmer ID</label>
                <input
                  type="text"
                  name="farmerId"
                  value={formData.farmerId || ""}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                name="year"
                value={formData.year || ""}
                onChange={handleChange}
                placeholder="e.g., 2024"
              />
            </div>
            <div className="form-group">
              <label>Program Name</label>
              <input
                type="text"
                name="programName"
                value={formData.programName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Province Code</label>
              <input
                type="text"
                name="provinceCode"
                value={formData.provinceCode || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="form-section">
          <h3 className="form-section-title">Location Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>District *</label>
              <input
                type="text"
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
                className={errors.district ? "error" : ""}
              />
              {errors.district && (
                <span className="error-message">{errors.district}</span>
              )}
            </div>
            <div className="form-group">
              <label>DSD Division</label>
              <input
                type="text"
                name="dsdDivision"
                value={formData.dsdDivision || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>ASC Division</label>
              <input
                type="text"
                name="ascDivision"
                value={formData.ascDivision || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Cascade Name</label>
              <input
                type="text"
                name="cascadeName"
                value={formData.cascadeName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tank/Vis Name</label>
              <input
                type="text"
                name="tankOrVisName"
                value={formData.tankOrVisName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Command Area (Ha)</label>
              <input
                type="number"
                step="0.01"
                name="commandAreaHa"
                value={formData.commandAreaHa || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Producer Society</label>
              <input
                type="text"
                name="producerSociety"
                value={formData.producerSociety || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>AI Range</label>
              <input
                type="text"
                name="aiRange"
                value={formData.aiRange || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>GN Division</label>
              <input
                type="text"
                name="gramaNiladhariDivision"
                value={formData.gramaNiladhariDivision || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Village Name</label>
              <input
                type="text"
                name="villageName"
                value={formData.villageName || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="form-section">
          <h3 className="form-section-title">Farmer Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Farmer Name *</label>
              <input
                type="text"
                name="farmerName"
                value={formData.farmerName || ""}
                onChange={handleChange}
                className={errors.farmerName ? "error" : ""}
              />
              {errors.farmerName && (
                <span className="error-message">{errors.farmerName}</span>
              )}
            </div>
            <div className="form-group">
              <label>NIC Number *</label>
              <input
                type="text"
                name="nicNumber"
                value={formData.nicNumber || ""}
                onChange={handleChange}
                className={errors.nicNumber ? "error" : ""}
              />
              {errors.nicNumber && (
                <span className="error-message">{errors.nicNumber}</span>
              )}
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Telephone Number</label>
              <input
                type="text"
                name="telephoneNumber"
                value={formData.telephoneNumber || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Farmer Organization</label>
              <input
                type="text"
                name="farmerOrganizationName"
                value={formData.farmerOrganizationName || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="checkbox-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isFemale"
                name="isFemale"
                checked={formData.isFemale === 1}
                onChange={handleChange}
              />
              <label htmlFor="isFemale">Female</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isMale"
                name="isMale"
                checked={formData.isMale === 1}
                onChange={handleChange}
              />
              <label htmlFor="isMale">Male</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isSamurdhiBeneficiary"
                name="isSamurdhiBeneficiary"
                checked={formData.isSamurdhiBeneficiary === 1}
                onChange={handleChange}
              />
              <label htmlFor="isSamurdhiBeneficiary">
                Samurdhi Beneficiary
              </label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isWomanHeadedHousehold"
                name="isWomanHeadedHousehold"
                checked={formData.isWomanHeadedHousehold === 1}
                onChange={handleChange}
              />
              <label htmlFor="isWomanHeadedHousehold">
                Woman Headed Household
              </label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isDisabled"
                name="isDisabled"
                checked={formData.isDisabled === 1}
                onChange={handleChange}
              />
              <label htmlFor="isDisabled">Disabled</label>
            </div>
          </div>
        </div>

        {/* Crop Information */}
        <div className="form-section">
          <h3 className="form-section-title">Crop Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Crop Type</label>
              <input
                type="text"
                name="cropType"
                value={formData.cropType || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Variety Name</label>
              <input
                type="text"
                name="varietyName"
                value={formData.varietyName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Seed Quantity (Kg)</label>
              <input
                type="number"
                step="0.01"
                name="seedQuantityKg"
                value={formData.seedQuantityKg || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Extent (Ha)</label>
              <input
                type="number"
                step="0.01"
                name="extentHa"
                value={formData.extentHa || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Harvested Area (Ha)</label>
              <input
                type="number"
                step="0.01"
                name="harvestedAreaHa"
                value={formData.harvestedAreaHa || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Pre Losses (Ha)</label>
              <input
                type="number"
                step="0.01"
                name="preLossesHa"
                value={formData.preLossesHa || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="checkbox-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isReplicatedCrop"
                name="isReplicatedCrop"
                checked={formData.isReplicatedCrop === 1}
                onChange={handleChange}
              />
              <label htmlFor="isReplicatedCrop">Replicated Crop</label>
            </div>
          </div>
        </div>

        {/* Cultivation Indicators */}
        <div className="form-section">
          <h3 className="form-section-title">Cultivation Indicators</h3>
          <div className="checkbox-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="grownIrrigatedPaddyIndicator"
                name="grownIrrigatedPaddyIndicator"
                checked={formData.grownIrrigatedPaddyIndicator === 1}
                onChange={handleChange}
              />
              <label htmlFor="grownIrrigatedPaddyIndicator">
                Irrigated Paddy Grown
              </label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="grownRainfedPaddyIndicator"
                name="grownRainfedPaddyIndicator"
                checked={formData.grownRainfedPaddyIndicator === 1}
                onChange={handleChange}
              />
              <label htmlFor="grownRainfedPaddyIndicator">
                Rainfed Paddy Grown
              </label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="grownIrrigatedHighlandIndicator"
                name="grownIrrigatedHighlandIndicator"
                checked={formData.grownIrrigatedHighlandIndicator === 1}
                onChange={handleChange}
              />
              <label htmlFor="grownIrrigatedHighlandIndicator">
                Irrigated Highland Grown
              </label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="grownRainfedHighlandIndicator"
                name="grownRainfedHighlandIndicator"
                checked={formData.grownRainfedHighlandIndicator === 1}
                onChange={handleChange}
              />
              <label htmlFor="grownRainfedHighlandIndicator">
                Rainfed Highland Grown
              </label>
            </div>
          </div>
        </div>

        {/* CSA Interventions */}
        <div className="form-section">
          <h3 className="form-section-title">CSA Interventions</h3>
          <div className="checkbox-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="csaCropDiversification"
                name="csaCropDiversification"
                checked={formData.csaCropDiversification === 1}
                onChange={handleChange}
              />
              <label htmlFor="csaCropDiversification">
                Crop Diversification
              </label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="csaSeedProduction"
                name="csaSeedProduction"
                checked={formData.csaSeedProduction === 1}
                onChange={handleChange}
              />
              <label htmlFor="csaSeedProduction">Seed Production</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="csaInterseason"
                name="csaInterseason"
                checked={formData.csaInterseason === 1}
                onChange={handleChange}
              />
              <label htmlFor="csaInterseason">Interseason</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="csaMicroIrrigation"
                name="csaMicroIrrigation"
                checked={formData.csaMicroIrrigation === 1}
                onChange={handleChange}
              />
              <label htmlFor="csaMicroIrrigation">Micro Irrigation</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="csaHomeGardening"
                name="csaHomeGardening"
                checked={formData.csaHomeGardening === 1}
                onChange={handleChange}
              />
              <label htmlFor="csaHomeGardening">Home Gardening</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="csaAgronomicInterventions"
                name="csaAgronomicInterventions"
                checked={formData.csaAgronomicInterventions === 1}
                onChange={handleChange}
              />
              <label htmlFor="csaAgronomicInterventions">
                Agronomic Interventions
              </label>
            </div>
          </div>
        </div>

        {/* Training Information */}
        <div className="form-section">
          <h3 className="form-section-title">Training Information</h3>
          <div className="checkbox-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="csaTrainingReceived"
                name="csaTrainingReceived"
                checked={formData.csaTrainingReceived === 1}
                onChange={handleChange}
              />
              <label htmlFor="csaTrainingReceived">CSA Training Received</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="iecConducted"
                name="iecConducted"
                checked={formData.iecConducted === 1}
                onChange={handleChange}
              />
              <label htmlFor="iecConducted">IEC Conducted</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="ftsTraining"
                name="ftsTraining"
                checked={formData.ftsTraining === 1}
                onChange={handleChange}
              />
              <label htmlFor="ftsTraining">FTS Training</label>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="fbsTraining"
                name="fbsTraining"
                checked={formData.fbsTraining === 1}
                onChange={handleChange}
              />
              <label htmlFor="fbsTraining">FBS Training</label>
            </div>
          </div>
        </div>

        {/* Yield & Productivity */}
        <div className="form-section">
          <h3 className="form-section-title">Yield & Productivity</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Yield (Kg)</label>
              <input
                type="number"
                step="0.01"
                name="yieldKg"
                value={formData.yieldKg || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Post Losses (Kg)</label>
              <input
                type="number"
                step="0.01"
                name="postLossesKg"
                value={formData.postLossesKg || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Productivity (Kg/Ha)</label>
              <input
                type="number"
                step="0.01"
                name="productivityKgPerHa"
                value={formData.productivityKgPerHa || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Baseline Productivity (Kg/Ha)</label>
              <input
                type="number"
                step="0.01"
                name="baselineProductivityKgPerHa"
                value={formData.baselineProductivityKgPerHa || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Yield Increase (Mt)</label>
              <input
                type="number"
                step="0.01"
                name="yieldIncreaseMt"
                value={formData.yieldIncreaseMt || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Yield Increase (%)</label>
              <input
                type="number"
                step="0.01"
                name="yieldIncreasePercent"
                value={formData.yieldIncreasePercent || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>CDI Score</label>
              <input
                type="number"
                step="0.01"
                name="cdiScore"
                value={formData.cdiScore || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Cropping Intensity (%)</label>
              <input
                type="number"
                step="0.01"
                name="croppingIntensityPercent"
                value={formData.croppingIntensityPercent || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Cost Information */}
        <div className="form-section">
          <h3 className="form-section-title">Cost Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Seed Unit Price (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="seedUnitPriceRs"
                value={formData.seedUnitPriceRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Project Seed Expense (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="projectSeedExpenseRs"
                value={formData.projectSeedExpenseRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Farmer Contribution - Seed (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="farmerContributionSeedRs"
                value={formData.farmerContributionSeedRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Total Seed Cost (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="totalSeedCostRs"
                value={formData.totalSeedCostRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Farmer Cost (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="farmerCostRs"
                value={formData.farmerCostRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Total Cultivation Cost (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="totalCultivationCostRs"
                value={formData.totalCultivationCostRs || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Income Information */}
        <div className="form-section">
          <h3 className="form-section-title">Income Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Sold Unit Price (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="soldUnitPriceRs"
                value={formData.soldUnitPriceRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Income (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="incomeRs"
                value={formData.incomeRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Net Income (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="netIncomeRs"
                value={formData.netIncomeRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Baseline Price (Rs/Kg)</label>
              <input
                type="number"
                step="0.01"
                name="baselinePriceRsPerKg"
                value={formData.baselinePriceRsPerKg || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Baseline Value per Ha (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="baselineValuePerHaRs"
                value={formData.baselineValuePerHaRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Productivity Value per Ha (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="productivityValuePerHaRs"
                value={formData.productivityValuePerHaRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Incremental Productivity Value (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="incrementalProductivityValueRs"
                value={formData.incrementalProductivityValueRs || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/csa-agriculture")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CSAAgricultureForm;
