import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FPLProvider, useFPL } from './context/FPLContext';
import Login from './components/Login';
import TeamPage from './pages/TeamPage';
import PlannerPage from './pages/PlannerPage';
import TransfersPage from './pages/TransfersPage';
import LivePage from './pages/LivePage';
import Dashboard from './components/Dashboard';
import LeaguesPage from './pages/LeaguesPage';
import AvailabilityPage from './pages/AvailabilityPage';
import ComparePage from './pages/ComparePage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { managerData, loading } = useFPL();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!managerData) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

const AppRoutes: React.FC = () => {
  const { managerData } = useFPL();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={managerData ? <Navigate to="/team" replace /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <PlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfers"
          element={
            <ProtectedRoute>
              <TransfersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live"
          element={
            <ProtectedRoute>
              <LivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/availability"
          element={
            <ProtectedRoute>
              <AvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare"
          element={
            <ProtectedRoute>
              <ComparePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leagues"
          element={
            <ProtectedRoute>
              <LeaguesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/team" replace />} />
        <Route path="*" element={<Navigate to="/team" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <FPLProvider>
      <AppRoutes />
    </FPLProvider>
  );
}

export default App;
