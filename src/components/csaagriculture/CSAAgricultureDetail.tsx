import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import csaAgricultureService from "../../services/csaAgricultureService";
import { CSAAgriculture } from "../../types";
import "../farmer/Farmer.css";
import "./CSAAgriculture.css";

const CSAAgricultureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [csaData, setCSAData] = useState<CSAAgriculture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadCSAData(id);
    }
  }, [id]);

  const loadCSAData = async (csaId: string) => {
    setIsLoading(true);
    try {
      const data = await csaAgricultureService.getCSAAgricultureById(csaId);
      setCSAData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load CSA agriculture details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm(
        "Are you sure you want to delete this CSA agriculture record?"
      )
    ) {
      return;
    }

    try {
      await csaAgricultureService.deleteCSAAgriculture(id);
      navigate("/csa-agriculture");
    } catch (err: any) {
      setError(err.message || "Failed to delete CSA agriculture record");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading CSA agriculture details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!csaData) {
    return <div className="error-banner">CSA agriculture record not found</div>;
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
        <h2>CSA Agriculture Details</h2>
        <div className="action-buttons">
          <Link to={`/csa-agriculture/${id}/edit`} className="btn btn-primary">
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
              <label>CSA Agriculture ID</label>
              <span>{csaData.csaAgricultureId || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Year</label>
              <span>{csaData.year || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Program Name</label>
              <span>{csaData.programName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Province Code</label>
              <span>{csaData.provinceCode || "-"}</span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="detail-section">
          <h3>Location Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>District</label>
              <span>{csaData.district || "-"}</span>
            </div>
            <div className="detail-item">
              <label>DSD Division</label>
              <span>{csaData.dsdDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>ASC Division</label>
              <span>{csaData.ascDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Cascade Name</label>
              <span>{csaData.cascadeName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Tank/Vis Name</label>
              <span>{csaData.tankOrVisName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Command Area (Ha)</label>
              <span>{formatDecimal(csaData.commandAreaHa)}</span>
            </div>
            <div className="detail-item">
              <label>Producer Society</label>
              <span>{csaData.producerSociety || "-"}</span>
            </div>
            <div className="detail-item">
              <label>AI Range</label>
              <span>{csaData.aiRange || "-"}</span>
            </div>
            <div className="detail-item">
              <label>GN Division</label>
              <span>{csaData.gramaNiladhariDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Village Name</label>
              <span>{csaData.villageName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="detail-section">
          <h3>Farmer Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Farmer Name</label>
              <span>{csaData.farmerName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>NIC Number</label>
              <span>{csaData.nicNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <span>{csaData.address || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Telephone Number</label>
              <span>{csaData.telephoneNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Farmer Organization</label>
              <span>{csaData.farmerOrganizationName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Female</label>
              <span>{formatBoolean(csaData.isFemale)}</span>
            </div>
            <div className="detail-item">
              <label>Male</label>
              <span>{formatBoolean(csaData.isMale)}</span>
            </div>
            <div className="detail-item">
              <label>Samurdhi Beneficiary</label>
              <span>{formatBoolean(csaData.isSamurdhiBeneficiary)}</span>
            </div>
            <div className="detail-item">
              <label>Woman Headed Household</label>
              <span>{formatBoolean(csaData.isWomanHeadedHousehold)}</span>
            </div>
            <div className="detail-item">
              <label>Disabled</label>
              <span>{formatBoolean(csaData.isDisabled)}</span>
            </div>
          </div>
        </div>

        {/* Crop Information */}
        <div className="detail-section">
          <h3>Crop Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Crop Type</label>
              <span>{csaData.cropType || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Variety Name</label>
              <span>{csaData.varietyName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Replicated Crop</label>
              <span>{formatBoolean(csaData.isReplicatedCrop)}</span>
            </div>
            <div className="detail-item">
              <label>Seed Quantity (Kg)</label>
              <span>{formatDecimal(csaData.seedQuantityKg)}</span>
            </div>
            <div className="detail-item">
              <label>Extent (Ha)</label>
              <span>{formatDecimal(csaData.extentHa)}</span>
            </div>
            <div className="detail-item">
              <label>Harvested Area (Ha)</label>
              <span>{formatDecimal(csaData.harvestedAreaHa)}</span>
            </div>
            <div className="detail-item">
              <label>Pre Losses (Ha)</label>
              <span>{formatDecimal(csaData.preLossesHa)}</span>
            </div>
          </div>
        </div>

        {/* Cultivation Indicators */}
        <div className="detail-section">
          <h3>Cultivation Indicators</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Irrigated Paddy Grown</label>
              <span>{formatBoolean(csaData.grownIrrigatedPaddyIndicator)}</span>
            </div>
            <div className="detail-item">
              <label>Rainfed Paddy Grown</label>
              <span>{formatBoolean(csaData.grownRainfedPaddyIndicator)}</span>
            </div>
            <div className="detail-item">
              <label>Irrigated Highland Grown</label>
              <span>
                {formatBoolean(csaData.grownIrrigatedHighlandIndicator)}
              </span>
            </div>
            <div className="detail-item">
              <label>Rainfed Highland Grown</label>
              <span>
                {formatBoolean(csaData.grownRainfedHighlandIndicator)}
              </span>
            </div>
          </div>
        </div>

        {/* CSA Interventions */}
        <div className="detail-section">
          <h3>CSA Interventions</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Crop Diversification</label>
              <span>{formatBoolean(csaData.csaCropDiversification)}</span>
            </div>
            <div className="detail-item">
              <label>Seed Production</label>
              <span>{formatBoolean(csaData.csaSeedProduction)}</span>
            </div>
            <div className="detail-item">
              <label>Interseason</label>
              <span>{formatBoolean(csaData.csaInterseason)}</span>
            </div>
            <div className="detail-item">
              <label>Micro Irrigation</label>
              <span>{formatBoolean(csaData.csaMicroIrrigation)}</span>
            </div>
            <div className="detail-item">
              <label>Home Gardening</label>
              <span>{formatBoolean(csaData.csaHomeGardening)}</span>
            </div>
            <div className="detail-item">
              <label>Agronomic Interventions</label>
              <span>{formatBoolean(csaData.csaAgronomicInterventions)}</span>
            </div>
          </div>
        </div>

        {/* Training Information */}
        <div className="detail-section">
          <h3>Training Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>CSA Training Received</label>
              <span>{formatBoolean(csaData.csaTrainingReceived)}</span>
            </div>
            <div className="detail-item">
              <label>IEC Conducted</label>
              <span>{formatBoolean(csaData.iecConducted)}</span>
            </div>
            <div className="detail-item">
              <label>FTS Training</label>
              <span>{formatBoolean(csaData.ftsTraining)}</span>
            </div>
            <div className="detail-item">
              <label>FBS Training</label>
              <span>{formatBoolean(csaData.fbsTraining)}</span>
            </div>
          </div>
        </div>

        {/* Yield & Productivity */}
        <div className="detail-section">
          <h3>Yield & Productivity</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Yield (Kg)</label>
              <span>{formatNumber(csaData.yieldKg)}</span>
            </div>
            <div className="detail-item">
              <label>Post Losses (Kg)</label>
              <span>{formatNumber(csaData.postLossesKg)}</span>
            </div>
            <div className="detail-item">
              <label>Productivity (Kg/Ha)</label>
              <span>{formatDecimal(csaData.productivityKgPerHa)}</span>
            </div>
            <div className="detail-item">
              <label>Baseline Productivity (Kg/Ha)</label>
              <span>{formatDecimal(csaData.baselineProductivityKgPerHa)}</span>
            </div>
            <div className="detail-item">
              <label>Yield Increase (Mt)</label>
              <span>{formatDecimal(csaData.yieldIncreaseMt)}</span>
            </div>
            <div className="detail-item">
              <label>Yield Increase (%)</label>
              <span>{formatDecimal(csaData.yieldIncreasePercent)}</span>
            </div>
            <div className="detail-item">
              <label>CDI Score</label>
              <span>{formatDecimal(csaData.cdiScore)}</span>
            </div>
            <div className="detail-item">
              <label>Cropping Intensity (%)</label>
              <span>{formatDecimal(csaData.croppingIntensityPercent)}</span>
            </div>
          </div>
        </div>

        {/* Cost Information */}
        <div className="detail-section">
          <h3>Cost Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Seed Unit Price</label>
              <span>{formatCurrency(csaData.seedUnitPriceRs)}</span>
            </div>
            <div className="detail-item">
              <label>Project Seed Expense</label>
              <span>{formatCurrency(csaData.projectSeedExpenseRs)}</span>
            </div>
            <div className="detail-item">
              <label>Farmer Contribution (Seed)</label>
              <span>{formatCurrency(csaData.farmerContributionSeedRs)}</span>
            </div>
            <div className="detail-item">
              <label>Total Seed Cost</label>
              <span>{formatCurrency(csaData.totalSeedCostRs)}</span>
            </div>
            <div className="detail-item">
              <label>Farmer Cost</label>
              <span>{formatCurrency(csaData.farmerCostRs)}</span>
            </div>
            <div className="detail-item">
              <label>Total Cultivation Cost</label>
              <span>{formatCurrency(csaData.totalCultivationCostRs)}</span>
            </div>
          </div>
        </div>

        {/* Income Information */}
        <div className="detail-section">
          <h3>Income Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Sold Unit Price</label>
              <span>{formatCurrency(csaData.soldUnitPriceRs)}</span>
            </div>
            <div className="detail-item">
              <label>Income</label>
              <span>{formatCurrency(csaData.incomeRs)}</span>
            </div>
            <div className="detail-item">
              <label>Net Income</label>
              <span>{formatCurrency(csaData.netIncomeRs)}</span>
            </div>
            <div className="detail-item">
              <label>Baseline Price (Rs/Kg)</label>
              <span>{formatCurrency(csaData.baselinePriceRsPerKg)}</span>
            </div>
            <div className="detail-item">
              <label>Baseline Value per Ha</label>
              <span>{formatCurrency(csaData.baselineValuePerHaRs)}</span>
            </div>
            <div className="detail-item">
              <label>Productivity Value per Ha</label>
              <span>{formatCurrency(csaData.productivityValuePerHaRs)}</span>
            </div>
            <div className="detail-item">
              <label>Incremental Productivity Value</label>
              <span>
                {formatCurrency(csaData.incrementalProductivityValueRs)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          onClick={() => navigate("/csa-agriculture")}
          className="btn btn-outline"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default CSAAgricultureDetail;
