import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import homeGardenService from "../../services/homeGardenService";
import { HomeGarden } from "../../types";
import "../farmer/Farmer.css";
import "./HomeGarden.css";

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
  { key: "programName", label: "Program Name", type: "text" },
  { key: "year", label: "Year", type: "number" },
  { key: "dsdDivision", label: "DSD Division", type: "text" },
  { key: "ascDivision", label: "ASC Division", type: "text" },
  { key: "cascadeName", label: "Cascade Name", type: "text" },
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

const HomeGardenList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";

  const [homeGardens, setHomeGardens] = useState<HomeGarden[]>([]);
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
      ? ["farmerId", "nicNumber", "farmerName", "district", "villageName"]
      : ["nicNumber", "farmerName", "district", "villageName"]
  );
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  useEffect(() => {
    loadHomeGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadHomeGardens = async () => {
    setIsLoading(true);
    setError("");
    try {
      const filter: HomeGarden = {
        farmerId: filterValues.farmerId || undefined,
        nicNumber: filterValues.nicNumber || "",
        farmerName: filterValues.farmerName || "",
        district: filterValues.district || "",
        villageName: filterValues.villageName || "",
        programName: filterValues.programName || "",
        year: filterValues.year ? Number(filterValues.year) : undefined,
        dsdDivision: filterValues.dsdDivision || "",
        ascDivision: filterValues.ascDivision || "",
        cascadeName: filterValues.cascadeName || "",
        gramaNiladhariDivision: filterValues.gramaNiladhariDivision || "",
        isFemale: filterValues.isFemale
          ? Number(filterValues.isFemale)
          : undefined,
        isMale: filterValues.isMale ? Number(filterValues.isMale) : undefined,
        isSamurdhiBeneficiary: filterValues.isSamurdhiBeneficiary
          ? Number(filterValues.isSamurdhiBeneficiary)
          : undefined,
        isWomanHeadedHousehold: filterValues.isWomanHeadedHousehold
          ? Number(filterValues.isWomanHeadedHousehold)
          : undefined,
        isDisabled: filterValues.isDisabled
          ? Number(filterValues.isDisabled)
          : undefined,
        isCsaConducted: filterValues.isCsaConducted
          ? Number(filterValues.isCsaConducted)
          : undefined,
        isIecConducted: filterValues.isIecConducted
          ? Number(filterValues.isIecConducted)
          : undefined,
      };
      const response = await homeGardenService.getAllHomeGardens(
        currentPage - 1,
        pageSize,
        filter
      );
      setTotalCount(response.totalCount || 0);
      setHomeGardens(response.homeGardens || []);
    } catch (err: any) {
      setError(err.message || "Failed to load home gardens");
      setHomeGardens([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadHomeGardens();
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this home garden record?"
      )
    ) {
      return;
    }

    try {
      await homeGardenService.deleteHomeGarden(id);
      loadHomeGardens();
    } catch (err: any) {
      alert("Failed to delete home garden: " + err.message);
    }
  };

  const toggleFilterVisibility = (filterKey: string) => {
    setVisibleFilters((prev) => {
      if (prev.includes(filterKey)) {
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
    <div className="page-container">
      <div className="page-header">
        <h2>Home Garden Management</h2>
        {farmerIdFromUrl && (
          <Link
            to={`/home-gardens/new?farmerId=${farmerIdFromUrl}`}
            className="btn btn-primary"
          >
            Add New Home Garden
          </Link>
        )}
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          {FILTER_OPTIONS.filter((opt) => visibleFilters.includes(opt.key)).map(
            (option) => (
              <div key={option.key} className="filter-field">
                <label className="filter-label">{option.label}</label>
                {option.type === "text" || option.type === "number" ? (
                  <input
                    type={option.type}
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
                loadHomeGardens();
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
        <div className="loading">Loading home gardens...</div>
      ) : (
        <div className="table-scroll-container">
          <div className="table-container">
            <table className="data-table home-garden-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Program</th>
                  <th>NIC</th>
                  <th>Farmer Name</th>
                  <th>District</th>
                  <th>Village</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Extent (Ha)</th>
                  <th>Income (Rs)</th>
                  <th>Gross Income (Rs)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {homeGardens.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="no-data">
                      No home gardens found
                    </td>
                  </tr>
                ) : (
                  homeGardens.map((garden) => (
                    <tr key={garden.homeGardenId}>
                      <td>{garden.year || "-"}</td>
                      <td>{garden.programName || "-"}</td>
                      <td>{garden.nicNumber || "-"}</td>
                      <td>{garden.farmerName || "-"}</td>
                      <td>{garden.district || "-"}</td>
                      <td>{garden.villageName || "-"}</td>
                      <td>{garden.telephoneNumber || "-"}</td>
                      <td>
                        {garden.isMale === 1
                          ? "Male"
                          : garden.isFemale === 1
                          ? "Female"
                          : "-"}
                      </td>
                      <td>{garden.extentHa ?? "-"}</td>
                      <td>{garden.incomeRs ?? "-"}</td>
                      <td>{garden.grossIncomeRs ?? "-"}</td>
                      <td className="actions">
                        <Link
                          to={`/home-gardens/${garden.homeGardenId}`}
                          className="btn-link"
                        >
                          View
                        </Link>
                        <Link
                          to={`/home-gardens/${garden.homeGardenId}/edit`}
                          className="btn-link"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            garden.homeGardenId &&
                            handleDelete(garden.homeGardenId)
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
        </div>
      )}

      {!isLoading && homeGardens.length > 0 && (
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
                const value = e.target.value.trim();
                if (value !== "") {
                  let pageNumber = Number(value);
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

export default HomeGardenList;
