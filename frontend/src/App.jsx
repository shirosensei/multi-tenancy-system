import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import TenantDetail from "./pages/TenantDetail";
import UserActivityPage from "./pages/UserActivityPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import PrivateRoute from "./middleware/authorize"; // Protecting admin-only pages
import { useAuth } from "./contexts/AuthContext";
import { useTenantsAuths } from "./contexts/tenantContext";

function App() {
  const {  loading: userLoading } = useAuth();
  const {  loading: tenantLoading } = useTenantsAuths();



  // Show loading state while checking authentication
  if (userLoading || tenantLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute allowedRoles={['admin', 'editor', 'viewer']}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Admin-Only Pages */}
        <Route
          path="subscriptions"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="activity-log"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <UserActivityPage />
            </PrivateRoute>
          }
        />
        <Route
          path="tenants/:tenantId"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <TenantDetail />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;