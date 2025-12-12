import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import equipmentService from "../../services/equipmentService";
import farmerService from "../../services/farmerService";
import { Equipment, Farmer, FormErrors } from "../../types";
import { validateEquipmentForm } from "../../utils/validation";
import "../farmer/Farmer.css";

const EquipmentForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedFarmerId = searchParams.get("farmerId");

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [formData, setFormData] = useState<Equipment>({
    farmerId: preselectedFarmerId || "",
    equipmentType: "",
    brand: "",
    model: "",
    purchaseDate: "",
    condition: "",
    quantity: 1,
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
      setFarmers(response.farmers);
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
      [name]: name === "quantity" ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validateEquipmentForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await equipmentService.createEquipment(formData);
      navigate("/equipment");
    } catch (err: any) {
      setApiError(err.message || "Failed to save equipment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Add Equipment</h2>
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
            <label htmlFor="equipmentType">Equipment Type *</label>
            <input
              type="text"
              id="equipmentType"
              name="equipmentType"
              value={formData.equipmentType}
              onChange={handleChange}
              className={errors.equipmentType ? "error" : ""}
              disabled={isLoading}
              placeholder="e.g., Tractor, Pump, Sprayer"
            />
            {errors.equipmentType && (
              <span className="error-message">{errors.equipmentType}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? "error" : ""}
              disabled={isLoading}
              min="1"
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="purchaseDate">Purchase Date</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className={errors.purchaseDate ? "error" : ""}
              disabled={isLoading}
            />
            {errors.purchaseDate && (
              <span className="error-message">{errors.purchaseDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
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
            onClick={() => navigate("/equipment")}
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
            {isLoading ? "Saving..." : "Save Equipment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;
