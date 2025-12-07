import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import homeGardenService from '../../services/homeGardenService';
import farmerService from '../../services/farmerService';
import { HomeGarden, Farmer, FormErrors } from '../../types';
import { validateHomeGardenForm } from '../../utils/validation';
import '../farmer/Farmer.css';

const HomeGardenForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedFarmerId = searchParams.get('farmerId');

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [cropTypesInput, setCropTypesInput] = useState('');
  const [formData, setFormData] = useState<HomeGarden>({
    farmerId: preselectedFarmerId || '',
    gardenSize: 0,
    cropTypes: [],
    irrigationMethod: '',
    organicFertilizer: false,
    chemicalFertilizer: false,
    startDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const response = await farmerService.getAllFarmers(1, 100);
      setFarmers(response.data);
    } catch (err) {
      setApiError('Failed to load farmers');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'gardenSize' ? Number(value) : value),
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCropTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCropTypesInput(value);
    const crops = value.split(',').map(crop => crop.trim()).filter(crop => crop);
    setFormData((prev) => ({ ...prev, cropTypes: crops }));
    if (errors.cropTypes) {
      setErrors((prev) => ({ ...prev, cropTypes: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validateHomeGardenForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await homeGardenService.createHomeGarden(formData);
      navigate('/home-gardens');
    } catch (err: any) {
      setApiError(err.message || 'Failed to save home garden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Add Home Garden</h2>
      </div>

      {apiError && <div className="error-banner">{apiError}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="farmerId">Farmer *</label>
            <select
              id="farmerId"
              name="farmerId"
              value={formData.farmerId}
              onChange={handleChange}
              className={errors.farmerId ? 'error' : ''}
              disabled={isLoading}
            >
              <option value="">Select Farmer</option>
              {farmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.nic} - {farmer.firstName} {farmer.lastName}
                </option>
              ))}
            </select>
            {errors.farmerId && <span className="error-message">{errors.farmerId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gardenSize">Garden Size (sq m) *</label>
            <input
              type="number"
              id="gardenSize"
              name="gardenSize"
              value={formData.gardenSize}
              onChange={handleChange}
              className={errors.gardenSize ? 'error' : ''}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
            {errors.gardenSize && <span className="error-message">{errors.gardenSize}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="cropTypes">Crop Types (comma-separated) *</label>
            <input
              type="text"
              id="cropTypes"
              name="cropTypes"
              value={cropTypesInput}
              onChange={handleCropTypesChange}
              className={errors.cropTypes ? 'error' : ''}
              disabled={isLoading}
              placeholder="e.g., Tomato, Cabbage, Carrot"
            />
            {errors.cropTypes && <span className="error-message">{errors.cropTypes}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="irrigationMethod">Irrigation Method</label>
            <select
              id="irrigationMethod"
              name="irrigationMethod"
              value={formData.irrigationMethod}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select Method</option>
              <option value="Drip">Drip Irrigation</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Manual">Manual</option>
              <option value="None">None</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="organicFertilizer"
                  name="organicFertilizer"
                  checked={formData.organicFertilizer}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="organicFertilizer">Organic Fertilizer</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="chemicalFertilizer"
                  name="chemicalFertilizer"
                  checked={formData.chemicalFertilizer}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="chemicalFertilizer">Chemical Fertilizer</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/home-gardens')}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Home Garden'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeGardenForm;
