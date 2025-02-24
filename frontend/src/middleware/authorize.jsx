import { Navigate, Outlet  } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenantsAuths } from '../contexts/tenantContext'
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  const { tenant } = useTenantsAuths();

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if user role is not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }



  return children ? children : <Outlet />;
};


PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.string.isRequired,
};

// Default Props
PrivateRoute.defaultProps = {
  children: null,
  allowedRoles: [],
};

export default PrivateRoute;
