import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FPLProvider, useFPL } from './context/FPLContext';
import Login from './components/Login';
import Team from './components/Team';
import Planner from './components/Planner';
import Transfers from './components/Transfers';
import Live from './components/Live';
import LeagueManagement from './components/LeagueManagement';
import Availability from './components/Availability';
import PlayerComparison from './components/PlayerComparison';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './components/Dashboard';

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
    <BrowserRouter basename="/fantasy-premier-league">
      <Routes>
        <Route path="/login" element={managerData ? <Navigate to="/team" replace /> : <Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
        <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
        <Route path="/live" element={<ProtectedRoute><Live /></ProtectedRoute>} />
        <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
        <Route path="/compare" element={<ProtectedRoute><PlayerComparison /></ProtectedRoute>} />
        <Route path="/leagues" element={<ProtectedRoute><LeagueManagement /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/team" replace />} />
        <Route path="*" element={<Navigate to="/team" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

function App1() {
  return (
    <FPLProvider>
      <AppRoutes />
    </FPLProvider>
  );
}

export default App1;
