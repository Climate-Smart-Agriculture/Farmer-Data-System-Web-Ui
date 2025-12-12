import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import farmerService from "../../services/farmerService";
import { Farmer } from "../../types";
import "./Farmer.css";

const FarmerList: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFarmers();
  }, [currentPage]);

  const loadFarmers = async (page: number = currentPage) => {
    setIsLoading(true);
    setError("");
    try {
      const filter: Farmer = {
        nic: "",
        address: "",
        contactNumber: "",
        fullName: searchName,
        district: searchDistrict,
        gender: searchGender,
      };
      const response = await farmerService.getAllFarmers(
        currentPage - 1,
        pageSize,
        filter
      );
      setTotalCount(response.totalCount || 0);
      setFarmers(response.farmers || []);
      console.log("Loaded farmers:", response.farmers);
    } catch (err: any) {
      setError(err.message || "Failed to load farmers");
      setFarmers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page; useEffect will trigger the load
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadFarmers();
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
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
          {/* Search field for district and dropdown for gender */}
          <input
            type="text"
            placeholder="Search by district..."
            value={searchDistrict}
            onChange={(e) => setSearchDistrict(e.target.value)}
            className="search-input"
          />
          <select
            value={searchGender}
            onChange={(e) => setSearchGender(e.target.value)}
            className="search-select"
          >
            <option value="">All Genders</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {searchName && (
            <button
              type="button"
              onClick={() => {
                setSearchName("");
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
                <th>Gender</th>
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
                    <td>{farmer.gender || "-"}</td>
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

      {!isLoading && farmers.length > 0 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-primary"
          >
            &nbsp;&lt;&nbsp;
          </button>
          <span>
            Page{" "}
            <input
              type="number"
              max={Math.ceil(totalCount / pageSize)}
              min={1}
              value={currentPage}
              onChange={(e) => {
                var value = e.target.value.trim();
                if (value != "") {
                  var pageNumber = Number(value);
                  if (pageNumber > Math.ceil(totalCount / pageSize)) {
                    pageNumber = Math.ceil(totalCount / pageSize);
                  }
                  if (pageNumber < 1) {
                    pageNumber = 1;
                  }
                  setCurrentPage(pageNumber);
                }
              }}
            />{" "}
            of {Math.ceil(totalCount / pageSize)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(Math.ceil(totalCount / pageSize) || 1, prev + 1)
              )
            }
            disabled={currentPage === Math.ceil(totalCount / pageSize)}
            className="btn btn-primary"
          >
            &nbsp;&gt;&nbsp;
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmerList;
