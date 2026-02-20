import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import dashboardService from "../../services/dashboardService";
import { DashboardSummary, DistrictStatistics } from "../../types";
import SriLankaMap, { normalizeDistrictName } from "./SriLankaMap";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [districtStats, setDistrictStats] = useState<DistrictStatistics[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedDistrictData, setSelectedDistrictData] =
    useState<DistrictStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryData, districtData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getAllDistrictStatistics(),
        ]);
        setSummary(summaryData);
        setDistrictStats(districtData);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDistrictClick = useCallback(
    async (districtName: string) => {
      if (selectedDistrict === districtName) {
        setSelectedDistrict(null);
        setSelectedDistrictData(null);
        return;
      }
      setSelectedDistrict(districtName);
      setDistrictLoading(true);

      // First check if we have the data in the already-fetched list
      const existing = districtStats.find(
        (d) => normalizeDistrictName(d.district) === districtName,
      );
      if (existing) {
        setSelectedDistrictData(existing);
        setDistrictLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        const data = await dashboardService.getDistrictStatistics(districtName);
        setSelectedDistrictData(data);
      } catch {
        setSelectedDistrictData(null);
      } finally {
        setDistrictLoading(false);
      }
    },
    [selectedDistrict, districtStats],
  );

  // Build the map data: district name -> farmer count
  const districtMapData = new Map<string, number>();
  districtStats.forEach((d) => {
    const normalized = normalizeDistrictName(d.district);
    districtMapData.set(normalized, d.farmerCount);
  });

  const formatNumber = (num: number | undefined | null): string => {
    if (num === null || num === undefined) return "0";
    return num.toLocaleString();
  };

  const formatCurrency = (num: number | undefined | null): string => {
    if (num === null || num === undefined) return "Rs. 0";
    return `Rs. ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatWeight = (kg: number | undefined | null): string => {
    if (kg === null || kg === undefined) return "0 kg";
    if (kg >= 1000)
      return `${(kg / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MT`;
    return `${kg.toLocaleString()} kg`;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-subtitle">
            Climate Smart Irrigated Agriculture Project — Data Overview
          </p>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="metrics-grid">
        <Link to="/farmers" className="metric-card metric-farmers">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(summary?.totalFarmers)}
            </span>
            <span className="metric-label">Total Farmers</span>
          </div>
        </Link>

        <Link to="/equipment" className="metric-card metric-equipment">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(summary?.totalEquipment)}
            </span>
            <span className="metric-label">Equipment Records</span>
          </div>
        </Link>

        <Link to="/home-gardens" className="metric-card metric-gardens">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(summary?.totalHomeGardens)}
            </span>
            <span className="metric-label">Home Gardens</span>
          </div>
        </Link>

        <Link to="/csa-agriculture" className="metric-card metric-csa">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(summary?.totalCsaAgriculture)}
            </span>
            <span className="metric-label">CSA Agriculture</span>
          </div>
        </Link>

        <Link to="/agro-wells" className="metric-card metric-wells">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(summary?.totalAgroWells)}
            </span>
            <span className="metric-label">Agro Wells</span>
          </div>
        </Link>

        <Link to="/poultry" className="metric-card metric-poultry">
          <div className="metric-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(summary?.totalPoultryFarms)}
            </span>
            <span className="metric-label">Poultry Farms</span>
          </div>
        </Link>
      </div>

      {/* Yield Summary Bar */}
      <div className="yield-summary-bar">
        <div className="yield-item">
          <span className="yield-icon">📊</span>
          <div>
            <span className="yield-value">
              {formatWeight(summary?.totalYieldKg)}
            </span>
            <span className="yield-label">Total Yield</span>
          </div>
        </div>
        <div className="yield-item">
          <span className="yield-icon">📍</span>
          <div>
            <span className="yield-value">{districtStats.length}</span>
            <span className="yield-label">Active Districts</span>
          </div>
        </div>
        <div className="yield-item">
          <span className="yield-icon">📈</span>
          <div>
            <span className="yield-value">
              {formatNumber(
                summary
                  ? summary.totalFarmers +
                      summary.totalEquipment +
                      summary.totalHomeGardens +
                      summary.totalCsaAgriculture +
                      summary.totalAgroWells +
                      summary.totalPoultryFarms
                  : 0,
              )}
            </span>
            <span className="yield-label">Total Records</span>
          </div>
        </div>
      </div>

      {/* Map and District Details */}
      <div className="map-section">
        <div className="map-panel">
          <h3 className="section-title">Sri Lanka — District Map</h3>
          <p className="section-subtitle">
            Click on a district to view its statistics
          </p>
          <div className="map-wrapper">
            <SriLankaMap
              selectedDistrict={selectedDistrict}
              districtData={districtMapData}
              onDistrictClick={handleDistrictClick}
            />
          </div>
        </div>

        <div className="district-panel">
          {selectedDistrict && selectedDistrictData ? (
            <>
              <h3 className="section-title district-title">
                {selectedDistrict} District
              </h3>
              {districtLoading ? (
                <div className="district-loading">
                  <div className="loading-spinner small" />
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="district-stats">
                  <div className="district-stat-row">
                    <span className="stat-dot farmers" />
                    <span className="stat-name">Farmers</span>
                    <span className="stat-value">
                      {formatNumber(selectedDistrictData.farmerCount)}
                    </span>
                  </div>
                  <div className="district-stat-row">
                    <span className="stat-dot equipment" />
                    <span className="stat-name">Equipment</span>
                    <span className="stat-value">
                      {formatNumber(selectedDistrictData.equipmentCount)}
                    </span>
                  </div>
                  <div className="district-stat-row">
                    <span className="stat-dot gardens" />
                    <span className="stat-name">Home Gardens</span>
                    <span className="stat-value">
                      {formatNumber(selectedDistrictData.homeGardenCount)}
                    </span>
                  </div>
                  <div className="district-stat-row">
                    <span className="stat-dot csa" />
                    <span className="stat-name">CSA Agriculture</span>
                    <span className="stat-value">
                      {formatNumber(selectedDistrictData.csaAgricultureCount)}
                    </span>
                  </div>
                  <div className="district-stat-row">
                    <span className="stat-dot wells" />
                    <span className="stat-name">Agro Wells</span>
                    <span className="stat-value">
                      {formatNumber(selectedDistrictData.agroWellCount)}
                    </span>
                  </div>
                  <div className="district-stat-row">
                    <span className="stat-dot poultry" />
                    <span className="stat-name">Poultry Farms</span>
                    <span className="stat-value">
                      {formatNumber(selectedDistrictData.poultryFarmCount)}
                    </span>
                  </div>

                  <div className="district-divider" />

                  <div className="district-aggregate">
                    <div className="aggregate-item">
                      <span className="aggregate-label">Total Yield</span>
                      <span className="aggregate-value yield">
                        {formatWeight(selectedDistrictData.totalYieldKg)}
                      </span>
                    </div>
                    <div className="aggregate-item">
                      <span className="aggregate-label">Total Income</span>
                      <span className="aggregate-value income">
                        {formatCurrency(selectedDistrictData.totalIncomeRs)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="district-placeholder">
              <div className="placeholder-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </svg>
              </div>
              <h4>Select a District</h4>
              <p>
                Click on any district on the map to view detailed statistics
                including farmer counts, equipment, agriculture data, yield, and
                income.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* District Rankings Table */}
      {districtStats.length > 0 && (
        <div className="rankings-section">
          <h3 className="section-title">District Rankings</h3>
          <div className="rankings-table-wrapper">
            <table className="rankings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>District</th>
                  <th>Farmers</th>
                  <th>Equipment</th>
                  <th>Home Gardens</th>
                  <th>CSA Agri.</th>
                  <th>Agro Wells</th>
                  <th>Poultry</th>
                  <th>Yield</th>
                  <th>Income</th>
                </tr>
              </thead>
              <tbody>
                {districtStats.map((d, idx) => {
                  const normalized = normalizeDistrictName(d.district);
                  const isActive = selectedDistrict === normalized;
                  return (
                    <tr
                      key={d.district}
                      className={isActive ? "active-row" : ""}
                      onClick={() => handleDistrictClick(normalized)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="rank-cell">{idx + 1}</td>
                      <td className="district-name-cell">{d.district}</td>
                      <td>{formatNumber(d.farmerCount)}</td>
                      <td>{formatNumber(d.equipmentCount)}</td>
                      <td>{formatNumber(d.homeGardenCount)}</td>
                      <td>{formatNumber(d.csaAgricultureCount)}</td>
                      <td>{formatNumber(d.agroWellCount)}</td>
                      <td>{formatNumber(d.poultryFarmCount)}</td>
                      <td>{formatWeight(d.totalYieldKg)}</td>
                      <td className="income-cell">
                        {formatCurrency(d.totalIncomeRs)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="about-section">
        <h3 className="section-title">About CSIAP</h3>
        <p>
          The Climate Smart Irrigated Agriculture Project (CSIAP), in
          collaboration with the FAO and World Bank, aims to digitize and
          centralize farmer-level data to support data-driven agricultural
          planning and policy-making in Sri Lanka.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
