import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentDashboard from "./pages/ResidentDashboard";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
// import WardenDashboard from "./pages/WardenDashboard";
// import WardenComplaintDetails from "./pages/WardenComplaintDetails";

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-state">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate to={user.role === "warden" ? "/warden/dashboard" : "/resident/dashboard"} replace />
  );
};

const AppRoutes = () => (
  <div className="app-shell">
    <Navbar />
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/resident/dashboard"
        element={
          <ProtectedRoute allowedRole="resident">
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/complaints/new"
        element={
          <ProtectedRoute allowedRole="resident">
            <NewComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/complaints/:id"
        element={
          <ProtectedRoute allowedRole="resident">
            <ComplaintDetails />
          </ProtectedRoute>
        }
      />

      {/* Warden routes will be re-enabled once WardenDashboard / WardenComplaintDetails are built
      <Route
        path="/warden/dashboard"
        element={
          <ProtectedRoute allowedRole="warden">
            <WardenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/complaints/:id"
        element={
          <ProtectedRoute allowedRole="warden">
            <WardenComplaintDetails />
          </ProtectedRoute>
        }
      />
      */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
