import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [tenants, setTenants] = useState([]);
  const [initialized, setInitialized] = useState(false); 

  const refreshTenants = async () => {
    try {
        const response = await api.get('/tenants');
        setTenants(response.data);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      }
  };

  useEffect(() => {
    if(!initialized) {
      refreshTenants();
      setInitialized(true);
    }
    
  }, [initialized]);

  return (
    <TenantContext.Provider value={{ tenants, refreshTenants }}>
      {children}
    </TenantContext.Provider>
  );
};

// const useTenants = () => {
//     const context = useContext(TenantContext);
//     if (!context) {
//         throw new Error('useTenants must be used within a TenantProvider');
//     }
//     return context;
// };

TenantProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useTenantsAuths = () => useContext(TenantContext);
