import React from 'react';
import { Link } from 'react-router-dom';
import '../farmer/Farmer.css';

const Dashboard: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c5f2d' }}>Farmer Management</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Manage farmer information and profiles</p>
          <Link to="/farmers" className="btn btn-primary" style={{ display: 'inline-block' }}>
            View Farmers
          </Link>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c5f2d' }}>Equipment</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Track farming equipment</p>
          <Link to="/equipment" className="btn btn-primary" style={{ display: 'inline-block' }}>
            View Equipment
          </Link>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c5f2d' }}>Home Gardens</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Manage home garden data</p>
          <Link to="/home-gardens" className="btn btn-primary" style={{ display: 'inline-block' }}>
            View Home Gardens
          </Link>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c5f2d' }}>CSA Agriculture</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Climate Smart Agriculture records</p>
          <Link to="/csa-agriculture" className="btn btn-primary" style={{ display: 'inline-block' }}>
            View CSA Agriculture
          </Link>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c5f2d' }}>Agro Wells</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Manage agro well information</p>
          <Link to="/agro-wells" className="btn btn-primary" style={{ display: 'inline-block' }}>
            View Agro Wells
          </Link>
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2c5f2d' }}>Poultry Farming</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Track poultry farming activities</p>
          <Link to="/poultry" className="btn btn-primary" style={{ display: 'inline-block' }}>
            View Poultry Records
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2c5f2d' }}>About</h3>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          The Climate Smart Irrigated Agriculture Project (CSIAP), in collaboration with the FAO and World Bank,
          aims to digitize and centralize farmer-level data to support data-driven agricultural planning and
          policy-making in Sri Lanka.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
