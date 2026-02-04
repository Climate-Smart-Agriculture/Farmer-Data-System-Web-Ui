import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import agroWellService from "../../services/agroWellService";
import { AgroWell } from "../../types";
import "../farmer/Farmer.css";
import "./AgroWell.css";

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
  { key: "cultivations", label: "Cultivations", type: "text" },
  { key: "irrigationMethod", label: "Irrigation Method", type: "text" },
  { key: "programName", label: "Program Name", type: "text" },
  { key: "dsdDivision", label: "DSD Division", type: "text" },
  { key: "ascDivision", label: "ASC Division", type: "text" },
  { key: "cascadeName", label: "Cascade Name", type: "text" },
  { key: "tankOrVisName", label: "Tank/Vis Name", type: "text" },
  { key: "producerSociety", label: "Producer Society", type: "text" },
  { key: "farmerOrganizationName", label: "Farmer Organization", type: "text" },
  { key: "aiRange", label: "AI Range", type: "text" },
  { key: "gramaNiladhariDivision", label: "GN Division", type: "text" },
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
    key: "isSamurdhiBeneficiary",
    label: "Samurdhi Beneficiary",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
  },
  {
    key: "isReplicatedCrop",
    label: "Replicated Crop",
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

const AgroWellList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";

  const [agroWells, setAgroWells] = useState<AgroWell[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>(
    farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {},
  );
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleFilters, setVisibleFilters] = useState<string[]>(
    farmerIdFromUrl
      ? ["farmerId", "nicNumber", "farmerName", "district", "cultivations"]
      : ["nicNumber", "farmerName", "district", "cultivations"],
  );
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  useEffect(() => {
    loadAgroWells();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadAgroWells = async () => {
    setIsLoading(true);
    setError("");
    try {
      const filter: Partial<AgroWell> = {
        farmerId: filterValues.farmerId || undefined,
        nicNumber: filterValues.nicNumber || undefined,
        farmerName: filterValues.farmerName || undefined,
        district: filterValues.district || undefined,
        villageName: filterValues.villageName || undefined,
        cultivations: filterValues.cultivations || undefined,
        irrigationMethod: filterValues.irrigationMethod || undefined,
        programName: filterValues.programName || undefined,
        dsdDivision: filterValues.dsdDivision || undefined,
        ascDivision: filterValues.ascDivision || undefined,
        cascadeName: filterValues.cascadeName || undefined,
        tankOrVisName: filterValues.tankOrVisName || undefined,
        producerSociety: filterValues.producerSociety || undefined,
        farmerOrganizationName:
          filterValues.farmerOrganizationName || undefined,
        aiRange: filterValues.aiRange || undefined,
        gramaNiladhariDivision:
          filterValues.gramaNiladhariDivision || undefined,
        isFemale: filterValues.isFemale
          ? Number(filterValues.isFemale)
          : undefined,
        isMale: filterValues.isMale ? Number(filterValues.isMale) : undefined,
        isSamurdhiBeneficiary: filterValues.isSamurdhiBeneficiary
          ? Number(filterValues.isSamurdhiBeneficiary)
          : undefined,
        isReplicatedCrop: filterValues.isReplicatedCrop
          ? Number(filterValues.isReplicatedCrop)
          : undefined,
      };
      const result = await agroWellService.getAllAgroWells(
        currentPage - 1,
        pageSize,
        filter,
      );
      setAgroWells(result.agroWellData || []);
      setTotalCount(result.totalCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load agro well data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadAgroWells();
  };

  const handleClearFilters = () => {
    setFilterValues(farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {});
    setCurrentPage(1);
    loadAgroWells();
  };

  const toggleFilter = (filterKey: string) => {
    setVisibleFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((f) => f !== filterKey)
        : [...prev, filterKey],
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
          className="search-select"
          disabled={filter.key === "farmerId"}
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
        className="search-input"
        disabled={filter.key === "farmerId"}
      />
    );
  };

  const formatCurrency = (value?: number) =>
    value != null ? `Rs. ${value.toLocaleString()}` : "-";

  return (
    <div className="list-page-container">
      <div
        className="page-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2>
            Agro Well Management
            {farmerIdFromUrl && (
              <span
                style={{ fontSize: "1rem", color: "#888", marginLeft: "1rem" }}
              >
                (Farmer ID: {farmerIdFromUrl})
              </span>
            )}
          </h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {farmerIdFromUrl && (
            <>
              <Link
                to={`/farmers/${farmerIdFromUrl}`}
                className="btn btn-secondary"
              >
                Back to Farmer
              </Link>
              <Link
                to={`/agro-wells/new?farmerId=${farmerIdFromUrl}`}
                className="btn btn-primary"
              >
                Add New Agro Well
              </Link>
            </>
          )}
        </div>
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
            ),
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
        <div className="loading">Loading agro well data...</div>
      ) : (
        <div className="table-container">
          {agroWells.length > 0 && (
            <div className="records-info">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalCount)} of{" "}
              {totalCount.toLocaleString()}
            </div>
          )}
          <table className="data-table">
            <thead>
              <tr>
                <th>Actions</th>
                <th>Program</th>
                <th>District</th>
                <th>DSD Division</th>
                <th>ASC Division</th>
                <th>Cascade Name</th>
                <th>Tank/Vis Name</th>
                <th>Command Area (Ha)</th>
                <th>Producer Society</th>
                <th>Farmer Organization</th>
                <th>AI Range</th>
                <th>GN Division</th>
                <th>Village Name</th>
                <th>Farmer Name</th>
                <th>Address</th>
                <th>NIC</th>
                <th>Telephone</th>
                <th>Female</th>
                <th>Male</th>
                <th>Samurdhi</th>
                <th>Woman Headed</th>
                <th>Disabled</th>
                <th>Cultivations</th>
                <th>Replicated Crop</th>
                <th>Irrigation Method</th>
                <th>Extent (Ha)</th>
                <th>No. of Plants</th>
                <th>Cultivation Cost (Rs)</th>
                <th>Agrowell Depreciation (Rs)</th>
                <th>Total Cost (Rs)</th>
                <th>Yield (Kg)</th>
                <th>Income (Rs)</th>
                <th>Net Income (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {agroWells.length === 0 ? (
                <tr>
                  <td colSpan={33} className="no-data">
                    No agro well records found
                  </td>
                </tr>
              ) : (
                agroWells.map((well) => (
                  <tr key={well.agroWellId}>
                    <td>
                      <Link
                        to={`/agro-wells/${well.agroWellId}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                    </td>
                    <td>{well.programName || "-"}</td>
                    <td>{well.district || "-"}</td>
                    <td>{well.dsdDivision || "-"}</td>
                    <td>{well.ascDivision || "-"}</td>
                    <td>{well.cascadeName || "-"}</td>
                    <td>{well.tankOrVisName || "-"}</td>
                    <td>{well.commandAreaHa || "-"}</td>
                    <td>{well.producerSociety || "-"}</td>
                    <td>{well.farmerOrganizationName || "-"}</td>
                    <td>{well.aiRange || "-"}</td>
                    <td>{well.gramaNiladhariDivision || "-"}</td>
                    <td>{well.villageName || "-"}</td>
                    <td>{well.farmerName || "-"}</td>
                    <td>{well.address || "-"}</td>
                    <td>{well.nicNumber || "-"}</td>
                    <td>{well.telephoneNumber || "-"}</td>
                    <td>
                      {well.isFemale === 1
                        ? "Yes"
                        : well.isFemale === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {well.isMale === 1
                        ? "Yes"
                        : well.isMale === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {well.isSamurdhiBeneficiary === 1
                        ? "Yes"
                        : well.isSamurdhiBeneficiary === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {well.isWomanHeadedHousehold === 1
                        ? "Yes"
                        : well.isWomanHeadedHousehold === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {well.isDisabled === 1
                        ? "Yes"
                        : well.isDisabled === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>{well.cultivations || "-"}</td>
                    <td>
                      {well.isReplicatedCrop === 1
                        ? "Yes"
                        : well.isReplicatedCrop === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>{well.irrigationMethod || "-"}</td>
                    <td>{well.extentHa || "-"}</td>
                    <td>{well.noOfPlant || "-"}</td>
                    <td>{formatCurrency(well.totalCultivationCostRs)}</td>
                    <td>
                      {formatCurrency(well.agrowellDepreciationPerSeasonCostRs)}
                    </td>
                    <td>{formatCurrency(well.totalCostRs)}</td>
                    <td>{well.yieldKg?.toLocaleString() || "-"}</td>
                    <td>{formatCurrency(well.incomeRs)}</td>
                    <td>{formatCurrency(well.netIncomeRs)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && agroWells.length > 0 && (
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
              max={totalPages}
              min={1}
              value={currentPage}
              onChange={(e) => {
                const value = e.target.value.trim();
                if (value !== "") {
                  let pageNumber = Number(value);
                  if (pageNumber > totalPages) {
                    pageNumber = totalPages;
                  }
                  if (pageNumber < 1) {
                    pageNumber = 1;
                  }
                  setCurrentPage(pageNumber);
                }
              }}
            />{" "}
            of {totalPages} ({totalCount} total)
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="btn btn-primary"
          >
            &nbsp;&gt;&nbsp;
          </button>
        </div>
      )}
    </div>
  );
};

export default AgroWellList;
