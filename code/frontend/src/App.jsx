// Route wiring. Not implemented — components below are stubs until each
// phase fills them in.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResourceSearch from './pages/ResourceSearch';
import Bookings from './pages/Bookings';
import BreakdownReport from './pages/BreakdownReport';
import BreakdownQueue from './pages/BreakdownQueue';
import Support from './pages/Support';
import LabourRequests from './pages/LabourRequests';
import Ledger from './pages/Ledger';
import Schemes from './pages/Schemes';
import Claims from './pages/Claims';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<ResourceSearch />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/breakdowns" element={<BreakdownReport />} />
        <Route path="/repair-queue" element={<BreakdownQueue />} />
        <Route path="/support" element={<Support />} />
        <Route path="/labour" element={<LabourRequests />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
