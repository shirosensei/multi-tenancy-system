import  { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Skeleton } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import TenantForm from "./TenantForm";
import TenantMetrics from "./TenantMetrics";

const TenantList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const { data: tenants, isLoading, error } = useQuery(["tenants"], async () => {
    const response = await api.get(`${apiUrl}/tenants`);
    return response.data;
  });

  const deleteMutation = useMutation(
    async (tenantId) => api.delete(`${apiUrl}/tenants/${tenantId}`),
    {
      onSuccess: () => queryClient.invalidateQueries(["tenants"]),
    }
  );

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
    deleteMutation.mutate(tenantId);
  };

  return (
    <>
      {/* Search Bar */}
      <TextField
        label="Search Tenants"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Add Tenant Button (Only for Admins & Editors) */}
      {(user?.role === "admin" || user?.role === "editor") && (
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Add Tenant
        </Button>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <Paper>
        {/* Handle Loading State with Skeleton */}
        {isLoading ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Tenant Name", "Email", "Subdomain", "Created At", "Actions"].map((header, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" width={100} height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={120} height={25} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} height={25} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} height={25} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} height={25} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={35} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : error ? (
          <p>Something went wrong: {error.message}</p>
        ) : (
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
                        <Button variant="outlined" color="error" onClick={() => handleDeleteTenant(tenant.id)}>
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Tenant Metrics Dialog */}
      {selectedTenant && <TenantMetrics tenant={selectedTenant} />}

      {/* Add/Edit Tenant Form */}
      <TenantForm open={openForm} onClose={() => { setOpenForm(false); setSelectedTenant(null); }} tenant={selectedTenant} />
    </>
  );
};

export default TenantList;
