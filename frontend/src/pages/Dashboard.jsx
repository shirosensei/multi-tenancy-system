import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTenantsAuths } from '../contexts/tenantContext';
import TenantMetrics from '../components/TenantMetrics';

const Dashboard = () => {
    const { user, loading: userLoading } = useAuth();
    const { tenant, fetchTenantData, loading: tenantLoading } = useTenantsAuths();
    const [tenantData, setTenantData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && user.tenantId) {
            fetchTenantData(user.tenantId); // Fetch tenant data based on user's tenantId
        }
    }, [user, fetchTenantData]);

    useEffect(() => {
        if (tenant) {
            // Simulate fetching tenant-specific metrics
            const data = [
                {
                    metric: "Active Users",
                    value: tenant.activeUsers || 0,
                },
                {
                    metric: "Total Posts",
                    value: tenant.totalPosts || 0,
                },
                {
                    metric: "Storage Used",
                    value: tenant.storageUsed || 0,
                },
            ];
            setTenantData(data);
        }
    }, [tenant]);

    if (userLoading || tenantLoading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    if (!user || !tenant) {
        return <Typography variant="h6">Please log in to view the dashboard.</Typography>;
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Welcome, {user.email}</Typography>
            <Typography variant="subtitle1">Tenant: {tenant.name}</Typography>

            <Grid container spacing={4} sx={{ mt: 4 }}>
                {tenantData.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">{metric.metric}</Typography>
                                <Typography variant="body2">{metric.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tenant Metrics Section */}
            <Box sx={{ mt: 4 }}>
                <TenantMetrics tenantData={tenantData} />
            </Box>
        </Box>
    );
};

export default Dashboard;