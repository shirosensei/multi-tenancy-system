import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../../services/api'; // API call utility

const UserActivity = () => {
  const { data: activities, isLoading, error } = useQuery(['activities'], async () => {
    const response = await api.get('/audit-logs'); // Fetch audit logs
    return response.data;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching activities: {error.message}</p>;

  return (
    <Paper sx={{ p: 3 }}>
      <h2>User Activity Log</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Tenant</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.user.name}</TableCell>
                <TableCell>{activity.tenant.name}</TableCell>
                <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserActivity;
