import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import poultryService from "../../services/poultryService";
import { PoultryFarming, FormErrors } from "../../types";
import "../farmer/Farmer.css";
import "./Poultry.css";

const initialFormData: PoultryFarming = {
  poultryRecordPk: undefined,
  recordId: undefined,
  farmerId: undefined,
  year: String(new Date().getFullYear()),
  programName: "",
  district: "",
  dsdDivision: "",
  ascDivision: "",
  cascadeName: "",
  tankOrVisName: "",
  producerSociety: "",
  agriculturalInstructor: "",
  gramaNiladhariDivision: "",
  chicksGiven: undefined,
  chickUnitPriceRs: undefined,
  totalProjectCostRs: undefined,
  farmerContributionRs: undefined,
  totalCostRs: undefined,
  deadChicks: undefined,
  totalEggProduction: undefined,
  flockSizeIncrement: undefined,
  feedExpenditureRs: undefined,
  eggUnitPriceRs: undefined,
  incomeRs: undefined,
  netIncomeRs: undefined,
  provinceCode: "",
};

const PoultryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<PoultryFarming>({
    ...initialFormData,
    farmerId: farmerIdFromUrl ? Number(farmerIdFromUrl) : undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadPoultry(id);
    }
  }, [id, isEditing]);

  const loadPoultry = async (poultryId: string) => {
    setIsLoading(true);
    try {
      const data = await poultryService.getPoultryById(poultryId);
      setFormData(data);
    } catch (error: any) {
      console.error("Failed to load poultry farming data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isEditing && !formData.farmerId) {
      newErrors.farmerId = "Farmer ID is required";
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
    >,
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
        await poultryService.updatePoultry(id, formData);
      } else {
        await poultryService.createPoultry(formData);
      }
      navigate("/poultry");
    } catch (error: any) {
      setErrors({
        submit: error.message || "Failed to save poultry farming data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading poultry farming details...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>
          {isEditing
            ? "Edit Poultry Farming Record"
            : "Add New Poultry Farming Record"}
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
          </div>
          <div className="form-row">
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
              <label>Producer Society</label>
              <input
                type="text"
                name="producerSociety"
                value={formData.producerSociety || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Agricultural Instructor</label>
              <input
                type="text"
                name="agriculturalInstructor"
                value={formData.agriculturalInstructor || ""}
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
          </div>
        </div>

        {/* Poultry Details */}
        <div className="form-section">
          <h3 className="form-section-title">Poultry Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Chicks Given</label>
              <input
                type="number"
                name="chicksGiven"
                value={formData.chicksGiven || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Dead Chicks</label>
              <input
                type="number"
                name="deadChicks"
                value={formData.deadChicks || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Total Egg Production</label>
              <input
                type="number"
                name="totalEggProduction"
                value={formData.totalEggProduction || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Flock Size Increment</label>
              <input
                type="number"
                name="flockSizeIncrement"
                value={formData.flockSizeIncrement || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="form-section">
          <h3 className="form-section-title">Financial Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Chick Unit Price (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="chickUnitPriceRs"
                value={formData.chickUnitPriceRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Total Project Cost (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="totalProjectCostRs"
                value={formData.totalProjectCostRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Farmer Contribution (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="farmerContributionRs"
                value={formData.farmerContributionRs || ""}
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
          <div className="form-row">
            <div className="form-group">
              <label>Feed Expenditure (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="feedExpenditureRs"
                value={formData.feedExpenditureRs || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Egg Unit Price (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="eggUnitPriceRs"
                value={formData.eggUnitPriceRs || ""}
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
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/poultry")}
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

export default PoultryForm;
