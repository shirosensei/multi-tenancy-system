import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Paper, Typography, Box  } from '@mui/material';
import PropTypes from 'prop-types';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const TenantMetrics = ({ tenantData }) => {
    if (!tenantData || tenantData.length === 0) {
        return <Typography variant="h6">No tenant data available</Typography>;
    }

    // Prepare dummy data for charts
    const activeUsers = tenantData.reduce((sum, tenant) => sum + tenant.activeUsers, 0);
    const totalPosts = tenantData.reduce((sum, tenant) => sum + tenant.totalPosts, 0);
    const storageUsed = tenantData.reduce((sum, tenant) => sum + tenant.storageUsed, 0);

    // Pie Chart Data
    const pieData = {
        labels: ['Active Users', 'Total Posts', 'Storage Used'],
        datasets: [{
            data: [activeUsers, totalPosts, storageUsed],
            backgroundColor: ['#ff7300', '#387908', '#5a8e9f'],
        }],
    };

    // Bar Chart Data
    const barData = {
        labels: tenantData.map((tenant) => tenant.tenantName),
        datasets: [
            {
                label: 'Active Users',
                data: tenantData.map((tenant) => tenant.activeUsers),
                backgroundColor: '#ff7300',
            },
            {
                label: 'Total Posts',
                data: tenantData.map((tenant) => tenant.totalPosts),
                backgroundColor: '#387908',
            },
            {
                label: 'Storage Used',
                data: tenantData.map((tenant) => tenant.storageUsed),
                backgroundColor: '#5a8e9f',
            }
        ],
    };

    return (
        <Paper sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Tenant Metrics
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },  // Stack on small screens, inline on large
                    justifyContent: 'space-between',
                    gap: 4,
                }}
            >
                {/* Pie Chart */}
                <Box sx={{ width: { xs: '100%', md: '45%' }, height: 400 }}>
                    <Pie data={pieData} />
                </Box>

                {/* Bar Chart */}
                <Box sx={{ width: { xs: '100%', md: '45%' }, height: 400 }}>
                    <Bar data={barData} />
                </Box>
            </Box>
        </Paper>
    );
};
TenantMetrics.propTypes = {
    tenantData: PropTypes.arrayOf(
        PropTypes.shape({
            tenantName: PropTypes.string.isRequired,
            activeUsers: PropTypes.number.isRequired,
            totalPosts: PropTypes.number.isRequired,
            storageUsed: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default TenantMetrics;
