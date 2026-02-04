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
    farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {},
  );
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleFilters, setVisibleFilters] = useState<string[]>(
    farmerIdFromUrl
      ? ["farmerId", "nicNumber", "farmerName", "district", "cropType"]
      : ["nicNumber", "farmerName", "district", "cropType"],
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
        filter,
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
    setFilterValues(farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {});
    setCurrentPage(1);
    loadCSAData();
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
            CSA Agriculture Management
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
            <Link
              to={`/farmers/${farmerIdFromUrl}`}
              className="btn btn-secondary"
            >
              Back to Farmer
            </Link>
          )}
          {farmerIdFromUrl && (
            <Link
              to={`/csa-agriculture/new?farmerId=${farmerIdFromUrl}`}
              className="btn btn-primary"
            >
              Add New CSA Agriculture
            </Link>
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
        <div className="loading">Loading CSA agriculture data...</div>
      ) : (
        <div className="table-container">
          {csaData.length > 0 && (
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
                <th>Crop Type</th>
                <th>Replicated Crop</th>
                <th>Irrigated Paddy</th>
                <th>Rainfed Paddy</th>
                <th>Irrigated Highland</th>
                <th>Rainfed Highland</th>
                <th>CSA Crop Diversification</th>
                <th>CSA Seed Production</th>
                <th>CSA Interseason</th>
                <th>CSA Micro Irrigation</th>
                <th>CSA Home Gardening</th>
                <th>CSA Agronomic Interventions</th>
                <th>CSA Training</th>
                <th>IEC Conducted</th>
                <th>FTS Training</th>
                <th>FBS Training</th>
                <th>Variety</th>
                <th>Seed Qty (Kg)</th>
                <th>Extent (Ha)</th>
                <th>Pre Losses (Ha)</th>
                <th>Harvested Area (Ha)</th>
                <th>Seed Unit Price (Rs)</th>
                <th>Project Seed Expense (Rs)</th>
                <th>Farmer Seed Contribution (Rs)</th>
                <th>Total Seed Cost (Rs)</th>
                <th>Farmer Cost (Rs)</th>
                <th>Total Cultivation Cost (Rs)</th>
                <th>Post Losses (Kg)</th>
                <th>Yield (Kg)</th>
                <th>Sold Unit Price (Rs)</th>
                <th>Income (Rs)</th>
                <th>Net Income (Rs)</th>
                <th>Productivity (Kg/Ha)</th>
                <th>Baseline Productivity (Kg/Ha)</th>
                <th>Yield Increase (Mt)</th>
                <th>Yield Increase (%)</th>
                <th>CDI Score</th>
                <th>Cropping Intensity (%)</th>
              </tr>
            </thead>
            <tbody>
              {csaData.length === 0 ? (
                <tr>
                  <td colSpan={61} className="no-data">
                    No CSA agriculture records found
                  </td>
                </tr>
              ) : (
                csaData.map((csa) => (
                  <tr key={csa.csaAgricultureId}>
                    <td>
                      <Link
                        to={`/csa-agriculture/${csa.csaAgricultureId}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                    </td>
                    <td>{csa.year || "-"}</td>
                    <td>{csa.programName || "-"}</td>
                    <td>{csa.district || "-"}</td>
                    <td>{csa.dsdDivision || "-"}</td>
                    <td>{csa.ascDivision || "-"}</td>
                    <td>{csa.cascadeName || "-"}</td>
                    <td>{csa.tankOrVisName || "-"}</td>
                    <td>{csa.commandAreaHa || "-"}</td>
                    <td>{csa.producerSociety || "-"}</td>
                    <td>{csa.farmerOrganizationName || "-"}</td>
                    <td>{csa.aiRange || "-"}</td>
                    <td>{csa.gramaNiladhariDivision || "-"}</td>
                    <td>{csa.villageName || "-"}</td>
                    <td>{csa.farmerName || "-"}</td>
                    <td>{csa.address || "-"}</td>
                    <td>{csa.nicNumber || "-"}</td>
                    <td>{csa.telephoneNumber || "-"}</td>
                    <td>
                      {csa.isFemale === 1
                        ? "Yes"
                        : csa.isFemale === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.isMale === 1 ? "Yes" : csa.isMale === 0 ? "No" : "-"}
                    </td>
                    <td>
                      {csa.isSamurdhiBeneficiary === 1
                        ? "Yes"
                        : csa.isSamurdhiBeneficiary === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.isWomanHeadedHousehold === 1
                        ? "Yes"
                        : csa.isWomanHeadedHousehold === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.isDisabled === 1
                        ? "Yes"
                        : csa.isDisabled === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>{csa.cropType || "-"}</td>
                    <td>
                      {csa.isReplicatedCrop === 1
                        ? "Yes"
                        : csa.isReplicatedCrop === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.grownIrrigatedPaddyIndicator === 1
                        ? "Yes"
                        : csa.grownIrrigatedPaddyIndicator === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.grownRainfedPaddyIndicator === 1
                        ? "Yes"
                        : csa.grownRainfedPaddyIndicator === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.grownIrrigatedHighlandIndicator === 1
                        ? "Yes"
                        : csa.grownIrrigatedHighlandIndicator === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.grownRainfedHighlandIndicator === 1
                        ? "Yes"
                        : csa.grownRainfedHighlandIndicator === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.csaCropDiversification === 1
                        ? "Yes"
                        : csa.csaCropDiversification === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.csaSeedProduction === 1
                        ? "Yes"
                        : csa.csaSeedProduction === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.csaInterseason === 1
                        ? "Yes"
                        : csa.csaInterseason === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.csaMicroIrrigation === 1
                        ? "Yes"
                        : csa.csaMicroIrrigation === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.csaHomeGardening === 1
                        ? "Yes"
                        : csa.csaHomeGardening === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.csaAgronomicInterventions === 1
                        ? "Yes"
                        : csa.csaAgronomicInterventions === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.csaTrainingReceived === 1
                        ? "Yes"
                        : csa.csaTrainingReceived === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.iecConducted === 1
                        ? "Yes"
                        : csa.iecConducted === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.ftsTraining === 1
                        ? "Yes"
                        : csa.ftsTraining === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {csa.fbsTraining === 1
                        ? "Yes"
                        : csa.fbsTraining === 0
                          ? "No"
                          : "-"}
                    </td>
                    <td>{csa.varietyName || "-"}</td>
                    <td>{csa.seedQuantityKg?.toLocaleString() || "-"}</td>
                    <td>{csa.extentHa || "-"}</td>
                    <td>{csa.preLossesHa || "-"}</td>
                    <td>{csa.harvestedAreaHa || "-"}</td>
                    <td>{formatCurrency(csa.seedUnitPriceRs)}</td>
                    <td>{formatCurrency(csa.projectSeedExpenseRs)}</td>
                    <td>{formatCurrency(csa.farmerContributionSeedRs)}</td>
                    <td>{formatCurrency(csa.totalSeedCostRs)}</td>
                    <td>{formatCurrency(csa.farmerCostRs)}</td>
                    <td>{formatCurrency(csa.totalCultivationCostRs)}</td>
                    <td>{csa.postLossesKg?.toLocaleString() || "-"}</td>
                    <td>{csa.yieldKg?.toLocaleString() || "-"}</td>
                    <td>{formatCurrency(csa.soldUnitPriceRs)}</td>
                    <td>{formatCurrency(csa.incomeRs)}</td>
                    <td>{formatCurrency(csa.netIncomeRs)}</td>
                    <td>{csa.productivityKgPerHa?.toLocaleString() || "-"}</td>
                    <td>
                      {csa.baselineProductivityKgPerHa?.toLocaleString() || "-"}
                    </td>
                    <td>{csa.yieldIncreaseMt?.toLocaleString() || "-"}</td>
                    <td>
                      {csa.yieldIncreasePercent != null
                        ? `${csa.yieldIncreasePercent.toFixed(2)}%`
                        : "-"}
                    </td>
                    <td>{csa.cdiScore || "-"}</td>
                    <td>
                      {csa.croppingIntensityPercent != null
                        ? `${csa.croppingIntensityPercent.toFixed(2)}%`
                        : "-"}
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
