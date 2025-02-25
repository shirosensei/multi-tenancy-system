import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenantsAuths } from '../contexts/tenantContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const { tenant } = useTenantsAuths();

  // Redirect to login if user or tenant is not authenticated
  if (!user || !tenant) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if user role is not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

PrivateRoute.defaultProps = {
  children: null,
  allowedRoles: [],
};

export default PrivateRoute;