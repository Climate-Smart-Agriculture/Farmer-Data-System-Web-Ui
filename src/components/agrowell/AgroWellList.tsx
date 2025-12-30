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
    farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {}
  );
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleFilters, setVisibleFilters] = useState<string[]>(
    farmerIdFromUrl
      ? ["farmerId", "nicNumber", "farmerName", "district", "cultivations"]
      : ["nicNumber", "farmerName", "district", "cultivations"]
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
        filter
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
    setFilterValues({});
    setCurrentPage(1);
    loadAgroWells();
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
      !window.confirm("Are you sure you want to delete this agro well record?")
    ) {
      return;
    }

    try {
      await agroWellService.deleteAgroWell(id);
      loadAgroWells();
    } catch (err: any) {
      alert("Failed to delete agro well record: " + err.message);
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
        <h2>Agro Well Management</h2>
        {farmerIdFromUrl && (
          <Link
            to={`/agro-wells/new?farmerId=${farmerIdFromUrl}`}
            className="btn btn-primary"
          >
            Add New Agro Well
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
        <div className="loading">Loading agro well data...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>District</th>
                <th>Farmer Name</th>
                <th>NIC</th>
                <th>Cultivations</th>
                <th>Irrigation Method</th>
                <th>Extent (Ha)</th>
                <th>No. of Plants</th>
                <th>Yield (Kg)</th>
                <th>Income (Rs)</th>
                <th>Net Income (Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agroWells.length === 0 ? (
                <tr>
                  <td colSpan={12} className="no-data">
                    No agro well records found
                  </td>
                </tr>
              ) : (
                agroWells.map((well) => (
                  <tr key={well.agroWellId}>
                    <td>{well.programName || "-"}</td>
                    <td>{well.district || "-"}</td>
                    <td>{well.farmerName || "-"}</td>
                    <td>{well.nicNumber || "-"}</td>
                    <td>{well.cultivations || "-"}</td>
                    <td>{well.irrigationMethod || "-"}</td>
                    <td>{well.extentHa || "-"}</td>
                    <td>{well.noOfPlant || "-"}</td>
                    <td>{well.yieldKg?.toLocaleString() || "-"}</td>
                    <td>{formatCurrency(well.incomeRs)}</td>
                    <td>{formatCurrency(well.netIncomeRs)}</td>
                    <td className="actions">
                      <Link
                        to={`/agro-wells/${well.agroWellId}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                      <Link
                        to={`/agro-wells/${well.agroWellId}/edit`}
                        className="btn-link"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          well.agroWellId && handleDelete(well.agroWellId)
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
