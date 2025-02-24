import { Navigate, Outlet  } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;


  // if (!user || user.role !== role) {
  //   return <Navigate to="/dashboard" />;
  // }

  return children ? children : <Outlet />;
};


PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.string.isRequired,
};

export default PrivateRoute;
