import  { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null); // Current tenant
    const [loading, setLoading] = useState(false);

    const fetchTenantData = async (tenantId) => {
        setLoading(true);
        try {
            // Simulate fetching tenant data from an API
            const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/tenants/${tenantId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tenant data');
            }
            const data = await response.json();
            setTenant(data);
        } catch (error) {
            console.error('Error fetching tenant data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TenantContext.Provider value={{ tenant, fetchTenantData, loading }}>
            {children}
        </TenantContext.Provider>
    );
};

TenantProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useTenantsAuths = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('Tenant must be used within a TenantProvider');
    }
    return context;
};