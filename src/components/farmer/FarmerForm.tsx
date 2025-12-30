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
    nic: "",
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
    gender: "",
    district: "",
    villageName: "",
    ascDivision: "",
    dsdDivision: "",
    isDisabled: 0,
    isWomanHeadedHousehold: 0,
    isSamurdhiBeneficiary: 0,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
              <label htmlFor="nic">NIC *</label>
              <input
                type="text"
                id="nic"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="e.g., 123456789V or 200012345678"
                className={errors.nic ? "error" : ""}
                disabled={isLoading}
              />
              {errors.nic && (
                <span className="error-message">{errors.nic}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className={errors.fullName ? "error" : ""}
                disabled={isLoading}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
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
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="e.g., 0771234567"
                className={errors.contactNumber ? "error" : ""}
                disabled={isLoading}
              />
              {errors.contactNumber && (
                <span className="error-message">{errors.contactNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., farmer@example.com"
                className={errors.email ? "error" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
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
          </div>

          <div className="form-row">
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
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Additional Information</h3>
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
