import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import csaAgricultureService from "../../services/csaAgricultureService";
import { CSAAgriculture } from "../../types";
import "../farmer/Farmer.css";
import "./CSAAgriculture.css";

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
  { key: "cropType", label: "Crop Type", type: "text" },
  { key: "varietyName", label: "Variety Name", type: "text" },
  { key: "programName", label: "Program Name", type: "text" },
  { key: "year", label: "Year", type: "number" },
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
  {
    key: "csaTrainingReceived",
    label: "CSA Training Received",
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

const CSAAgricultureList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";

  const [csaData, setCSAData] = useState<CSAAgriculture[]>([]);
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
      ? ["farmerId", "nicNumber", "farmerName", "district", "cropType"]
      : ["nicNumber", "farmerName", "district", "cropType"]
  );
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  useEffect(() => {
    loadCSAData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadCSAData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const filter: Partial<CSAAgriculture> = {
        farmerId: filterValues.farmerId || undefined,
        nicNumber: filterValues.nicNumber || undefined,
        farmerName: filterValues.farmerName || undefined,
        district: filterValues.district || undefined,
        villageName: filterValues.villageName || undefined,
        cropType: filterValues.cropType || undefined,
        varietyName: filterValues.varietyName || undefined,
        programName: filterValues.programName || undefined,
        year: filterValues.year ? Number(filterValues.year) : undefined,
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
        csaTrainingReceived: filterValues.csaTrainingReceived
          ? Number(filterValues.csaTrainingReceived)
          : undefined,
      };
      const result = await csaAgricultureService.getAllCSAAgriculture(
        currentPage - 1,
        pageSize,
        filter
      );
      setCSAData(result.csaAgricultureData || []);
      setTotalCount(result.totalCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load CSA agriculture data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadCSAData();
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setCurrentPage(1);
    loadCSAData();
  };

  const toggleFilter = (filterKey: string) => {
    setVisibleFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((f) => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this CSA agriculture record?"
      )
    ) {
      return;
    }

    try {
      await csaAgricultureService.deleteCSAAgriculture(id);
      loadCSAData();
    } catch (err: any) {
      alert("Failed to delete CSA agriculture record: " + err.message);
    }
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
      />
    );
  };

  const formatCurrency = (value?: number) =>
    value !== undefined ? `Rs. ${value.toLocaleString()}` : "-";

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>CSA Agriculture Management</h2>
        {farmerIdFromUrl && (
          <Link
            to={`/csa-agriculture/new?farmerId=${farmerIdFromUrl}`}
            className="btn btn-primary"
          >
            Add New CSA Agriculture
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
        <div className="loading">Loading CSA agriculture data...</div>
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
                <th>Crop Type</th>
                <th>Variety</th>
                <th>Extent (Ha)</th>
                <th>Yield (Kg)</th>
                <th>Income (Rs)</th>
                <th>Net Income (Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {csaData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="no-data">
                    No CSA agriculture records found
                  </td>
                </tr>
              ) : (
                csaData.map((csa) => (
                  <tr key={csa.csaAgricultureId}>
                    <td>{csa.year || "-"}</td>
                    <td>{csa.programName || "-"}</td>
                    <td>{csa.district || "-"}</td>
                    <td>{csa.farmerName || "-"}</td>
                    <td>{csa.nicNumber || "-"}</td>
                    <td>{csa.cropType || "-"}</td>
                    <td>{csa.varietyName || "-"}</td>
                    <td>{csa.extentHa || "-"}</td>
                    <td>{csa.yieldKg?.toLocaleString() || "-"}</td>
                    <td>{formatCurrency(csa.incomeRs)}</td>
                    <td>{formatCurrency(csa.netIncomeRs)}</td>
                    <td className="actions">
                      <Link
                        to={`/csa-agriculture/${csa.csaAgricultureId}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                      <Link
                        to={`/csa-agriculture/${csa.csaAgricultureId}/edit`}
                        className="btn-link"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          csa.csaAgricultureId &&
                          handleDelete(csa.csaAgricultureId)
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

      {!isLoading && csaData.length > 0 && (
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

export default CSAAgricultureList;
