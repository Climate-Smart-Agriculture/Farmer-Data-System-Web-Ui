import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import csaAgricultureService from "../../services/csaAgricultureService";
import farmerService from "../../services/farmerService";
import { CSAAgriculture, Farmer, FormErrors } from "../../types";
import { validateCSAAgricultureForm } from "../../utils/validation";
import "../farmer/Farmer.css";

const CSAAgricultureForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedFarmerId = searchParams.get("farmerId");

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [formData, setFormData] = useState<CSAAgriculture>({
    farmerId: preselectedFarmerId || "",
    landSize: 0,
    cropType: "",
    season: "",
    irrigationSystem: "",
    waterSource: "",
    fertilizationType: "",
    expectedYield: 0,
    actualYield: 0,
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
    const numericFields = ["landSize", "expectedYield", "actualYield"];
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

    const validationErrors = validateCSAAgricultureForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await csaAgricultureService.createCSAAgriculture(formData);
      navigate("/csa-agriculture");
    } catch (err: any) {
      setApiError(err.message || "Failed to save CSA agriculture record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Add CSA Agriculture Record</h2>
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
            <label htmlFor="landSize">Land Size (acres) *</label>
            <input
              type="number"
              id="landSize"
              name="landSize"
              value={formData.landSize}
              onChange={handleChange}
              className={errors.landSize ? "error" : ""}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
            {errors.landSize && (
              <span className="error-message">{errors.landSize}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cropType">Crop Type *</label>
            <input
              type="text"
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              className={errors.cropType ? "error" : ""}
              disabled={isLoading}
              placeholder="e.g., Rice, Paddy"
            />
            {errors.cropType && (
              <span className="error-message">{errors.cropType}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="season">Season *</label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              className={errors.season ? "error" : ""}
              disabled={isLoading}
            >
              <option value="">Select Season</option>
              <option value="Maha">Maha</option>
              <option value="Yala">Yala</option>
              <option value="Off-Season">Off-Season</option>
            </select>
            {errors.season && (
              <span className="error-message">{errors.season}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="irrigationSystem">Irrigation System</label>
            <input
              type="text"
              id="irrigationSystem"
              name="irrigationSystem"
              value={formData.irrigationSystem}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., Drip, Sprinkler"
            />
          </div>

          <div className="form-group">
            <label htmlFor="waterSource">Water Source</label>
            <input
              type="text"
              id="waterSource"
              name="waterSource"
              value={formData.waterSource}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., Well, Canal"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fertilizationType">Fertilization Type</label>
            <select
              id="fertilizationType"
              name="fertilizationType"
              value={formData.fertilizationType}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select Type</option>
              <option value="Organic">Organic</option>
              <option value="Chemical">Chemical</option>
              <option value="Both">Both</option>
              <option value="None">None</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="expectedYield">Expected Yield (kg)</label>
            <input
              type="number"
              id="expectedYield"
              name="expectedYield"
              value={formData.expectedYield}
              onChange={handleChange}
              className={errors.expectedYield ? "error" : ""}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
            {errors.expectedYield && (
              <span className="error-message">{errors.expectedYield}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="actualYield">Actual Yield (kg)</label>
            <input
              type="number"
              id="actualYield"
              name="actualYield"
              value={formData.actualYield}
              onChange={handleChange}
              className={errors.actualYield ? "error" : ""}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
            {errors.actualYield && (
              <span className="error-message">{errors.actualYield}</span>
            )}
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
            onClick={() => navigate("/csa-agriculture")}
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
            {isLoading ? "Saving..." : "Save CSA Agriculture"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CSAAgricultureForm;
