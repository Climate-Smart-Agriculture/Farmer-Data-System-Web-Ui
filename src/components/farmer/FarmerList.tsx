import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import farmerService from "../../services/farmerService";
import { Farmer } from "../../types";
import "./Farmer.css";

interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { value: string; label: string }[];
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "nicNumber", label: "NIC Number", type: "text" },
  { key: "farmerName", label: "Farmer Name", type: "text" },
  { key: "address", label: "Address", type: "text" },
  { key: "telephoneNumber", label: "Telephone Number", type: "text" },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "", label: "All Genders" },
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
    ],
  },
  { key: "district", label: "District", type: "text" },
  { key: "villageName", label: "Village Name", type: "text" },
  { key: "ascDivision", label: "ASC Division", type: "text" },
  { key: "dsdDivision", label: "DSD Division", type: "text" },
  { key: "aiRange", label: "AI Range", type: "text" },
  { key: "gramaNiladhariDivision", label: "GN Division", type: "text" },
  { key: "cascadeName", label: "Cascade Name", type: "text" },
  { key: "tankOrVisName", label: "Tank/VIS Name", type: "text" },
  { key: "producerSociety", label: "Producer Society", type: "text" },
  { key: "farmerOrganizationName", label: "Farmer Organization", type: "text" },
  { key: "provinceCode", label: "Province Code", type: "text" },
  {
    key: "isDisabled",
    label: "Disabled",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
  },
  {
    key: "isWomanHeadedHousehold",
    label: "Woman Headed Household",
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
    key: "isCsaConducted",
    label: "CSA Conducted",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
  },
  {
    key: "isIecConducted",
    label: "IEC Conducted",
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

const FarmerList: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleFilters, setVisibleFilters] = useState<string[]>([
    "nicNumber",
    "farmerName",
    "address",
    "district",
  ]);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  useEffect(() => {
    loadFarmers();
  }, [currentPage]);

  const loadFarmers = async (page: number = currentPage) => {
    setIsLoading(true);
    setError("");
    try {
      const filter: Farmer = {
        nicNumber: filterValues.nicNumber || "",
        farmerName: filterValues.farmerName || "",
        address: filterValues.address || "",
        telephoneNumber: filterValues.telephoneNumber || "",
        gender: filterValues.gender || "",
        district: filterValues.district || "",
        villageName: filterValues.villageName || "",
        ascDivision: filterValues.ascDivision || "",
        dsdDivision: filterValues.dsdDivision || "",
        aiRange: filterValues.aiRange || "",
        gramaNiladhariDivision: filterValues.gramaNiladhariDivision || "",
        cascadeName: filterValues.cascadeName || "",
        tankOrVisName: filterValues.tankOrVisName || "",
        producerSociety: filterValues.producerSociety || "",
        farmerOrganizationName: filterValues.farmerOrganizationName || "",
        provinceCode: filterValues.provinceCode || "",
        isDisabled: filterValues.isDisabled || undefined,
        isWomanHeadedHousehold:
          filterValues.isWomanHeadedHousehold || undefined,
        isSamurdhiBeneficiary: filterValues.isSamurdhiBeneficiary || undefined,
        isCsaConducted: filterValues.isCsaConducted || undefined,
        isIecConducted: filterValues.isIecConducted || undefined,
      };
      const response = await farmerService.getAllFarmers(
        currentPage - 1,
        pageSize,
        filter,
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

  const toggleFilterVisibility = (filterKey: string) => {
    setVisibleFilters((prev) => {
      if (prev.includes(filterKey)) {
        // Remove filter and clear its value
        setFilterValues((prevValues) => {
          const newValues = { ...prevValues };
          delete newValues[filterKey];
          return newValues;
        });
        return prev.filter((key) => key !== filterKey);
      } else {
        return [...prev, filterKey];
      }
    });
  };

  const updateFilterValue = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.values(filterValues).some((v) => v !== "");

  return (
    <div className="list-page-container">
      <div className="page-header">
        <h2>Farmer Management</h2>
        <Link to="/farmers/new" className="btn btn-primary">
          Add New Farmer
        </Link>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          {FILTER_OPTIONS.filter((opt) => visibleFilters.includes(opt.key)).map(
            (option) => (
              <div key={option.key} className="filter-field">
                <label className="filter-label">{option.label}</label>
                {option.type === "text" ? (
                  <input
                    type="text"
                    placeholder={`Search by ${option.label.toLowerCase()}...`}
                    value={filterValues[option.key] || ""}
                    onChange={(e) =>
                      updateFilterValue(option.key, e.target.value)
                    }
                    className="search-input"
                  />
                ) : (
                  <select
                    value={filterValues[option.key] || ""}
                    onChange={(e) =>
                      updateFilterValue(option.key, e.target.value)
                    }
                    className="search-select"
                  >
                    {option.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
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
                {FILTER_OPTIONS.map((option) => (
                  <label key={option.key} className="more-dropdown-item">
                    <input
                      type="checkbox"
                      checked={visibleFilters.includes(option.key)}
                      onChange={() => toggleFilterVisibility(option.key)}
                    />
                    <span>{option.label}</span>
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
              onClick={() => {
                setFilterValues({});
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
          {farmers.length > 0 && (
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
                <th>NIC Number</th>
                <th>Farmer Name</th>
                <th>Address</th>
                <th>Telephone</th>
                <th>Gender</th>
                <th>District</th>
                <th>Village</th>
                <th>ASC Div</th>
                <th>DSD Div</th>
                <th>Disabled</th>
                <th>Woman Headed</th>
                <th>Samurdhi</th>
              </tr>
            </thead>
            <tbody>
              {farmers.length === 0 ? (
                <tr>
                  <td colSpan={13} className="no-data">
                    No farmers found
                  </td>
                </tr>
              ) : (
                farmers.map((farmer, index) => (
                  <tr key={farmer.farmerId}>
                    <td>
                      <Link
                        to={`/farmers/${farmer.farmerId}`}
                        className="btn-link"
                      >
                        View
                      </Link>
                    </td>
                    <td>{farmer.nicNumber}</td>
                    <td>{farmer.farmerName}</td>
                    <td>{farmer.address}</td>
                    <td>{farmer.telephoneNumber}</td>
                    <td>{farmer.gender || "-"}</td>
                    <td>{farmer.district || "-"}</td>
                    <td>{farmer.villageName || "-"}</td>
                    <td>{farmer.ascDivision || "-"}</td>
                    <td>{farmer.dsdDivision || "-"}</td>
                    <td>
                      {farmer.isDisabled === "1"
                        ? "Yes"
                        : farmer.isDisabled === "0"
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {farmer.isWomanHeadedHousehold === "1"
                        ? "Yes"
                        : farmer.isWomanHeadedHousehold === "0"
                          ? "No"
                          : "-"}
                    </td>
                    <td>
                      {farmer.isSamurdhiBeneficiary === "1"
                        ? "Yes"
                        : farmer.isSamurdhiBeneficiary === "0"
                          ? "No"
                          : "-"}
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

export default FarmerList;
