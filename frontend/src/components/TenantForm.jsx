import  { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

const TenantForm = ({ open, onClose, tenant }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: tenant?.name || "",
    email: tenant?.email || "",
    subdomain: tenant?.subdomain || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mutation = useMutation(
    async (data) => {
      if (tenant) {
        return api.put(`/tenants/${tenant.id}`, data); // Update existing tenant
      }
      return api.post("/tenants", data); // Create new tenant
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tenants"]);
        onClose();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{tenant ? "Edit Tenant" : "Add Tenant"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tenant Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="Subdomain"
            name="subdomain"
            fullWidth
            value={formData.subdomain}
            onChange={handleChange}
            margin="normal"
            required
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Saving..." : tenant ? "Update Tenant" : "Create Tenant"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
TenantForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tenant: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    subdomain: PropTypes.string,
  }),
};

export default TenantForm;
