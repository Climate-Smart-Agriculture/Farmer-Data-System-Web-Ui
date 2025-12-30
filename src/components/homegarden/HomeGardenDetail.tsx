import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import homeGardenService from "../../services/homeGardenService";
import { HomeGarden } from "../../types";
import "../farmer/Farmer.css";

const HomeGardenDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [homeGarden, setHomeGarden] = useState<HomeGarden | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadHomeGarden(id);
    }
  }, [id]);

  const loadHomeGarden = async (homeGardenId: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await homeGardenService.getHomeGardenById(homeGardenId);
      setHomeGarden(data);
    } catch (err: any) {
      setError(err.message || "Failed to load home garden details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this home garden record?"
      )
    ) {
      return;
    }

    try {
      await homeGardenService.deleteHomeGarden(id!);
      navigate("/home-gardens");
    } catch (err: any) {
      alert("Failed to delete home garden: " + err.message);
    }
  };

  const formatBoolean = (value: number | undefined) => {
    if (value === 1) return "Yes";
    if (value === 0) return "No";
    return "-";
  };

  const formatNumber = (value: number | undefined) => {
    if (value === undefined || value === null) return "-";
    return value.toLocaleString();
  };

  if (isLoading) {
    return <div className="loading">Loading home garden details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!homeGarden) {
    return <div className="error-banner">Home garden not found</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Home Garden Details</h2>
        <div className="action-buttons">
          <Link to={`/home-gardens/${id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
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
              <label>Year:</label>
              <span>{homeGarden.year || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Program Name:</label>
              <span>{homeGarden.programName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="detail-section">
          <h3>Location Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>District:</label>
              <span>{homeGarden.district || "-"}</span>
            </div>
            <div className="detail-item">
              <label>DSD Division:</label>
              <span>{homeGarden.dsdDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>ASC Division:</label>
              <span>{homeGarden.ascDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Cascade Name:</label>
              <span>{homeGarden.cascadeName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Tank/VIS Name:</label>
              <span>{homeGarden.tankOrVisName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Producer Society:</label>
              <span>{homeGarden.producerSociety || "-"}</span>
            </div>
            <div className="detail-item">
              <label>AI Range:</label>
              <span>{homeGarden.aiRange || "-"}</span>
            </div>
            <div className="detail-item">
              <label>GN Division:</label>
              <span>{homeGarden.gramaNiladhariDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Village Name:</label>
              <span>{homeGarden.villageName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="detail-section">
          <h3>Farmer Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Farmer Name:</label>
              <span>{homeGarden.farmerName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>NIC Number:</label>
              <span>{homeGarden.nicNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Telephone:</label>
              <span>{homeGarden.telephoneNumber || "-"}</span>
            </div>
            <div className="detail-item full-width">
              <label>Address:</label>
              <span>{homeGarden.address || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Gender:</label>
              <span>
                {homeGarden.isMale === 1
                  ? "Male"
                  : homeGarden.isFemale === 1
                  ? "Female"
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="detail-section">
          <h3>Status Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Samurdhi Beneficiary:</label>
              <span>{formatBoolean(homeGarden.isSamurdhiBeneficiary)}</span>
            </div>
            <div className="detail-item">
              <label>Woman Headed Household:</label>
              <span>{formatBoolean(homeGarden.isWomanHeadedHousehold)}</span>
            </div>
            <div className="detail-item">
              <label>Person with Disability:</label>
              <span>{formatBoolean(homeGarden.isDisabled)}</span>
            </div>
            <div className="detail-item">
              <label>CSA Conducted:</label>
              <span>{formatBoolean(homeGarden.isCsaConducted)}</span>
            </div>
            <div className="detail-item">
              <label>IEC Conducted:</label>
              <span>{formatBoolean(homeGarden.isIecConducted)}</span>
            </div>
          </div>
        </div>

        {/* Garden Details */}
        <div className="detail-section">
          <h3>Garden Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Extent (Ha):</label>
              <span>{formatNumber(homeGarden.extentHa)}</span>
            </div>
            <div className="detail-item">
              <label>Seed Pack Count:</label>
              <span>{formatNumber(homeGarden.seedPackCount)}</span>
            </div>
            <div className="detail-item">
              <label>Grow Bags Count:</label>
              <span>{formatNumber(homeGarden.growBagsCount)}</span>
            </div>
            <div className="detail-item">
              <label>Compost Bags (25kg):</label>
              <span>{formatNumber(homeGarden.compostBags25kgCount)}</span>
            </div>
          </div>
        </div>

        {/* Plants */}
        <div className="detail-section">
          <h3>Plants</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Banana Plants:</label>
              <span>{formatNumber(homeGarden.bananaPlantsCount)}</span>
            </div>
            <div className="detail-item">
              <label>Papaya Plants:</label>
              <span>{formatNumber(homeGarden.papayaPlantsCount)}</span>
            </div>
            <div className="detail-item">
              <label>Passionfruit Plants:</label>
              <span>{formatNumber(homeGarden.passionfruitPlantsCount)}</span>
            </div>
            <div className="detail-item">
              <label>Lemon Plants:</label>
              <span>{formatNumber(homeGarden.lemonPlantsCount)}</span>
            </div>
            <div className="detail-item">
              <label>Mango Plants:</label>
              <span>{formatNumber(homeGarden.mangoCount)}</span>
            </div>
            <div className="detail-item">
              <label>Orange Plants:</label>
              <span>{formatNumber(homeGarden.orangeCount)}</span>
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div className="detail-section">
          <h3>Equipment</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Hand Spade:</label>
              <span>{formatNumber(homeGarden.handSpadeCount)}</span>
            </div>
            <div className="detail-item">
              <label>Hand Fork:</label>
              <span>{formatNumber(homeGarden.handForkCount)}</span>
            </div>
            <div className="detail-item">
              <label>Secateurs:</label>
              <span>{formatNumber(homeGarden.secateursCount)}</span>
            </div>
            <div className="detail-item">
              <label>PVC Tank (500ml):</label>
              <span>{formatNumber(homeGarden.pvcTank500mlCount)}</span>
            </div>
            <div className="detail-item">
              <label>Watering Can:</label>
              <span>{formatNumber(homeGarden.wateringCanCount)}</span>
            </div>
            <div className="detail-item">
              <label>Mulching Mat:</label>
              <span>{formatNumber(homeGarden.mulchingMatCount)}</span>
            </div>
            <div className="detail-item">
              <label>Nursery Trays:</label>
              <span>{formatNumber(homeGarden.nurseryTraysCount)}</span>
            </div>
            <div className="detail-item">
              <label>Black Polythene:</label>
              <span>{formatNumber(homeGarden.blackPolytheneCount)}</span>
            </div>
          </div>
        </div>

        {/* Production & Income */}
        <div className="detail-section">
          <h3>Production & Income</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Vegetable Production (Kg):</label>
              <span>{formatNumber(homeGarden.vegetableProductionKg)}</span>
            </div>
            <div className="detail-item">
              <label>Home Consumption (Kg):</label>
              <span>{formatNumber(homeGarden.homeConsumptionKg)}</span>
            </div>
            <div className="detail-item">
              <label>Share with Neighbors (Kg):</label>
              <span>{formatNumber(homeGarden.shareWithNeighborsKg)}</span>
            </div>
            <div className="detail-item">
              <label>Sold Quantity (Kg):</label>
              <span>{formatNumber(homeGarden.soldQuantityKg)}</span>
            </div>
            <div className="detail-item">
              <label>Sold Price (Rs):</label>
              <span>{formatNumber(homeGarden.soldPriceRs)}</span>
            </div>
            <div className="detail-item">
              <label>Income (Rs):</label>
              <span>{formatNumber(homeGarden.incomeRs)}</span>
            </div>
            <div className="detail-item">
              <label>Gross Income (Rs):</label>
              <span>{formatNumber(homeGarden.grossIncomeRs)}</span>
            </div>
            <div className="detail-item">
              <label>Total Project Cost (Rs):</label>
              <span>{formatNumber(homeGarden.totalProjectCostRs)}</span>
            </div>
          </div>
        </div>

        {/* New Cultivations */}
        <div className="detail-section">
          <h3>New Cultivations</h3>
          <div className="detail-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => {
              const value = (homeGarden as any)[`newCultivation${num}`];
              return value ? (
                <div className="detail-item" key={`cult${num}`}>
                  <label>Cultivation {num}:</label>
                  <span>{value}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Back Link */}
        <div className="form-actions">
          <Link to="/home-gardens" className="btn btn-outline">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeGardenDetail;
