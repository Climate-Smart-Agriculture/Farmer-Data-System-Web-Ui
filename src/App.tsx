import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/common/Dashboard';
import FarmerList from './components/farmer/FarmerList';
import FarmerForm from './components/farmer/FarmerForm';
import FarmerDetail from './components/farmer/FarmerDetail';
import EquipmentForm from './components/forms/EquipmentForm';
import HomeGardenForm from './components/forms/HomeGardenForm';
import CSAAgricultureForm from './components/forms/CSAAgricultureForm';
import AgroWellForm from './components/forms/AgroWellForm';
import PoultryForm from './components/forms/PoultryForm';
import DataList from './components/common/DataList';
import CSAAgricultureList from './components/forms/CSAAgricultureList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/farmers"
            element={
              <PrivateRoute>
                <Layout>
                  <FarmerList />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/farmers/new"
            element={
              <PrivateRoute>
                <Layout>
                  <FarmerForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/farmers/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <FarmerDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/farmers/:id/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <FarmerForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment"
            element={
              <PrivateRoute>
                <Layout>
                  <DataList title="Equipment" addNewLink="/equipment/new">
                    <p>Equipment list will be displayed here</p>
                  </DataList>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/new"
            element={
              <PrivateRoute>
                <Layout>
                  <EquipmentForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/home-gardens"
            element={
              <PrivateRoute>
                <Layout>
                  <DataList title="Home Gardens" addNewLink="/home-gardens/new">
                    <p>Home gardens list will be displayed here</p>
                  </DataList>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/home-gardens/new"
            element={
              <PrivateRoute>
                <Layout>
                  <HomeGardenForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/csa-agriculture"
            element={
              <PrivateRoute>
                <Layout>
                  <CSAAgricultureList />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/csa-agriculture/new"
            element={
              <PrivateRoute>
                <Layout>
                  <CSAAgricultureForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agro-wells"
            element={
              <PrivateRoute>
                <Layout>
                  <DataList title="Agro Wells" addNewLink="/agro-wells/new">
                    <p>Agro wells list will be displayed here</p>
                  </DataList>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agro-wells/new"
            element={
              <PrivateRoute>
                <Layout>
                  <AgroWellForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/poultry"
            element={
              <PrivateRoute>
                <Layout>
                  <DataList title="Poultry Farming" addNewLink="/poultry/new">
                    <p>Poultry farming records will be displayed here</p>
                  </DataList>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/poultry/new"
            element={
              <PrivateRoute>
                <Layout>
                  <PoultryForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
