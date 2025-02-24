import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { DUMMY_USERS } from "../data/dummyUsers";

// Create TenantContext
const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [tenants, setTenants] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshTenants = async (email, password) => {
    try {
      const foundTenant = DUMMY_USERS.find(user => user.email === email && user.password === password);

      if (foundTenant) {
        setTenants([foundTenant]);
        setTenant(foundTenant); // Set the tenant
      }
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    }
  };

  return (
    <TenantContext.Provider value={{ tenants, tenant, refreshTenants, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

TenantProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Create and export useTenantsAuths hook
export const useTenantsAuths = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantsAuths must be used within a TenantProvider');
  }
  return context;
};

export default TenantContext;