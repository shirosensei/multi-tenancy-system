import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard,
  AccountCircle,
  Settings,
  ExitToApp,
  PieChart,
  ListAlt,
  MonetizationOn,
  
} from "@mui/icons-material";
import Business from "@mui/icons-material/Business";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTenantsAuths } from "../contexts/tenantContext";
import { useState } from "react";


const Sidebar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { user: adminUser, logout: adminLogout } = useAuth(); // Admin Authentication
const { user: tenantUser, logout: tenantLogout } = useTenantsAuths(); // Tenant Authentication

// Determine the current user (Admin or Tenant)
const user = adminUser || tenantUser;
const logout = adminUser ? adminLogout : tenantLogout;


  if (!user) return null; // Don't show sidebar if user is not logged in

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/", roles: ["admin", "user", "tenant"] },
    { text: "Users", icon: <AccountCircle />, path: "/users", roles: ["admin"] },
    { text: "Tenants", icon: <Business />, path: "/tenants", roles: ["admin", "editor"] },
    { text: "Analytics", icon: <PieChart />, path: "/analytics", roles: ["admin", "user"] },
    { text: "User Activity", icon: <ListAlt />, path: "/activity-log", roles: ["admin"] },
    { text: "Subscriptions", icon: <MonetizationOn />, path: "/subscriptions", roles: ["admin"] },
    { text: "Settings", icon: <Settings />, path: "/settings", roles: ["admin", "user", "tenant"] },
  ];



  const handleLogout = () => {
      setLoading(true); // Show loading state
      logout(); // Perform logout logic

      setTimeout(() => {
        localStorage.removeItem("token"), 
          window.location.assign("/login"); // Reload the page after 5 seconds
      }, 5000);
  };


  return (
    <Drawer variant="permanent" sx={{
      width: { xs: 0, sm: 200, md: 250 }, // 0 on mobile, 200px on tablet, 250px on desktop
      flexShrink: 0,
      display: { xs: "none", sm: "block" }, // Hide on mobile
      "& .MuiDrawer-paper": { width: { sm: 200, md: 250 } },
    }}>
      <List className="pt-4">
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => navigate(item.path)}
              className="my-4"
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}

        {/* Logout Button */}
        <ListItem button className="mt-auto" onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
