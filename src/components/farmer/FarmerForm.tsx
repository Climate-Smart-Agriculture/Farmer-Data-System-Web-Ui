import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import farmerService from "../../services/farmerService";
import { Farmer, FormErrors } from "../../types";
import { validateFarmerForm } from "../../utils/validation";
import "./Farmer.css";

const FarmerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Farmer>({
    farmerName: "",
    nicNumber: "",
    address: "",
    telephoneNumber: "",
    gender: "",
    district: "",
    villageName: "",
    ascDivision: "",
    dsdDivision: "",
    aiRange: "",
    gramaNiladhariDivision: "",
    cascadeName: "",
    tankOrVisName: "",
    producerSociety: "",
    farmerOrganizationName: "",
    commandAreaHa: undefined,
    isDisabled: "0",
    isWomanHeadedHousehold: "0",
    isSamurdhiBeneficiary: "0",
    isCsaConducted: "0",
    isIecConducted: "0",
    ftsTraining: "0",
    fbsTraining: "0",
    csaCropDiversification: "0",
    csaSeedProduction: "0",
    csaInterseason: "0",
    csaMicroIrrigation: "0",
    csaHomeGardening: "0",
    csaAgronomicInterventions: "0",
    provinceCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      loadFarmer(id);
    }
  }, [id, isEditMode]);

  const loadFarmer = async (farmerId: string) => {
    try {
      const farmer = await farmerService.getFarmerById(farmerId);
      setFormData(farmer);
    } catch (err: any) {
      setApiError(err.message || "Failed to load farmer details");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting farmer form");
    e.preventDefault();
    setApiError("");

    // Validate form
    const validationErrors = validateFarmerForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Form data is valid");
    setErrors({});
    setIsLoading(true);
    console.log("Saving farmer data:", formData);
    try {
      if (isEditMode && id) {
        await farmerService.updateFarmer(id, formData);
      } else {
        console.log("Creating farmer with data:", formData);
        await farmerService.createFarmer(formData);
      }
      navigate("/farmers");
    } catch (err: any) {
      setApiError(err.message || "Failed to save farmer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isEditMode ? "Edit Farmer" : "Add New Farmer"}</h2>
      </div>

      {apiError && <div className="error-banner">{apiError}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* Personal Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nicNumber">NIC Number *</label>
              <input
                type="text"
                id="nicNumber"
                name="nicNumber"
                value={formData.nicNumber}
                onChange={handleChange}
                placeholder="e.g., 123456789V or 200012345678"
                className={errors.nicNumber ? "error" : ""}
                disabled={isLoading}
              />
              {errors.nicNumber && (
                <span className="error-message">{errors.nicNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="farmerName">Farmer Name *</label>
              <input
                type="text"
                id="farmerName"
                name="farmerName"
                value={formData.farmerName}
                onChange={handleChange}
                placeholder="Enter farmer name"
                className={errors.farmerName ? "error" : ""}
                disabled={isLoading}
              />
              {errors.farmerName && (
                <span className="error-message">{errors.farmerName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? "error" : ""}
                disabled={isLoading}
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
              {errors.gender && (
                <span className="error-message">{errors.gender}</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Contact Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telephoneNumber">Telephone Number *</label>
              <input
                type="text"
                id="telephoneNumber"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleChange}
                placeholder="e.g., 0771234567"
                className={errors.telephoneNumber ? "error" : ""}
                disabled={isLoading}
              />
              {errors.telephoneNumber && (
                <span className="error-message">{errors.telephoneNumber}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className={errors.address ? "error" : ""}
                disabled={isLoading}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className={errors.address ? "error" : ""}
                disabled={isLoading}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="form-section">
          <h3 className="form-section-title">Location Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="district">District</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g., Colombo"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="villageName">Village Name</label>
              <input
                type="text"
                id="villageName"
                name="villageName"
                value={formData.villageName}
                onChange={handleChange}
                placeholder="Enter village name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="provinceCode">Province Code</label>
              <input
                type="text"
                id="provinceCode"
                name="provinceCode"
                value={formData.provinceCode}
                onChange={handleChange}
                placeholder="Enter province code"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dsdDivision">DSD Division</label>
              <input
                type="text"
                id="dsdDivision"
                name="dsdDivision"
                value={formData.dsdDivision}
                onChange={handleChange}
                placeholder="Divisional Secretariat Division"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ascDivision">ASC Division</label>
              <input
                type="text"
                id="ascDivision"
                name="ascDivision"
                value={formData.ascDivision}
                onChange={handleChange}
                placeholder="Agrarian Service Center Division"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="aiRange">AI Range</label>
              <input
                type="text"
                id="aiRange"
                name="aiRange"
                value={formData.aiRange}
                onChange={handleChange}
                placeholder="Agricultural Instructor Range"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gramaNiladhariDivision">
                Grama Niladhari Division
              </label>
              <input
                type="text"
                id="gramaNiladhariDivision"
                name="gramaNiladhariDivision"
                value={formData.gramaNiladhariDivision}
                onChange={handleChange}
                placeholder="Enter GN Division"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cascadeName">Cascade Name</label>
              <input
                type="text"
                id="cascadeName"
                name="cascadeName"
                value={formData.cascadeName}
                onChange={handleChange}
                placeholder="Enter cascade name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tankOrVisName">Tank or VIS Name</label>
              <input
                type="text"
                id="tankOrVisName"
                name="tankOrVisName"
                value={formData.tankOrVisName}
                onChange={handleChange}
                placeholder="Tank or Vil Irrigation Scheme name"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Organization Details Section */}
        <div className="form-section">
          <h3 className="form-section-title">Organization Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="producerSociety">Producer Society</label>
              <input
                type="text"
                id="producerSociety"
                name="producerSociety"
                value={formData.producerSociety}
                onChange={handleChange}
                placeholder="Enter producer society name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="farmerOrganizationName">
                Farmer Organization Name
              </label>
              <input
                type="text"
                id="farmerOrganizationName"
                name="farmerOrganizationName"
                value={formData.farmerOrganizationName}
                onChange={handleChange}
                placeholder="Enter farmer organization name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="commandAreaHa">Command Area (Ha)</label>
              <input
                type="number"
                id="commandAreaHa"
                name="commandAreaHa"
                value={formData.commandAreaHa || ""}
                onChange={handleChange}
                placeholder="Enter command area in hectares"
                disabled={isLoading}
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Agricultural Activities Section */}
        <div className="form-section">
          <h3 className="form-section-title">Agricultural Activities</h3>
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="isCsaConducted"
                name="isCsaConducted"
                checked={!!formData.isCsaConducted}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Conducted</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="isIecConducted"
                name="isIecConducted"
                checked={!!formData.isIecConducted}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">IEC Conducted</span>
            </label>
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="ftsTraining"
                name="ftsTraining"
                checked={!!formData.ftsTraining}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">FTS Training</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="fbsTraining"
                name="fbsTraining"
                checked={!!formData.fbsTraining}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">FBS Training</span>
            </label>
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="csaCropDiversification"
                name="csaCropDiversification"
                checked={!!formData.csaCropDiversification}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Crop Diversification</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="csaSeedProduction"
                name="csaSeedProduction"
                checked={!!formData.csaSeedProduction}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Seed Production</span>
            </label>
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="csaInterseason"
                name="csaInterseason"
                checked={!!formData.csaInterseason}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Interseason</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="csaMicroIrrigation"
                name="csaMicroIrrigation"
                checked={!!formData.csaMicroIrrigation}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Micro Irrigation</span>
            </label>
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="csaHomeGardening"
                name="csaHomeGardening"
                checked={!!formData.csaHomeGardening}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Home Gardening</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="csaAgronomicInterventions"
                name="csaAgronomicInterventions"
                checked={!!formData.csaAgronomicInterventions}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Agronomic Interventions</span>
            </label>
          </div>
        </div>

        {/* Personal Status Section */}
        <div className="form-section">
          <h3 className="form-section-title">Personal Status</h3>
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                id="isDisabled"
                name="isDisabled"
                checked={!!formData.isDisabled}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">Person with Disability</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="isWomanHeadedHousehold"
                name="isWomanHeadedHousehold"
                checked={!!formData.isWomanHeadedHousehold}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">Woman Headed Household</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                id="isSamurdhiBeneficiary"
                name="isSamurdhiBeneficiary"
                checked={!!formData.isSamurdhiBeneficiary}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">Samurdhi Beneficiary</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/farmers")}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Farmer"
                : "Add Farmer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmerForm;
