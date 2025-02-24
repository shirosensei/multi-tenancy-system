import React, { useState } from 'react';

import TenantMetrics from './TenantMetrics';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button
} from '@mui/material';

import { useQuery } from '@tanstack/react-query';

import { api } from '../services/api';

import { useAuth } from "../contexts/AuthContext"; // Import AuthContext

const TenantList = () => {
  const { user } = useAuth(); // Get logged-in user
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);

  const { data: tenants, isLoading, error } = useQuery(['tenants'], async () => {
    const response = await api.get('/tenants');
    return response.data;
  });

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;

    try {
      await api.delete(`/tenants/${tenantId}`);
      alert("Tenant deleted successfully.");
      window.location.reload(); // Refresh the list
    } catch (error) {
      console.error("error", error)
      alert("Error deleting tenant.");
    }
  };

  return (
    <React.Fragment>
      <TextField
        label="Search Tenants"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Show Add Tenant Button only if user is Admin or Editor */}
      {(user?.role === "admin" || user?.role === "editor") && (
        <Button variant="contained" color="primary">
          Add Tenant
        </Button>
      )}

      <Paper>
        {isLoading && <p>Loading...</p>}
        {error && <p>Something went wrong: {error.message}</p>}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subdomain</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants?.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.subdomain}</TableCell>
                  <TableCell>{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => setSelectedTenant(tenant)}>
                      View Metrics
                    </Button>

                    {/* Show Delete Button only for Admin */}
                    {user?.role === "admin" && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Show Tenant Metrics if a tenant is selected */}
      {selectedTenant && <TenantMetrics tenant={selectedTenant} />}
    </React.Fragment>
  );
};


export default TenantList;