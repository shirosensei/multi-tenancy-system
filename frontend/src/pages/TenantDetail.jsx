import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const TenantDetail = () => {
  const [user, setUser] = useState({ name: 'John Doe', role: 'admin', email: 'john@example.com' });
  const [tenant, setTenant] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { tenantId } = useParams(); // Get tenantId from the URL

  const handleLogout = () => {
    
    navigate('/login'); // Redirect to login on logout
  };

  useEffect(() => {
    const fetchTenantDetails = async () => {
      try {
        // Fetch tenant details
        const tenantResponse = await axios.get(`/tenants/${tenantId}`);
        setTenant(tenantResponse.data);

        // Fetch users for the tenant
        const usersResponse = await axios.get(`/tenants/${tenantId}/users`);
        setUsers(usersResponse.data);
      } catch (err) {
        setError('Failed to fetch tenant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantDetails();
  }, [tenantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="md" className="mt-8">
      <Typography variant="h4" className="mb-4">Welcome, {user.name}</Typography>
      <Typography variant="h6">Role: {user.role}</Typography>
      <Typography variant="h6">Email: {user.email}</Typography>

      {user.role === 'admin' && (
        <>
          <Typography variant="h5" className="mt-4 mb-2">User List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Button variant="contained" color="secondary" onClick={handleLogout} className="mt-4">Logout</Button>
    </Container>
  );
};

export default TenantDetail;