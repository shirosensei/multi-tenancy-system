import axios from "axios";

// import env key
const API_URL = import.meta.env.VITE_API_URL;

 const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// Handle subdomain for tenant 
api.interceptors.request.use((config) => {
    const tenantSubdomain = localStorage.getItem("crrentTenant");
    if (tenantSubdomain && !config.headers["X-Tenant"] && !config.url?.startsWith("/tenants")) {
        config.headers["X-Tenant"] = tenantSubdomain;
    }
    return config;
});

export default api;