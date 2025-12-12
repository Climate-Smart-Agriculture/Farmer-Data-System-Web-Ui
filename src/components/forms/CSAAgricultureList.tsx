import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import csaAgricultureService from "../../services/csaAgricultureService";
import { CSAAgriculture } from "../../types";
import "../farmer/Farmer.css";

const CSAAgricultureList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const farmerId = searchParams.get("farmerId"); // optional filter by farmer
  const [records, setRecords] = useState<CSAAgriculture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecords();
  }, [farmerId]);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError("");
    try {
      let data: CSAAgriculture[] = [];
      if (farmerId) {
        data = await csaAgricultureService.getCSAAgricultureByFarmer(farmerId);
      } else {
        // if you want to fetch all records, implement a service method for that
        data = await csaAgricultureService.getCSAAgricultureByFarmer(""); 
      }
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch CSA agriculture records");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>CSA Agriculture Records</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? (
        <p>Loading records...</p>
      ) : records.length === 0 ? (
        <p>No CSA agriculture records found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Farmer ID</th>
              <th>Land Size</th>
              <th>Crop Type</th>
              <th>Season</th>
              <th>Irrigation</th>
              <th>Water Source</th>
              <th>Fertilization</th>
              <th>Expected Yield</th>
              <th>Actual Yield</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.farmerId + "-" + rec.season}>
                <td>{rec.farmerId}</td>
                <td>{rec.landSize}</td>
                <td>{rec.cropType}</td>
                <td>{rec.season}</td>
                <td>{rec.irrigationSystem}</td>
                <td>{rec.waterSource}</td>
                <td>{rec.fertilizationType}</td>
                <td>{rec.expectedYield}</td>
                <td>{rec.actualYield}</td>
                <td>{rec.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/csa-agriculture/new")}
        >
          Add New Record
        </button>
      </div>
    </div>
  );
};

export default CSAAgricultureList;
