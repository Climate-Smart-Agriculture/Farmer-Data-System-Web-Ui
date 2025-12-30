import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgroWellService from "../../services/agroWellService";
import { AgricultureFact, FormErrors } from "../../types";
import { validateAgricultureForm } from "../../utils/validation";
import "../farmer/Farmer.css";

const AgricultureFactForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AgricultureFact>({
    seasonMonth: "",
    district: "",
    dsdDivision: "",
    ascDivision: "",
    cascadeName: "",
    tankOrVisName: "",
    commandAreaHa: 0,
    producerSociety: "",
    farmerOrganizationName: "",
    aiRange: "",
    gnd: "",
    nameofthefarmer: "",
    address: "",
    idno: "",
    telephoneno: "",
    female: "",
    male: "",
    samurdhi: "",
    womanhead: "",
    disable: "",
    cropcultivated: "",
    isReplicatedCrop: 0,
    extentHa: 0,
    noOfPlant: 0,
    totalCultivationCostRs: 0,
    agrowellDepreciationPerSeasonCostRs: 0,
    totalcost: 0,
    yieldKg: 0,
    incomeRs: 0,
    netIncomeRs: 0,
    irrigationmethod: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const numericFields = [
    "commandAreaHa",
    "extentHa",
    "noOfPlant",
    "totalCultivationCostRs",
    "agrowellDepreciationPerSeasonCostRs",
    "totalcost",
    "yieldKg",
    "incomeRs",
    "netIncomeRs",
    "irrigationmethod",
    "isReplicatedCrop",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked!");
    console.log("Form data:", formData);
  
    try {
      const savedRecord = await AgroWellService.createAgricultureFact(formData);
      console.log("Saved record:", savedRecord);
      alert("Record saved successfully!");
    } catch (err: any) {
      console.error("Error creating record:", err);
      alert(err.message || "Failed to save record");
    }
  };
  

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Add Agriculture Record</h2>
      </div>

      {apiError && <div className="error-banner">{apiError}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label>Season / Month *</label>
            <input
              name="seasonMonth"
              value={formData.seasonMonth}
              onChange={handleChange}
              className={errors.seasonMonth ? "error" : ""}
            />
            {errors.seasonMonth && <span className="error-message">{errors.seasonMonth}</span>}
          </div>

          <div className="form-group">
            <label>District *</label>
            <input
              name="district"
              value={formData.district}
              onChange={handleChange}
              className={errors.district ? "error" : ""}
            />
          </div>
        </div>

        {/* Add other fields as needed (text + numeric) */}
        {Object.keys(formData).map((field) => {
          if (["seasonMonth", "district"].includes(field)) return null; // already rendered
          const isNumeric = numericFields.includes(field);
          return (
            <div className="form-row" key={field}>
              <div className="form-group">
                <label>{field.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type={isNumeric ? "number" : "text"}
                  name={field}
                  value={formData[field as keyof AgricultureFact] as string | number}
                  onChange={handleChange}
                  min={isNumeric ? 0 : undefined}
                  step={isNumeric ? 0.01 : undefined}
                />
              </div>
            </div>
          );
        })}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/agriculture-facts")}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgricultureFactForm;
