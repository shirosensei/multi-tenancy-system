import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import TenantDetail from "./pages/TenantDetail";
import UserActivityPage from "./pages/UserActivityPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import PrivateRoute from "./middleware/authorize"; // Protecting admin-only pages
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes Inside Layout */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
     

          {/* Admin-Only Pages */}
          <Route path="subscriptions" element={<PrivateRoute role="admin"><SubscriptionPage /></PrivateRoute>} />
          <Route path="activity-log" element={<PrivateRoute role="admin"><UserActivityPage /></PrivateRoute>} />
          <Route path="tenants/:tenantId" element={<PrivateRoute role="admin"><TenantDetail /> </PrivateRoute>} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
