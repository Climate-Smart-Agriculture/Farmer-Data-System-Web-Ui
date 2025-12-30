import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import agroWellService from "../../services/agroWellService";
import { AgroWell } from "../../types";
import "../farmer/Farmer.css";
import "./AgroWell.css";

const AgroWellDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agroWell, setAgroWell] = useState<AgroWell | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadAgroWell(id);
    }
  }, [id]);

  const loadAgroWell = async (wellId: string) => {
    setIsLoading(true);
    try {
      const data = await agroWellService.getAgroWellById(wellId);
      setAgroWell(data);
    } catch (err: any) {
      setError(err.message || "Failed to load agro well details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this agro well record?")
    ) {
      return;
    }

    try {
      await agroWellService.deleteAgroWell(id);
      navigate("/agro-wells");
    } catch (err: any) {
      setError(err.message || "Failed to delete agro well record");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading agro well details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!agroWell) {
    return <div className="error-banner">Agro well record not found</div>;
  }

  const formatBoolean = (value?: number) => (value === 1 ? "Yes" : "No");
  const formatNumber = (value?: number) =>
    value !== undefined ? value.toLocaleString() : "-";
  const formatCurrency = (value?: number) =>
    value !== undefined ? `Rs. ${value.toLocaleString()}` : "-";
  const formatDecimal = (value?: number) =>
    value !== undefined ? value.toFixed(2) : "-";

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Agro Well Details</h2>
        <div className="action-buttons">
          <Link to={`/agro-wells/${id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-card">
        {/* Basic Information */}
        <div className="detail-section">
          <h3>Basic Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Agro Well ID</label>
              <span>{agroWell.agroWellId || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Program Name</label>
              <span>{agroWell.programName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="detail-section">
          <h3>Location Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>District</label>
              <span>{agroWell.district || "-"}</span>
            </div>
            <div className="detail-item">
              <label>DSD Division</label>
              <span>{agroWell.dsdDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>ASC Division</label>
              <span>{agroWell.ascDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Cascade Name</label>
              <span>{agroWell.cascadeName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Tank/Vis Name</label>
              <span>{agroWell.tankOrVisName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Command Area (Ha)</label>
              <span>{formatDecimal(agroWell.commandAreaHa)}</span>
            </div>
            <div className="detail-item">
              <label>Producer Society</label>
              <span>{agroWell.producerSociety || "-"}</span>
            </div>
            <div className="detail-item">
              <label>AI Range</label>
              <span>{agroWell.aiRange || "-"}</span>
            </div>
            <div className="detail-item">
              <label>GN Division</label>
              <span>{agroWell.gramaNiladhariDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Village Name</label>
              <span>{agroWell.villageName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="detail-section">
          <h3>Farmer Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Farmer Name</label>
              <span>{agroWell.farmerName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>NIC Number</label>
              <span>{agroWell.nicNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <span>{agroWell.address || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Telephone Number</label>
              <span>{agroWell.telephoneNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Farmer Organization</label>
              <span>{agroWell.farmerOrganizationName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Female</label>
              <span>{formatBoolean(agroWell.isFemale)}</span>
            </div>
            <div className="detail-item">
              <label>Male</label>
              <span>{formatBoolean(agroWell.isMale)}</span>
            </div>
            <div className="detail-item">
              <label>Samurdhi Beneficiary</label>
              <span>{formatBoolean(agroWell.isSamurdhiBeneficiary)}</span>
            </div>
            <div className="detail-item">
              <label>Woman Headed Household</label>
              <span>{formatBoolean(agroWell.isWomanHeadedHousehold)}</span>
            </div>
            <div className="detail-item">
              <label>Disabled</label>
              <span>{formatBoolean(agroWell.isDisabled)}</span>
            </div>
          </div>
        </div>

        {/* Cultivation Information */}
        <div className="detail-section">
          <h3>Cultivation Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Cultivations</label>
              <span>{agroWell.cultivations || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Irrigation Method</label>
              <span>{agroWell.irrigationMethod || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Replicated Crop</label>
              <span>{formatBoolean(agroWell.isReplicatedCrop)}</span>
            </div>
            <div className="detail-item">
              <label>Extent (Ha)</label>
              <span>{formatDecimal(agroWell.extentHa)}</span>
            </div>
            <div className="detail-item">
              <label>Number of Plants</label>
              <span>{formatNumber(agroWell.noOfPlant)}</span>
            </div>
          </div>
        </div>

        {/* Yield & Production */}
        <div className="detail-section">
          <h3>Yield & Production</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Yield (Kg)</label>
              <span>{formatNumber(agroWell.yieldKg)}</span>
            </div>
          </div>
        </div>

        {/* Cost Information */}
        <div className="detail-section">
          <h3>Cost Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Total Cultivation Cost</label>
              <span>{formatCurrency(agroWell.totalCultivationCostRs)}</span>
            </div>
            <div className="detail-item">
              <label>Agrowell Depreciation per Season</label>
              <span>
                {formatCurrency(agroWell.agrowellDepreciationPerSeasonCostRs)}
              </span>
            </div>
            <div className="detail-item">
              <label>Total Cost</label>
              <span>{formatCurrency(agroWell.totalCostRs)}</span>
            </div>
          </div>
        </div>

        {/* Income Information */}
        <div className="detail-section">
          <h3>Income Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Income</label>
              <span>{formatCurrency(agroWell.incomeRs)}</span>
            </div>
            <div className="detail-item">
              <label>Net Income</label>
              <span
                className={
                  agroWell.netIncomeRs && agroWell.netIncomeRs >= 0
                    ? "income-positive"
                    : "income-negative"
                }
              >
                {formatCurrency(agroWell.netIncomeRs)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          onClick={() => navigate("/agro-wells")}
          className="btn btn-outline"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default AgroWellDetail;
