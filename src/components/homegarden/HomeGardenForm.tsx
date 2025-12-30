import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import homeGardenService from "../../services/homeGardenService";
import { HomeGarden, FormErrors } from "../../types";
import { validateHomeGardenForm } from "../../utils/validation";
import "../farmer/Farmer.css";

const HomeGardenForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const farmerIdFromUrl = searchParams.get("farmerId") || "";
  const isEditMode = !!id;

  const [formData, setFormData] = useState<HomeGarden>({
    farmerId: farmerIdFromUrl,
    year: new Date().getFullYear(),
    programName: "",
    district: "",
    dsdDivision: "",
    ascDivision: "",
    cascadeName: "",
    tankOrVisName: "",
    producerSociety: "",
    aiRange: "",
    gramaNiladhariDivision: "",
    villageName: "",
    farmerName: "",
    address: "",
    nicNumber: "",
    telephoneNumber: "",
    isFemale: 0,
    isMale: 0,
    isSamurdhiBeneficiary: 0,
    isWomanHeadedHousehold: 0,
    isDisabled: 0,
    isCsaConducted: 0,
    isIecConducted: 0,
    extentHa: 0,
    seedPackCount: 0,
    bananaPlantsCount: 0,
    papayaPlantsCount: 0,
    passionfruitPlantsCount: 0,
    lemonPlantsCount: 0,
    compostBags25kgCount: 0,
    growBagsCount: 0,
    totalProjectCostRs: 0,
    vegetableProductionKg: 0,
    homeConsumptionKg: 0,
    shareWithNeighborsKg: 0,
    soldQuantityKg: 0,
    soldPriceRs: 0,
    incomeRs: 0,
    mangoCount: 0,
    orangeCount: 0,
    handSpadeCount: 0,
    handForkCount: 0,
    secateursCount: 0,
    pvcTank500mlCount: 0,
    wateringCanCount: 0,
    mulchingMatCount: 0,
    nurseryTraysCount: 0,
    blackPolytheneCount: 0,
    grossIncomeRs: 0,
    newCultivation1: "",
    newCultivation2: "",
    newCultivation3: "",
    newCultivation4: "",
    newCultivation5: "",
    newCultivation6: "",
    newCultivation7: "",
    newCultivation8: "",
    newCultivation9: "",
    newCultivation10: "",
    newCultivation11: "",
    newCultivation12: "",
    newCultivation13: "",
    newCultivation14: "",
    newCultivation15: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      loadHomeGarden(id);
    }
  }, [id, isEditMode]);

  const loadHomeGarden = async (homeGardenId: string) => {
    try {
      const data = await homeGardenService.getHomeGardenById(homeGardenId);
      setFormData(data);
    } catch (err: any) {
      setApiError(err.message || "Failed to load home garden details");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number = value;

    if (type === "number") {
      newValue = value === "" ? 0 : Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGenderChange = (gender: "male" | "female") => {
    if (gender === "male") {
      setFormData((prev) => ({ ...prev, isMale: 1, isFemale: 0 }));
    } else {
      setFormData((prev) => ({ ...prev, isMale: 0, isFemale: 1 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validateHomeGardenForm(formData, isEditMode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (isEditMode && id) {
        await homeGardenService.updateHomeGarden(id, formData);
      } else {
        await homeGardenService.createHomeGarden(formData);
      }
      navigate("/home-gardens");
    } catch (err: any) {
      setApiError(err.message || "Failed to save home garden");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isEditMode ? "Edit Home Garden" : "Add New Home Garden"}</h2>
      </div>

      {apiError && <div className="error-banner">{apiError}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* Farmer ID */}
        {farmerIdFromUrl && !isEditMode && (
          <div className="form-section">
            <h3 className="form-section-title">Farmer Reference</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Farmer ID</label>
                <input
                  type="text"
                  name="farmerId"
                  value={formData.farmerId || ""}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Basic Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year || ""}
                onChange={handleChange}
                placeholder="e.g., 2025"
                className={errors.year ? "error" : ""}
                disabled={isLoading}
              />
              {errors.year && (
                <span className="error-message">{errors.year}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="programName">Program Name *</label>
              <input
                type="text"
                id="programName"
                name="programName"
                value={formData.programName || ""}
                onChange={handleChange}
                placeholder="Enter program name"
                className={errors.programName ? "error" : ""}
                disabled={isLoading}
              />
              {errors.programName && (
                <span className="error-message">{errors.programName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="form-section">
          <h3 className="form-section-title">Location Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="district">District *</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
                placeholder="e.g., Colombo"
                className={errors.district ? "error" : ""}
                disabled={isLoading}
              />
              {errors.district && (
                <span className="error-message">{errors.district}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dsdDivision">DSD Division</label>
              <input
                type="text"
                id="dsdDivision"
                name="dsdDivision"
                value={formData.dsdDivision || ""}
                onChange={handleChange}
                placeholder="Divisional Secretariat Division"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ascDivision">ASC Division</label>
              <input
                type="text"
                id="ascDivision"
                name="ascDivision"
                value={formData.ascDivision || ""}
                onChange={handleChange}
                placeholder="Agrarian Service Center Division"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cascadeName">Cascade Name</label>
              <input
                type="text"
                id="cascadeName"
                name="cascadeName"
                value={formData.cascadeName || ""}
                onChange={handleChange}
                placeholder="Enter cascade name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tankOrVisName">Tank/VIS Name</label>
              <input
                type="text"
                id="tankOrVisName"
                name="tankOrVisName"
                value={formData.tankOrVisName || ""}
                onChange={handleChange}
                placeholder="Enter tank or VIS name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="producerSociety">Producer Society</label>
              <input
                type="text"
                id="producerSociety"
                name="producerSociety"
                value={formData.producerSociety || ""}
                onChange={handleChange}
                placeholder="Enter producer society"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aiRange">AI Range</label>
              <input
                type="text"
                id="aiRange"
                name="aiRange"
                value={formData.aiRange || ""}
                onChange={handleChange}
                placeholder="Enter AI range"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gramaNiladhariDivision">
                Grama Niladhari Division
              </label>
              <input
                type="text"
                id="gramaNiladhariDivision"
                name="gramaNiladhariDivision"
                value={formData.gramaNiladhariDivision || ""}
                onChange={handleChange}
                placeholder="Enter GN division"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="villageName">Village Name</label>
              <input
                type="text"
                id="villageName"
                name="villageName"
                value={formData.villageName || ""}
                onChange={handleChange}
                placeholder="Enter village name"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Farmer Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Farmer Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="farmerName">Farmer Name *</label>
              <input
                type="text"
                id="farmerName"
                name="farmerName"
                value={formData.farmerName || ""}
                onChange={handleChange}
                placeholder="Enter farmer name"
                className={errors.farmerName ? "error" : ""}
                disabled={isLoading}
              />
              {errors.farmerName && (
                <span className="error-message">{errors.farmerName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nicNumber">NIC Number *</label>
              <input
                type="text"
                id="nicNumber"
                name="nicNumber"
                value={formData.nicNumber || ""}
                onChange={handleChange}
                placeholder="e.g., 123456789V"
                className={errors.nicNumber ? "error" : ""}
                disabled={isLoading}
              />
              {errors.nicNumber && (
                <span className="error-message">{errors.nicNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telephoneNumber">Telephone Number</label>
              <input
                type="text"
                id="telephoneNumber"
                name="telephoneNumber"
                value={formData.telephoneNumber || ""}
                onChange={handleChange}
                placeholder="e.g., 0771234567"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Enter full address"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.isMale === 1}
                    onChange={() => handleGenderChange("male")}
                    disabled={isLoading}
                  />
                  <span className="checkbox-text">Male</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="gender"
                    checked={formData.isFemale === 1}
                    onChange={() => handleGenderChange("female")}
                    disabled={isLoading}
                  />
                  <span className="checkbox-text">Female</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Status Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">Status Information</h3>
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isSamurdhiBeneficiary"
                checked={!!formData.isSamurdhiBeneficiary}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">Samurdhi Beneficiary</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isWomanHeadedHousehold"
                checked={!!formData.isWomanHeadedHousehold}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">Woman Headed Household</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDisabled"
                checked={!!formData.isDisabled}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">Person with Disability</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isCsaConducted"
                checked={!!formData.isCsaConducted}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">CSA Conducted</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isIecConducted"
                checked={!!formData.isIecConducted}
                onChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <span className="checkbox-text">IEC Conducted</span>
            </label>
          </div>
        </div>

        {/* Garden Details Section */}
        <div className="form-section">
          <h3 className="form-section-title">Garden Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="extentHa">Extent (Ha)</label>
              <input
                type="number"
                id="extentHa"
                name="extentHa"
                value={formData.extentHa || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="seedPackCount">Seed Pack Count</label>
              <input
                type="number"
                id="seedPackCount"
                name="seedPackCount"
                value={formData.seedPackCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="growBagsCount">Grow Bags Count</label>
              <input
                type="number"
                id="growBagsCount"
                name="growBagsCount"
                value={formData.growBagsCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="compostBags25kgCount">
                Compost Bags (25kg) Count
              </label>
              <input
                type="number"
                id="compostBags25kgCount"
                name="compostBags25kgCount"
                value={formData.compostBags25kgCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Plants Section */}
        <div className="form-section">
          <h3 className="form-section-title">Plants</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bananaPlantsCount">Banana Plants</label>
              <input
                type="number"
                id="bananaPlantsCount"
                name="bananaPlantsCount"
                value={formData.bananaPlantsCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="papayaPlantsCount">Papaya Plants</label>
              <input
                type="number"
                id="papayaPlantsCount"
                name="papayaPlantsCount"
                value={formData.papayaPlantsCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="passionfruitPlantsCount">
                Passionfruit Plants
              </label>
              <input
                type="number"
                id="passionfruitPlantsCount"
                name="passionfruitPlantsCount"
                value={formData.passionfruitPlantsCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lemonPlantsCount">Lemon Plants</label>
              <input
                type="number"
                id="lemonPlantsCount"
                name="lemonPlantsCount"
                value={formData.lemonPlantsCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="mangoCount">Mango Plants</label>
              <input
                type="number"
                id="mangoCount"
                name="mangoCount"
                value={formData.mangoCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="orangeCount">Orange Plants</label>
              <input
                type="number"
                id="orangeCount"
                name="orangeCount"
                value={formData.orangeCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="form-section">
          <h3 className="form-section-title">Equipment</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="handSpadeCount">Hand Spade</label>
              <input
                type="number"
                id="handSpadeCount"
                name="handSpadeCount"
                value={formData.handSpadeCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="handForkCount">Hand Fork</label>
              <input
                type="number"
                id="handForkCount"
                name="handForkCount"
                value={formData.handForkCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="secateursCount">Secateurs</label>
              <input
                type="number"
                id="secateursCount"
                name="secateursCount"
                value={formData.secateursCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pvcTank500mlCount">PVC Tank (500ml)</label>
              <input
                type="number"
                id="pvcTank500mlCount"
                name="pvcTank500mlCount"
                value={formData.pvcTank500mlCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="wateringCanCount">Watering Can</label>
              <input
                type="number"
                id="wateringCanCount"
                name="wateringCanCount"
                value={formData.wateringCanCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="mulchingMatCount">Mulching Mat</label>
              <input
                type="number"
                id="mulchingMatCount"
                name="mulchingMatCount"
                value={formData.mulchingMatCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nurseryTraysCount">Nursery Trays</label>
              <input
                type="number"
                id="nurseryTraysCount"
                name="nurseryTraysCount"
                value={formData.nurseryTraysCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="blackPolytheneCount">Black Polythene</label>
              <input
                type="number"
                id="blackPolytheneCount"
                name="blackPolytheneCount"
                value={formData.blackPolytheneCount || ""}
                onChange={handleChange}
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Production & Income Section */}
        <div className="form-section">
          <h3 className="form-section-title">Production & Income</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vegetableProductionKg">
                Vegetable Production (Kg)
              </label>
              <input
                type="number"
                id="vegetableProductionKg"
                name="vegetableProductionKg"
                value={formData.vegetableProductionKg || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="homeConsumptionKg">Home Consumption (Kg)</label>
              <input
                type="number"
                id="homeConsumptionKg"
                name="homeConsumptionKg"
                value={formData.homeConsumptionKg || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shareWithNeighborsKg">
                Share with Neighbors (Kg)
              </label>
              <input
                type="number"
                id="shareWithNeighborsKg"
                name="shareWithNeighborsKg"
                value={formData.shareWithNeighborsKg || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="soldQuantityKg">Sold Quantity (Kg)</label>
              <input
                type="number"
                id="soldQuantityKg"
                name="soldQuantityKg"
                value={formData.soldQuantityKg || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="soldPriceRs">Sold Price (Rs)</label>
              <input
                type="number"
                id="soldPriceRs"
                name="soldPriceRs"
                value={formData.soldPriceRs || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="incomeRs">Income (Rs)</label>
              <input
                type="number"
                id="incomeRs"
                name="incomeRs"
                value={formData.incomeRs || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="grossIncomeRs">Gross Income (Rs)</label>
              <input
                type="number"
                id="grossIncomeRs"
                name="grossIncomeRs"
                value={formData.grossIncomeRs || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalProjectCostRs">
                Total Project Cost (Rs)
              </label>
              <input
                type="number"
                id="totalProjectCostRs"
                name="totalProjectCostRs"
                value={formData.totalProjectCostRs || ""}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* New Cultivations Section */}
        <div className="form-section">
          <h3 className="form-section-title">New Cultivations</h3>
          <div className="form-row">
            {[1, 2, 3, 4, 5].map((num) => (
              <div className="form-group" key={`cult${num}`}>
                <label htmlFor={`newCultivation${num}`}>
                  Cultivation {num}
                </label>
                <input
                  type="text"
                  id={`newCultivation${num}`}
                  name={`newCultivation${num}`}
                  value={(formData as any)[`newCultivation${num}`] || ""}
                  onChange={handleChange}
                  placeholder={`Cultivation ${num}`}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
          <div className="form-row">
            {[6, 7, 8, 9, 10].map((num) => (
              <div className="form-group" key={`cult${num}`}>
                <label htmlFor={`newCultivation${num}`}>
                  Cultivation {num}
                </label>
                <input
                  type="text"
                  id={`newCultivation${num}`}
                  name={`newCultivation${num}`}
                  value={(formData as any)[`newCultivation${num}`] || ""}
                  onChange={handleChange}
                  placeholder={`Cultivation ${num}`}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
          <div className="form-row">
            {[11, 12, 13, 14, 15].map((num) => (
              <div className="form-group" key={`cult${num}`}>
                <label htmlFor={`newCultivation${num}`}>
                  Cultivation {num}
                </label>
                <input
                  type="text"
                  id={`newCultivation${num}`}
                  name={`newCultivation${num}`}
                  value={(formData as any)[`newCultivation${num}`] || ""}
                  onChange={handleChange}
                  placeholder={`Cultivation ${num}`}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/home-gardens")}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update Home Garden"
              : "Add Home Garden"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeGardenForm;
