import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const dummyUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' }
];



 const TenantDetail = () => {

  const [user, setUser] = useState({ name: 'John Doe', role: 'admin', email: 'john@example.com' });
  

  const [tenant, setTenant] = useState(null);
  const navigate = useNavigate();


  const handleLogout = () => {
    navigate('/login'); // Redirect to login on logout
  };


  useEffect(() => {
    // axios.get(dummyUsers).then((response) => {
    //   console.log(response.data);
    //   setTenant(response.data);
    // });
    setUser(dummyUsers)
    setTenant(dummyUsers);
  }, []);

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
                {tenant ? (
                  tenant.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Loading...</TableCell>
                  </TableRow>
                )}
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