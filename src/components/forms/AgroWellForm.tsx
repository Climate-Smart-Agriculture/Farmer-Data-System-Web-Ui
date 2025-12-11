import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import agroWellService from "../../services/agroWellService";
import farmerService from "../../services/farmerService";
import { AgroWell, Farmer, FormErrors } from "../../types";
import { validateAgroWellForm } from "../../utils/validation";
import "../farmer/Farmer.css";

const AgroWellForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [formData, setFormData] = useState<AgroWell>({
    farmerId: searchParams.get("farmerId") || "",
    wellType: "",
    depth: 0,
    diameter: 0,
    constructionDate: "",
    waterLevel: 0,
    waterQuality: "",
    usageType: "",
    status: "",
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
    const numericFields = ["depth", "diameter", "waterLevel"];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validateAgroWellForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await agroWellService.createAgroWell(formData);
      navigate("/agro-wells");
    } catch (err: any) {
      setApiError(err.message || "Failed to save agro well");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Add Agro Well</h2>
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
            <label htmlFor="wellType">Well Type *</label>
            <input
              type="text"
              id="wellType"
              name="wellType"
              value={formData.wellType}
              onChange={handleChange}
              className={errors.wellType ? "error" : ""}
              disabled={isLoading}
            />
            {errors.wellType && (
              <span className="error-message">{errors.wellType}</span>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="depth">Depth (m) *</label>
            <input
              type="number"
              id="depth"
              name="depth"
              value={formData.depth}
              onChange={handleChange}
              className={errors.depth ? "error" : ""}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
            {errors.depth && (
              <span className="error-message">{errors.depth}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="diameter">Diameter (m)</label>
            <input
              type="number"
              id="diameter"
              name="diameter"
              value={formData.diameter}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="waterLevel">Water Level (m)</label>
            <input
              type="number"
              id="waterLevel"
              name="waterLevel"
              value={formData.waterLevel}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="usageType">Usage Type *</label>
            <select
              id="usageType"
              name="usageType"
              value={formData.usageType}
              onChange={handleChange}
              className={errors.usageType ? "error" : ""}
              disabled={isLoading}
            >
              <option value="">Select Usage Type</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Drinking">Drinking</option>
              <option value="Both">Both</option>
            </select>
            {errors.usageType && (
              <span className="error-message">{errors.usageType}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? "error" : ""}
              disabled={isLoading}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
            {errors.status && (
              <span className="error-message">{errors.status}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="constructionDate">Construction Date</label>
            <input
              type="date"
              id="constructionDate"
              name="constructionDate"
              value={formData.constructionDate}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="waterQuality">Water Quality</label>
            <input
              type="text"
              id="waterQuality"
              name="waterQuality"
              value={formData.waterQuality}
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
            onClick={() => navigate("/agro-wells")}
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
            {isLoading ? "Saving..." : "Save Agro Well"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgroWellForm;
