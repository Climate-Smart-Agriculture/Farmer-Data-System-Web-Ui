import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import agroWellService from "../../services/agroWellService";
import { AgroWell, FormErrors } from "../../types";
import "../farmer/Farmer.css";
import "./AgroWell.css";

const initialFormData: AgroWell = {
  farmerId: "",
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
  cultivations: "",
  isReplicatedCrop: 0,
  extentHa: undefined,
  noOfPlant: undefined,
  totalCultivationCostRs: undefined,
  agrowellDepreciationPerSeasonCostRs: undefined,
  totalCostRs: undefined,
  yieldKg: undefined,
  incomeRs: undefined,
  netIncomeRs: undefined,
  irrigationMethod: "",
};

const AgroWellForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<AgroWell>({
    ...initialFormData,
    farmerId: farmerIdFromUrl,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadAgroWell(id);
    }
  }, [id, isEditing]);

  const loadAgroWell = async (wellId: string) => {
    setIsLoading(true);
    try {
      const data = await agroWellService.getAgroWellById(wellId);
      setFormData(data);
    } catch (error: any) {
      console.error("Failed to load agro well data:", error);
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
        await agroWellService.updateAgroWell(id, formData);
      } else {
        await agroWellService.createAgroWell(formData);
      }
      navigate("/agro-wells");
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to save agro well data" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading agro well details...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isEditing ? "Edit Agro Well" : "Add New Agro Well"}</h2>
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
              <label>Program Name</label>
              <input
                type="text"
                name="programName"
                value={formData.programName || ""}
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

        {/* Cultivation Information */}
        <div className="form-section">
          <h3 className="form-section-title">Cultivation Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Cultivations</label>
              <input
                type="text"
                name="cultivations"
                value={formData.cultivations || ""}
                onChange={handleChange}
                placeholder="e.g., Rice, Vegetables"
              />
            </div>
            <div className="form-group">
              <label>Irrigation Method</label>
              <input
                type="text"
                name="irrigationMethod"
                value={formData.irrigationMethod || ""}
                onChange={handleChange}
                placeholder="e.g., Drip, Sprinkler"
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
              <label>Number of Plants</label>
              <input
                type="number"
                name="noOfPlant"
                value={formData.noOfPlant || ""}
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

        {/* Yield & Production */}
        <div className="form-section">
          <h3 className="form-section-title">Yield & Production</h3>
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
          </div>
        </div>

        {/* Cost Information */}
        <div className="form-section">
          <h3 className="form-section-title">Cost Information</h3>
          <div className="form-row">
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
            <div className="form-group">
              <label>Agrowell Depreciation per Season (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="agrowellDepreciationPerSeasonCostRs"
                value={formData.agrowellDepreciationPerSeasonCostRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Total Cost (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="totalCostRs"
                value={formData.totalCostRs || ""}
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
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/agro-wells")}
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

export default AgroWellForm;
