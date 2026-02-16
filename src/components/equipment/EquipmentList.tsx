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
  { key: "recordId", label: "Record ID", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "programName", label: "Program Name", type: "text" },
  { key: "district", label: "District", type: "text" },
  { key: "dsdDivision", label: "DSD Division", type: "text" },
  { key: "ascDivision", label: "ASC Division", type: "text" },
  { key: "cascadeName", label: "Cascade Name", type: "text" },
  { key: "farmerOrganizationName", label: "Farmer Organization", type: "text" },
  { key: "aiRange", label: "AI Range", type: "text" },
  { key: "gramaNiladhariDivision", label: "GN Division", type: "text" },
  { key: "villageName", label: "Village Name", type: "text" },
  { key: "equipmentName", label: "Equipment Name", type: "text" },
  {
    key: "equipmentNameStandard",
    label: "Equipment Name Standard",
    type: "text",
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
  { key: "noOfEquipment", label: "No. of Equipment", type: "number" },
  {
    key: "descriptiveExtentHa",
    label: "Descriptive Extent (Ha)",
    type: "text",
  },
  { key: "extentHa", label: "Extent (Ha)", type: "number" },
  { key: "stepApprovalNumber", label: "Step Approval Number", type: "text" },
  {
    key: "descriptiveUnitPriceRs",
    label: "Descriptive Unit Price (Rs)",
    type: "text",
  },
  { key: "unitPriceRs", label: "Unit Price (Rs)", type: "number" },
  {
    key: "totalProjectCostRs",
    label: "Total Project Cost (Rs)",
    type: "number",
  },
  {
    key: "descriptiveFarmerCostRs",
    label: "Descriptive Farmer Cost (Rs)",
    type: "text",
  },
  { key: "farmerCostRs", label: "Farmer Cost (Rs)", type: "number" },
  { key: "provinceCode", label: "Province Code", type: "text" },
];

interface FilterValues {
  [key: string]: string;
}

const EquipmentList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";

  const [equipments, setEquipments] = useState<Equipment[]>([]);
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
      ? ["farmerId", "recordId", "district", "equipmentName"]
      : ["recordId", "district", "equipmentName"],
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
        farmerId: filterValues.farmerId
          ? Number(filterValues.farmerId)
          : undefined,
        recordId: filterValues.recordId
          ? Number(filterValues.recordId)
          : undefined,
        district: filterValues.district || "",
        villageName: filterValues.villageName || "",
        equipmentName: filterValues.equipmentName || "",
        equipmentNameStandard: filterValues.equipmentNameStandard || "",
        programName: filterValues.programName || "",
        year: filterValues.year || undefined,
        dsdDivision: filterValues.dsdDivision || "",
        ascDivision: filterValues.ascDivision || "",
        cascadeName: filterValues.cascadeName || "",
        farmerOrganizationName: filterValues.farmerOrganizationName || "",
        aiRange: filterValues.aiRange || "",
        gramaNiladhariDivision: filterValues.gramaNiladhariDivision || "",
        stepApprovalNumber: filterValues.stepApprovalNumber || "",
        provinceCode: filterValues.provinceCode || "",
        isReplicated: filterValues.isReplicated || undefined,
        noOfEquipment: filterValues.noOfEquipment
          ? Number(filterValues.noOfEquipment)
          : undefined,
        descriptiveExtentHa: filterValues.descriptiveExtentHa || "",
        extentHa: filterValues.extentHa
          ? Number(filterValues.extentHa)
          : undefined,
        descriptiveUnitPriceRs: filterValues.descriptiveUnitPriceRs || "",
        unitPriceRs: filterValues.unitPriceRs
          ? Number(filterValues.unitPriceRs)
          : undefined,
        totalProjectCostRs: filterValues.totalProjectCostRs
          ? Number(filterValues.totalProjectCostRs)
          : undefined,
        descriptiveFarmerCostRs: filterValues.descriptiveFarmerCostRs || "",
        farmerCostRs: filterValues.farmerCostRs
          ? Number(filterValues.farmerCostRs)
          : undefined,
      };
      const result = await equipmentService.getAllEquipments(
        currentPage,
        pageSize,
        filter,
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
    setFilterValues(farmerIdFromUrl ? { farmerId: farmerIdFromUrl } : {});
    setCurrentPage(1);
    loadEquipments();
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
        disabled={filter.key === "farmerId"}
      />
    );
  };

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
            Equipment Management
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
                to={`/equipment/new?farmerId=${farmerIdFromUrl}`}
                className="btn btn-primary"
              >
                Add New Equipment
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
        <div className="loading">Loading equipment...</div>
      ) : (
        <div className="table-container">
          {equipments.length > 0 && (
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
                <th>Record ID</th>
                <th>Year</th>
                <th>Program</th>
                <th>District</th>
                <th>Equipment Name</th>
                <th>Equipment Name Standard</th>
                <th>No. of Equipment</th>
                <th>Unit Price (Rs)</th>
                <th>Total Cost (Rs)</th>
                <th>Farmer Cost (Rs)</th>
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
                  <tr key={equipment.equipmentRecordPk}>
                    <td>
                      <Link
                        to={`/equipment/${equipment.equipmentRecordPk}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                    </td>
                    <td>{equipment.recordId}</td>
                    <td>{equipment.year}</td>
                    <td>{equipment.programName}</td>
                    <td>{equipment.district}</td>
                    <td>{equipment.equipmentName}</td>
                    <td>{equipment.equipmentNameStandard}</td>
                    <td>{equipment.noOfEquipment}</td>
                    <td>{equipment.unitPriceRs?.toLocaleString()}</td>
                    <td>{equipment.totalProjectCostRs?.toLocaleString()}</td>
                    <td>{equipment.farmerCostRs?.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && equipments.length > 0 && (
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
                Math.min(Math.ceil(totalCount / pageSize) || 1, prev + 1),
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

export default EquipmentList;
