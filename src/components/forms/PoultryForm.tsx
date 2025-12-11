import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import poultryService from "../../services/poultryService";
import farmerService from "../../services/farmerService";
import { PoultryFarming, Farmer, FormErrors } from "../../types";
import { validatePoultryForm } from "../../utils/validation";
import "../farmer/Farmer.css";

const PoultryForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [formData, setFormData] = useState<PoultryFarming>({
    farmerId: searchParams.get("farmerId") || "",
    poultryType: "",
    numberOfBirds: 0,
    farmingMethod: "",
    purpose: "",
    feedType: "",
    housingType: "",
    startDate: "",
    vaccinationStatus: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const response = await farmerService.getAllFarmers(1, 100);
      setFarmers(response.data);
    } catch (err) {
      setApiError("Failed to load farmers");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfBirds" ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validatePoultryForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await poultryService.createPoultry(formData);
      navigate("/poultry");
    } catch (err: any) {
      setApiError(err.message || "Failed to save poultry record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Add Poultry Farming Record</h2>
      </div>
      {apiError && <div className="error-banner">{apiError}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="farmerId">Farmer *</label>
            <select
              id="farmerId"
              name="farmerId"
              value={formData.farmerId}
              onChange={handleChange}
              className={errors.farmerId ? "error" : ""}
              disabled={isLoading}
            >
              <option value="">Select Farmer</option>
              {farmers.map((farmer) => (
                <option key={farmer.farmerId} value={farmer.farmerId}>
                  {farmer.nic} - {farmer.fullName}
                </option>
              ))}
            </select>
            {errors.farmerId && (
              <span className="error-message">{errors.farmerId}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="poultryType">Poultry Type *</label>
            <input
              type="text"
              id="poultryType"
              name="poultryType"
              value={formData.poultryType}
              onChange={handleChange}
              className={errors.poultryType ? "error" : ""}
              disabled={isLoading}
              placeholder="e.g., Chicken, Duck"
            />
            {errors.poultryType && (
              <span className="error-message">{errors.poultryType}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="numberOfBirds">Number of Birds *</label>
            <input
              type="number"
              id="numberOfBirds"
              name="numberOfBirds"
              value={formData.numberOfBirds}
              onChange={handleChange}
              className={errors.numberOfBirds ? "error" : ""}
              disabled={isLoading}
              min="1"
            />
            {errors.numberOfBirds && (
              <span className="error-message">{errors.numberOfBirds}</span>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="farmingMethod">Farming Method *</label>
            <select
              id="farmingMethod"
              name="farmingMethod"
              value={formData.farmingMethod}
              onChange={handleChange}
              className={errors.farmingMethod ? "error" : ""}
              disabled={isLoading}
            >
              <option value="">Select Method</option>
              <option value="Free-range">Free-range</option>
              <option value="Cage">Cage</option>
              <option value="Semi-intensive">Semi-intensive</option>
            </select>
            {errors.farmingMethod && (
              <span className="error-message">{errors.farmingMethod}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="purpose">Purpose *</label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className={errors.purpose ? "error" : ""}
              disabled={isLoading}
            >
              <option value="">Select Purpose</option>
              <option value="Eggs">Eggs</option>
              <option value="Meat">Meat</option>
              <option value="Both">Both</option>
            </select>
            {errors.purpose && (
              <span className="error-message">{errors.purpose}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="feedType">Feed Type</label>
            <input
              type="text"
              id="feedType"
              name="feedType"
              value={formData.feedType}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="housingType">Housing Type</label>
            <input
              type="text"
              id="housingType"
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="vaccinationStatus">Vaccination Status</label>
            <input
              type="text"
              id="vaccinationStatus"
              name="vaccinationStatus"
              value={formData.vaccinationStatus}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/poultry")}
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
            {isLoading ? "Saving..." : "Save Poultry Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoultryForm;
