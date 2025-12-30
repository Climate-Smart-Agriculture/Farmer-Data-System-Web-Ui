import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import equipmentService from "../../services/equipmentService";
import { Equipment } from "../../types";
import "../farmer/Farmer.css";
import "./Equipment.css";

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadEquipment(id);
    }
  }, [id]);

  const loadEquipment = async (equipmentId: string) => {
    setIsLoading(true);
    try {
      const data = await equipmentService.getEquipmentById(equipmentId);
      setEquipment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load equipment details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this equipment record?")
    ) {
      return;
    }

    try {
      await equipmentService.deleteEquipment(id);
      navigate("/equipment");
    } catch (err: any) {
      setError(err.message || "Failed to delete equipment");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading equipment details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!equipment) {
    return <div className="error-banner">Equipment not found</div>;
  }

  const formatBoolean = (value?: number) => (value === 1 ? "Yes" : "No");
  const formatNumber = (value?: number) =>
    value !== undefined ? value.toLocaleString() : "-";
  const formatCurrency = (value?: number) =>
    value !== undefined ? `Rs. ${value.toLocaleString()}` : "-";

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Equipment Details</h2>
        <div className="action-buttons">
          <Link to={`/equipment/${id}/edit`} className="btn btn-primary">
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
              <label>Equipment ID</label>
              <span>{equipment.equipmentId || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Year</label>
              <span>{equipment.year || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Program Name</label>
              <span>{equipment.programName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Province Code</label>
              <span>{equipment.provinceCode || "-"}</span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="detail-section">
          <h3>Location Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>District</label>
              <span>{equipment.district || "-"}</span>
            </div>
            <div className="detail-item">
              <label>DSD Division</label>
              <span>{equipment.dsdDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>ASC Division</label>
              <span>{equipment.ascDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Cascade Name</label>
              <span>{equipment.cascadeName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>AI Range</label>
              <span>{equipment.aiRange || "-"}</span>
            </div>
            <div className="detail-item">
              <label>GN Division</label>
              <span>{equipment.gramaNiladhariDivision || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Village Name</label>
              <span>{equipment.villageName || "-"}</span>
            </div>
          </div>
        </div>

        {/* Farmer Information */}
        <div className="detail-section">
          <h3>Farmer Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Farmer Name</label>
              <span>{equipment.farmerName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>NIC Number</label>
              <span>{equipment.nicNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <span>{equipment.address || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Telephone Number</label>
              <span>{equipment.telephoneNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Farmer Organization</label>
              <span>{equipment.farmerOrganizationName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Female</label>
              <span>{formatBoolean(equipment.isFemale)}</span>
            </div>
            <div className="detail-item">
              <label>Male</label>
              <span>{formatBoolean(equipment.isMale)}</span>
            </div>
          </div>
        </div>

        {/* Equipment Details */}
        <div className="detail-section">
          <h3>Equipment Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Equipment Name</label>
              <span>{equipment.equipmentName || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Number of Equipment</label>
              <span>{formatNumber(equipment.noOfEquipment)}</span>
            </div>
            <div className="detail-item">
              <label>Extent (Ha)</label>
              <span>{equipment.extentHa || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Step Approval Number</label>
              <span>{equipment.stepApprovalNumber || "-"}</span>
            </div>
            <div className="detail-item">
              <label>Replicated</label>
              <span>{formatBoolean(equipment.isReplicated)}</span>
            </div>
          </div>
        </div>

        {/* Cost Information */}
        <div className="detail-section">
          <h3>Cost Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Unit Price</label>
              <span>{formatCurrency(equipment.unitPriceRs)}</span>
            </div>
            <div className="detail-item">
              <label>Total Project Cost</label>
              <span>{formatCurrency(equipment.totalProjectCostRs)}</span>
            </div>
            <div className="detail-item">
              <label>Farmer Cost</label>
              <span>{formatCurrency(equipment.farmerCostRs)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
