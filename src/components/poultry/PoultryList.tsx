import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import poultryService from "../../services/poultryService";
import { PoultryFarming } from "../../types";
import "../farmer/Farmer.css";
import "./Poultry.css";

interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "number";
  options?: { value: string; label: string }[];
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "farmerId", label: "Farmer ID", type: "text" },
  { key: "recordId", label: "Record ID", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "programName", label: "Program Name", type: "text" },
  { key: "district", label: "District", type: "text" },
  { key: "dsdDivision", label: "DSD Division", type: "text" },
  { key: "ascDivision", label: "ASC Division", type: "text" },
  { key: "cascadeName", label: "Cascade Name", type: "text" },
  { key: "tankOrVisName", label: "Tank/Vis Name", type: "text" },
  { key: "producerSociety", label: "Producer Society", type: "text" },
  {
    key: "agriculturalInstructor",
    label: "Agricultural Instructor",
    type: "text",
  },
  { key: "gramaNiladhariDivision", label: "GN Division", type: "text" },
  { key: "chicksGiven", label: "Chicks Given", type: "number" },
  { key: "chickUnitPriceRs", label: "Chick Unit Price (Rs)", type: "number" },
  {
    key: "totalProjectCostRs",
    label: "Total Project Cost (Rs)",
    type: "number",
  },
  {
    key: "farmerContributionRs",
    label: "Farmer Contribution (Rs)",
    type: "number",
  },
  { key: "totalCostRs", label: "Total Cost (Rs)", type: "number" },
  { key: "deadChicks", label: "Dead Chicks", type: "number" },
  { key: "totalEggProduction", label: "Total Egg Production", type: "number" },
  { key: "flockSizeIncrement", label: "Flock Size Increment", type: "number" },
  { key: "feedExpenditureRs", label: "Feed Expenditure (Rs)", type: "number" },
  { key: "eggUnitPriceRs", label: "Egg Unit Price (Rs)", type: "number" },
  { key: "incomeRs", label: "Income (Rs)", type: "number" },
  { key: "netIncomeRs", label: "Net Income (Rs)", type: "number" },
  { key: "provinceCode", label: "Province Code", type: "text" },
];

interface FilterValues {
  [key: string]: string;
}

const PoultryList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";

  const [poultryRecords, setPoultryRecords] = useState<PoultryFarming[]>([]);
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
      ? ["farmerId", "district", "programName"]
      : ["district", "programName"],
  );
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  useEffect(() => {
    loadPoultryRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadPoultryRecords = async () => {
    setIsLoading(true);
    setError("");
    try {
      const filter: Partial<PoultryFarming> = {
        farmerId: filterValues.farmerId
          ? Number(filterValues.farmerId)
          : undefined,
        recordId: filterValues.recordId
          ? Number(filterValues.recordId)
          : undefined,
        year: filterValues.year || undefined,
        district: filterValues.district || undefined,
        programName: filterValues.programName || undefined,
        dsdDivision: filterValues.dsdDivision || undefined,
        ascDivision: filterValues.ascDivision || undefined,
        cascadeName: filterValues.cascadeName || undefined,
        tankOrVisName: filterValues.tankOrVisName || undefined,
        producerSociety: filterValues.producerSociety || undefined,
        agriculturalInstructor:
          filterValues.agriculturalInstructor || undefined,
        gramaNiladhariDivision:
          filterValues.gramaNiladhariDivision || undefined,
        chicksGiven: filterValues.chicksGiven
          ? Number(filterValues.chicksGiven)
          : undefined,
        chickUnitPriceRs: filterValues.chickUnitPriceRs
          ? Number(filterValues.chickUnitPriceRs)
          : undefined,
        totalProjectCostRs: filterValues.totalProjectCostRs
          ? Number(filterValues.totalProjectCostRs)
          : undefined,
        farmerContributionRs: filterValues.farmerContributionRs
          ? Number(filterValues.farmerContributionRs)
          : undefined,
        totalCostRs: filterValues.totalCostRs
          ? Number(filterValues.totalCostRs)
          : undefined,
        deadChicks: filterValues.deadChicks
          ? Number(filterValues.deadChicks)
          : undefined,
        totalEggProduction: filterValues.totalEggProduction
          ? Number(filterValues.totalEggProduction)
          : undefined,
        flockSizeIncrement: filterValues.flockSizeIncrement
          ? Number(filterValues.flockSizeIncrement)
          : undefined,
        feedExpenditureRs: filterValues.feedExpenditureRs
          ? Number(filterValues.feedExpenditureRs)
          : undefined,
        eggUnitPriceRs: filterValues.eggUnitPriceRs
          ? Number(filterValues.eggUnitPriceRs)
          : undefined,
        incomeRs: filterValues.incomeRs
          ? Number(filterValues.incomeRs)
          : undefined,
        netIncomeRs: filterValues.netIncomeRs
          ? Number(filterValues.netIncomeRs)
          : undefined,
        provinceCode: filterValues.provinceCode || undefined,
      };
      const result = await poultryService.getAllPoultry(
        currentPage - 1,
        pageSize,
        filter,
      );
      setPoultryRecords(result.poultryFarmingData || []);
      setTotalCount(result.totalCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load poultry farming data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPoultryRecords();
  };

  const handleClearFilters = () => {
    setFilterValues(farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {});
    setCurrentPage(1);
    loadPoultryRecords();
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
    value !== undefined ? `Rs. ${value.toLocaleString()}` : "-";

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
            Poultry Farming Management
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
                to={`/poultry/new?farmerId=${farmerIdFromUrl}`}
                className="btn btn-primary"
              >
                Add New Poultry Record
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
        <div className="loading">Loading poultry farming data...</div>
      ) : (
        <div className="table-container">
          {poultryRecords.length > 0 && (
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
                <th>Year</th>
                <th>Program</th>
                <th>District</th>
                <th>Chicks Given</th>
                <th>Dead Chicks</th>
                <th>Egg Production</th>
                <th>Income (Rs)</th>
                <th>Net Income (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {poultryRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-data">
                    No poultry farming records found
                  </td>
                </tr>
              ) : (
                poultryRecords.map((record) => (
                  <tr key={record.poultryRecordPk}>
                    <td>
                      <Link
                        to={`/poultry/${record.poultryRecordPk}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                    </td>
                    <td>{record.year || "-"}</td>
                    <td>{record.programName || "-"}</td>
                    <td>{record.district || "-"}</td>
                    <td>{record.chicksGiven || "-"}</td>
                    <td>{record.deadChicks || "-"}</td>
                    <td>
                      {record.totalEggProduction?.toLocaleString() || "-"}
                    </td>
                    <td>{formatCurrency(record.incomeRs)}</td>
                    <td>{formatCurrency(record.netIncomeRs)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && poultryRecords.length > 0 && (
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

export default PoultryList;
