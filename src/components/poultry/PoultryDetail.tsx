import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import poultryService from "../../services/poultryService";
import { PoultryFarming } from "../../types";
import "../farmer/Farmer.css";
import "./Poultry.css";

const PoultryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poultry, setPoultry] = useState<PoultryFarming | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadPoultry(id);
    }
  }, [id]);

  const loadPoultry = async (poultryId: string) => {
    setIsLoading(true);
    try {
      const data = await poultryService.getPoultryById(poultryId);
      setPoultry(data);
    } catch (err: any) {
      setError(err.message || "Failed to load poultry farming details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm(
        "Are you sure you want to delete this poultry farming record?"
      )
    ) {
      return;
    }

    try {
      await poultryService.deletePoultry(id);
      navigate("/poultry");
    } catch (err: any) {
      setError(err.message || "Failed to delete poultry farming record");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading poultry farming details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!poultry) {
    return <div className="error-banner">Poultry farming record not found</div>;
  }

  const formatBoolean = (value?: number) => (value === 1 ? "Yes" : "No");
  const formatNumber = (value?: number) =>
    value !== undefined ? value.toLocaleString() : "-";
  const formatCurrency = (value?: number) =>
    value !== undefined ? `Rs. ${value.toLocaleString()}` : "-";

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Poultry Farming Details</h2>
        <div className="action-buttons">
          <Link to={`/poultry/${id}/edit`} className="btn btn-primary">
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
              <label>Poultry ID</label>
              <span>{poultry.poultryId || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Year</label>
              <span>{poultry.year || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Program Name</label>
              <span>{poultry.programName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Province Code</label>
              <span>{poultry.provinceCode || "-"}</span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="detail-section">
          <h3>Location Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>District</label>
              <span>{poultry.district || "-"}</span>
            </div>
            <div className="detail-item">
              <label>DSD Division</label>
              <span>{poultry.dsdDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>ASC Division</label>
              <span>{poultry.ascDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Cascade Name</label>
              <span>{poultry.cascadeName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Tank/Vis Name</label>
              <span>{poultry.tankOrVisName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Producer Society</label>
              <span>{poultry.producerSociety || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Agricultural Instructor</label>
              <span>{poultry.agriculturalInstructor || "-"}</span>
            </div>
            <div className="detail-item">
              <label>GN Division</label>
              <span>{poultry.gramaNiladhariDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Village Name</label>
              <span>{poultry.villageName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="detail-section">
          <h3>Farmer Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Farmer Name</label>
              <span>{poultry.farmerName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>NIC Number</label>
              <span>{poultry.nicNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <span>{poultry.address || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Telephone Number</label>
              <span>{poultry.telephoneNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Female</label>
              <span>{formatBoolean(poultry.isFemale)}</span>
            </div>
            <div className="detail-item">
              <label>Male</label>
              <span>{formatBoolean(poultry.isMale)}</span>
            </div>
            <div className="detail-item">
              <label>Samurdhi Beneficiary</label>
              <span>{formatBoolean(poultry.isSamurdhiBeneficiary)}</span>
            </div>
            <div className="detail-item">
              <label>Woman Headed Household</label>
              <span>{formatBoolean(poultry.isWomanHeadedHousehold)}</span>
            </div>
            <div className="detail-item">
              <label>Disabled</label>
              <span>{formatBoolean(poultry.isDisabled)}</span>
            </div>
          </div>
        </div>

        {/* Poultry Details */}
        <div className="detail-section">
          <h3>Poultry Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Chicks Given</label>
              <span>{formatNumber(poultry.chicksGiven)}</span>
            </div>
            <div className="detail-item">
              <label>Dead Chicks</label>
              <span>{formatNumber(poultry.deadChicks)}</span>
            </div>
            <div className="detail-item">
              <label>Total Egg Production</label>
              <span>{formatNumber(poultry.totalEggProduction)}</span>
            </div>
            <div className="detail-item">
              <label>Flock Size Increment</label>
              <span>{formatNumber(poultry.flockSizeIncrement)}</span>
            </div>
            <div className="detail-item">
              <label>CSA Conducted</label>
              <span>{formatBoolean(poultry.isCsaConducted)}</span>
            </div>
            <div className="detail-item">
              <label>IEC Conducted</label>
              <span>{formatBoolean(poultry.isIecConducted)}</span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="detail-section">
          <h3>Financial Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Chick Unit Price (Rs)</label>
              <span>{formatCurrency(poultry.chickUnitPriceRs)}</span>
            </div>
            <div className="detail-item">
              <label>Total Project Cost (Rs)</label>
              <span>{formatCurrency(poultry.totalProjectCostRs)}</span>
            </div>
            <div className="detail-item">
              <label>Farmer Contribution (Rs)</label>
              <span>{formatCurrency(poultry.farmerContributionRs)}</span>
            </div>
            <div className="detail-item">
              <label>Total Cost (Rs)</label>
              <span>{formatCurrency(poultry.totalCostRs)}</span>
            </div>
            <div className="detail-item">
              <label>Feed Expenditure (Rs)</label>
              <span>{formatCurrency(poultry.feedExpenditureRs)}</span>
            </div>
            <div className="detail-item">
              <label>Egg Unit Price (Rs)</label>
              <span>{formatCurrency(poultry.eggUnitPriceRs)}</span>
            </div>
            <div className="detail-item">
              <label>Income (Rs)</label>
              <span>{formatCurrency(poultry.incomeRs)}</span>
            </div>
            <div className="detail-item">
              <label>Net Income (Rs)</label>
              <span>{formatCurrency(poultry.netIncomeRs)}</span>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="detail-section">
          <h3>Record Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Created At</label>
              <span>
                {poultry.createdAt
                  ? new Date(poultry.createdAt).toLocaleString()
                  : "-"}
              </span>
            </div>
            <div className="detail-item">
              <label>Updated At</label>
              <span>
                {poultry.updatedAt
                  ? new Date(poultry.updatedAt).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Link to="/poultry" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default PoultryDetail;
