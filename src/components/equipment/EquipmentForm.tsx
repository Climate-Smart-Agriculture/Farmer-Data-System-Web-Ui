import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import equipmentService from "../../services/equipmentService";
import { Equipment, FormErrors } from "../../types";
import "../farmer/Farmer.css";
import "./Equipment.css";

const initialFormData: Equipment = {
  farmer: "",
  year: undefined,
  programName: "",
  district: "",
  dsdDivision: "",
  ascDivision: "",
  cascadeName: "",
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
  equipmentName: "",
  isReplicated: 0,
  noOfEquipment: undefined,
  extentHa: undefined,
  stepApprovalNumber: "",
  unitPriceRs: undefined,
  totalProjectCostRs: undefined,
  farmerCostRs: undefined,
  provinceCode: "",
};

const EquipmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Equipment>({
    ...initialFormData,
    farmer: farmerIdFromUrl || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadEquipment(id);
    }
  }, [id, isEditing]);

  const loadEquipment = async (equipmentId: string) => {
    setIsLoading(true);
    try {
      const equipment = await equipmentService.getEquipmentById(equipmentId);
      setFormData(equipment);
    } catch (error: any) {
      console.error("Failed to load equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const farmerId = formData.farmer;
    if (!isEditing && !farmerId) {
      newErrors.farmer = "Farmer ID is required";
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
    if (!formData.equipmentName?.trim()) {
      newErrors.equipmentName = "Equipment name is required";
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
        await equipmentService.updateEquipment(id, formData);
      } else {
        await equipmentService.createEquipment(formData);
      }
      navigate("/equipment");
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to save equipment" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading equipment details...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isEditing ? "Edit Equipment" : "Add New Equipment"}</h2>
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
                  name="farmer"
                  value={formData.farmer || ""}
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
          </div>
        </div>

        {/* Equipment Details */}
        <div className="form-section">
          <h3 className="form-section-title">Equipment Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Equipment Name *</label>
              <input
                type="text"
                name="equipmentName"
                value={formData.equipmentName || ""}
                onChange={handleChange}
                className={errors.equipmentName ? "error" : ""}
              />
              {errors.equipmentName && (
                <span className="error-message">{errors.equipmentName}</span>
              )}
            </div>
            <div className="form-group">
              <label>Number of Equipment</label>
              <input
                type="number"
                name="noOfEquipment"
                value={formData.noOfEquipment || ""}
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
              <label>Step Approval Number</label>
              <input
                type="text"
                name="stepApprovalNumber"
                value={formData.stepApprovalNumber || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="checkbox-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isReplicated"
                name="isReplicated"
                checked={formData.isReplicated === 1}
                onChange={handleChange}
              />
              <label htmlFor="isReplicated">Replicated</label>
            </div>
          </div>
        </div>

        {/* Cost Information */}
        <div className="form-section">
          <h3 className="form-section-title">Cost Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Unit Price (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="unitPriceRs"
                value={formData.unitPriceRs || ""}
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
              <label>Farmer Cost (Rs)</label>
              <input
                type="number"
                step="0.01"
                name="farmerCostRs"
                value={formData.farmerCostRs || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/equipment")}
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

export default EquipmentForm;
