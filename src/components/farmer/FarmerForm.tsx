import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import farmerService from '../../services/farmerService';
import { Farmer, FormErrors } from '../../types';
import { validateFarmerForm } from '../../utils/validation';
import './Farmer.css';

const FarmerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Farmer>({
    nic: '',
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    email: '',
    district: '',
    gsDivision: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      loadFarmer(id);
    }
  }, [id, isEditMode]);

  const loadFarmer = async (farmerId: string) => {
    try {
      const farmer = await farmerService.getFarmerById(farmerId);
      setFormData(farmer);
    } catch (err: any) {
      setApiError(err.message || 'Failed to load farmer details');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    // Validate form
    const validationErrors = validateFarmerForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (isEditMode && id) {
        await farmerService.updateFarmer(id, formData);
      } else {
        await farmerService.createFarmer(formData);
      }
      navigate('/farmers');
    } catch (err: any) {
      setApiError(err.message || 'Failed to save farmer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isEditMode ? 'Edit Farmer' : 'Add New Farmer'}</h2>
      </div>

      {apiError && <div className="error-banner">{apiError}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nic">NIC *</label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className={errors.nic ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.nic && <span className="error-message">{errors.nic}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number *</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={errors.contactNumber ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.contactNumber && (
              <span className="error-message">{errors.contactNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gsDivision">GS Division</label>
            <input
              type="text"
              id="gsDivision"
              name="gsDivision"
              value={formData.gsDivision}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/farmers')}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Farmer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmerForm;
