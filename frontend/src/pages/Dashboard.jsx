import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TenantMetrics from '../components/TenantMetrics';
import { useTenantsAuths } from '../contexts/tenantContext'; // Import the hook

const Dashboard = () => {
    const [user, setUser] = useState({ name: 'John Doe', role: 'admin', email: 'john@example.com' });
    const [tenantData, setTenantData] = useState([]); // Initialize tenantData as an empty array
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();
    const { tenant, tenants, refreshTenants } = useTenantsAuths();

    useEffect(() => {
        const fetchData = () => {
            // Simulate fetching tenant data
            const data = [
                {
                    tenantName: "Tenant A",
                    activeUsers: 120,
                    totalPosts: 500,
                    storageUsed: 350,
                },
                {
                    tenantName: "Tenant B",
                    activeUsers: 80,
                    totalPosts: 300,
                    storageUsed: 200,
                },
                {
                    tenantName: "Tenant C",
                    activeUsers: 150,
                    totalPosts: 700,
                    storageUsed: 450,
                }
            ];
            setTenantData(data);
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchData();
    }, []);

    // Handle undefined tenant or tenants
    if (!tenant || !tenants) {
        return <Typography variant="h6">Loading tenant data...</Typography>;
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4">Welcome, {user.name}</Typography>

            <Grid container spacing={4} sx={{ mt: 4 }}>
                {/* Quick Stats */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Active Users</Typography>
                            <Typography variant="body2">
                                {loading ? 'Loading...' : tenantData.reduce((sum, tenant) => sum + tenant.activeUsers, 0)} Users
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Total Posts</Typography>
                            <Typography variant="body2">
                                {loading ? 'Loading...' : tenantData.reduce((sum, tenant) => sum + tenant.totalPosts, 0)} Posts
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Storage Used</Typography>
                            <Typography variant="body2">
                                {loading ? 'Loading...' : tenantData.reduce((sum, tenant) => sum + tenant.storageUsed, 0)} GB
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* More Cards / Links */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Manage Tenants</Typography>
                            <Typography variant="body2">View and manage tenant settings</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tenant Metrics Section */}
            <Box sx={{ mt: 4 }}>
                <TenantMetrics tenantData={tenantData} />
            </Box>
        </Box>
    );
};

export default Dashboard;