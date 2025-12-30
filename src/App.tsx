import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Layout from "./components/common/Layout";
import Login from "./components/auth/Login";
import Dashboard from "./components/common/Dashboard";
import FarmerList from "./components/farmer/FarmerList";
import FarmerForm from "./components/farmer/FarmerForm";
import FarmerDetail from "./components/farmer/FarmerDetail";
import HomeGardenList from "./components/homegarden/HomeGardenList";
import HomeGardenForm from "./components/homegarden/HomeGardenForm";
import HomeGardenDetail from "./components/homegarden/HomeGardenDetail";
import EquipmentList from "./components/equipment/EquipmentList";
import EquipmentForm from "./components/equipment/EquipmentForm";
import EquipmentDetail from "./components/equipment/EquipmentDetail";
import CSAAgricultureList from "./components/csaagriculture/CSAAgricultureList";
import CSAAgricultureForm from "./components/csaagriculture/CSAAgricultureForm";
import CSAAgricultureDetail from "./components/csaagriculture/CSAAgricultureDetail";
import AgroWellList from "./components/agrowell/AgroWellList";
import AgroWellForm from "./components/agrowell/AgroWellForm";
import AgroWellDetail from "./components/agrowell/AgroWellDetail";
import PoultryList from "./components/poultry/PoultryList";
import PoultryForm from "./components/poultry/PoultryForm";
import PoultryDetail from "./components/poultry/PoultryDetail";
import "./App.css";

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
                  <EquipmentList />
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
            path="/equipment/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <EquipmentDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/equipment/:id/edit"
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
                  <HomeGardenList />
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
            path="/home-gardens/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <HomeGardenDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/home-gardens/:id/edit"
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
            path="/csa-agriculture/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <CSAAgricultureDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/csa-agriculture/:id/edit"
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
                  <AgroWellList />
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
            path="/agro-wells/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <AgroWellDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/agro-wells/:id/edit"
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
                  <PoultryList />
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
          <Route
            path="/poultry/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <PoultryDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/poultry/:id/edit"
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
