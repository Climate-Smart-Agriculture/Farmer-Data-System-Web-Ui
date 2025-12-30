import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import farmerService from "../../services/farmerService";
import { Farmer } from "../../types";
import "./Farmer.css";

const FarmerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadFarmer(id);
    }
  }, [id]);

  const loadFarmer = async (farmerId: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await farmerService.getFarmerById(farmerId);
      setFarmer(data);
    } catch (err: any) {
      setError(err.message || "Failed to load farmer details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) {
      return;
    }

    try {
      await farmerService.deleteFarmer(id!);
      navigate("/farmers");
    } catch (err: any) {
      alert("Failed to delete farmer: " + err.message);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading farmer details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!farmer) {
    return <div className="error-banner">Farmer not found</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Farmer Details</h2>
        <div className="action-buttons">
          <Link to={`/farmers/${id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-section">
          <h3>Personal Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>NIC:</label>
              <span>{farmer.nic}</span>
            </div>
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{`${farmer.fullName}`}</span>
            </div>
            <div className="detail-item">
              <label>Contact Number:</label>
              <span>{farmer.contactNumber}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{farmer.email || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Gender:</label>
              <span>{farmer.gender || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Is Samurdhi Beneficiary:</label>
              <span>{farmer.isSamurdhiBeneficiary ? "Yes" : "No"}</span>
            </div>
            <div className="detail-item">
              <label>Is Disabled</label>
              <span>{farmer.isDisabled ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Location Details</h3>
          <div className="detail-grid">
            <div className="detail-item full-width">
              <label>Address:</label>
              <span>{farmer.address}</span>
            </div>
            <div className="detail-item">
              <label>District:</label>
              <span>{farmer.district || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Village Name:</label>
              <span>{farmer.villageName || "-"}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Associated Data</h3>
          <div className="associated-links">
            <Link to={`/equipment?farmerId=${farmer.farmerId}`} className="btn btn-outline">
              View Equipment
            </Link>
            <Link
              to={`/home-gardens?farmerId=${farmer.farmerId}`}
              className="btn btn-outline"
            >
              View Home Gardens
            </Link>
            <Link
              to={`/csa-agriculture?farmerId=${farmer.farmerId}`}
              className="btn btn-outline"
            >
              View CSA Agriculture
            </Link>
            <Link to={`/agro-wells?farmerId=${farmer.farmerId}`} className="btn btn-outline">
              View Agro Wells
            </Link>
            <Link to={`/poultry?farmerId=${farmer.farmerId}`} className="btn btn-outline">
              View Poultry Farming
            </Link>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          onClick={() => navigate("/farmers")}
          className="btn btn-outline"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default FarmerDetail;
