import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import farmerService from "../../services/farmerService";
import { Farmer } from "../../types";
import "./Farmer.css";

const FarmerList: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await farmerService.getAllFarmers(1, 100);
      setFarmers(response.data);
      console.log("Loaded farmers:", response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load farmers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadFarmers();
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const results = await farmerService.searchFarmers(searchQuery);
      setFarmers(results);
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) {
      return;
    }

    try {
      await farmerService.deleteFarmer(id);
      loadFarmers();
    } catch (err: any) {
      alert("Failed to delete farmer: " + err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Farmer Management</h2>
        <Link to="/farmers/new" className="btn btn-primary">
          Add New Farmer
        </Link>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by NIC or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                loadFarmers();
              }}
              className="btn btn-outline"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading farmers...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>NIC</th>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Address</th>
                <th>District</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    No farmers found
                  </td>
                </tr>
              ) : (
                farmers.map((farmer, index) => (
                  <tr key={farmer.farmerId}>
                    <td>{farmer.nic}</td>
                    <td>{`${farmer.fullName}`}</td>
                    <td>{farmer.contactNumber}</td>
                    <td>{farmer.address}</td>
                    <td>{farmer.district || "-"}</td>
                    <td className="actions">
                      <Link
                        to={`/farmers/${farmer.farmerId}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                      <Link
                        to={`/farmers/${farmer.farmerId}/edit`}
                        className="btn-link"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          farmer.farmerId && handleDelete(farmer.farmerId)
                        }
                        className="btn-link danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmerList;
