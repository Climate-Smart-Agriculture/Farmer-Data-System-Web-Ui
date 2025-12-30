import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import equipmentService from "../../services/equipmentService";
import { Equipment } from "../../types";
import "../farmer/Farmer.css";
import "./Equipment.css";

interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "number";
  options?: { value: string; label: string }[];
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "farmerId", label: "Farmer ID", type: "text" },
  { key: "nicNumber", label: "NIC", type: "text" },
  { key: "farmerName", label: "Farmer Name", type: "text" },
  { key: "district", label: "District", type: "text" },
  { key: "villageName", label: "Village Name", type: "text" },
  { key: "equipmentName", label: "Equipment Name", type: "text" },
  { key: "programName", label: "Program Name", type: "text" },
  { key: "year", label: "Year", type: "number" },
  { key: "dsdDivision", label: "DSD Division", type: "text" },
  { key: "ascDivision", label: "ASC Division", type: "text" },
  { key: "cascadeName", label: "Cascade Name", type: "text" },
  { key: "farmerOrganizationName", label: "Farmer Organization", type: "text" },
  { key: "aiRange", label: "AI Range", type: "text" },
  { key: "gramaNiladhariDivision", label: "GN Division", type: "text" },
  { key: "stepApprovalNumber", label: "Step Approval Number", type: "text" },
  {
    key: "isFemale",
    label: "Female",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
  },
  {
    key: "isMale",
    label: "Male",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
  },
  {
    key: "isReplicated",
    label: "Replicated",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
  },
];

interface FilterValues {
  [key: string]: string;
}

const EquipmentList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>(
    farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {}
  );
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleFilters, setVisibleFilters] = useState<string[]>(
    farmerIdFromUrl
      ? ["farmerId", "nicNumber", "farmerName", "district", "equipmentName"]
      : ["nicNumber", "farmerName", "district", "equipmentName"]
  );
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  useEffect(() => {
    loadEquipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadEquipments = async () => {
    setIsLoading(true);
    setError("");
    try {
      const filter: Partial<Equipment> = {
        farmer: filterValues.farmerId || "",
        nicNumber: filterValues.nicNumber || "",
        farmerName: filterValues.farmerName || "",
        district: filterValues.district || "",
        villageName: filterValues.villageName || "",
        equipmentName: filterValues.equipmentName || "",
        programName: filterValues.programName || "",
        year: filterValues.year ? Number(filterValues.year) : undefined,
        dsdDivision: filterValues.dsdDivision || "",
        ascDivision: filterValues.ascDivision || "",
        cascadeName: filterValues.cascadeName || "",
        farmerOrganizationName: filterValues.farmerOrganizationName || "",
        aiRange: filterValues.aiRange || "",
        gramaNiladhariDivision: filterValues.gramaNiladhariDivision || "",
        stepApprovalNumber: filterValues.stepApprovalNumber || "",
        isFemale: filterValues.isFemale
          ? Number(filterValues.isFemale)
          : undefined,
        isMale: filterValues.isMale ? Number(filterValues.isMale) : undefined,
        isReplicated: filterValues.isReplicated
          ? Number(filterValues.isReplicated)
          : undefined,
      };
      const result = await equipmentService.getAllEquipments(
        currentPage,
        pageSize,
        filter
      );
      setEquipments(result.equipmentData || []);
      setTotalCount(result.totalCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load equipment data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadEquipments();
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setCurrentPage(1);
    loadEquipments();
  };

  const toggleFilter = (filterKey: string) => {
    setVisibleFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((f) => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const hasActiveFilters = Object.values(filterValues).some((v) => v !== "");

  const totalPages = Math.ceil(totalCount / pageSize);

  const renderFilterInput = (filter: FilterOption) => {
    if (filter.type === "select" && filter.options) {
      return (
        <select
          value={filterValues[filter.key] || ""}
          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
        >
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={filter.type}
        placeholder={`Search ${filter.label}...`}
        value={filterValues[filter.key] || ""}
        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
      />
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Equipment Management</h2>
        {farmerIdFromUrl && (
          <Link
            to={`/equipment/new?farmerId=${farmerIdFromUrl}`}
            className="btn btn-primary"
          >
            Add New Equipment
          </Link>
        )}
      </div>

      <div className="search-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="search-form"
        >
          {FILTER_OPTIONS.filter((f) => visibleFilters.includes(f.key)).map(
            (filter) => (
              <div key={filter.key} className="filter-field">
                <label className="filter-label">{filter.label}</label>
                {renderFilterInput(filter)}
              </div>
            )
          )}
          <div className="more-dropdown-container">
            <button
              type="button"
              className="btn btn-outline more-dropdown-trigger"
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
            >
              More ▼
            </button>
            {isMoreDropdownOpen && (
              <div className="more-dropdown-menu">
                {FILTER_OPTIONS.map((filter) => (
                  <label key={filter.key} className="more-dropdown-item">
                    <input
                      type="checkbox"
                      checked={visibleFilters.includes(filter.key)}
                      onChange={() => toggleFilter(filter.key)}
                    />
                    <span>{filter.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading equipment...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Program</th>
                <th>District</th>
                <th>Farmer Name</th>
                <th>NIC</th>
                <th>Equipment Name</th>
                <th>No. of Equipment</th>
                <th>Unit Price (Rs)</th>
                <th>Total Cost (Rs)</th>
                <th>Farmer Cost (Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="no-data">
                    No equipment records found
                  </td>
                </tr>
              ) : (
                equipments.map((equipment) => (
                  <tr key={equipment.equipmentId}>
                    <td>{equipment.year}</td>
                    <td>{equipment.programName}</td>
                    <td>{equipment.district}</td>
                    <td>{equipment.farmerName}</td>
                    <td>{equipment.nicNumber}</td>
                    <td>{equipment.equipmentName}</td>
                    <td>{equipment.noOfEquipment}</td>
                    <td>{equipment.unitPriceRs?.toLocaleString()}</td>
                    <td>{equipment.totalProjectCostRs?.toLocaleString()}</td>
                    <td>{equipment.farmerCostRs?.toLocaleString()}</td>
                    <td className="actions">
                      <Link
                        to={`/equipment/${equipment.equipmentId}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                      <Link
                        to={`/equipment/${equipment.equipmentId}/edit`}
                        className="btn-link"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && equipments.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages} ({totalCount} total)
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
