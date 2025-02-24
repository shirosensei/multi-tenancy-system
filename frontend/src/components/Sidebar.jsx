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
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user role
  const [loading, setLoading] = useState(false);

  if (!user) return null; // Don't show sidebar if user is not logged in

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/",
      roles: ["admin", "user"],
    },
    {
      text: "Users",
      icon: <AccountCircle />,
      path: "/users",
      roles: ["admin"],
    },
    {
      text: "Tenants",
      icon: <Business />, // Use BusinessIcon or ApartmentIcon if you prefer
      path: "/tenants",
      roles: ["admin", "editor"], // Only Admin & Editor can manage tenants
    },
    {
      text: "Analytics",
      icon: <PieChart />,
      path: "/analytics",
      roles: ["admin", "user"],
    },
    {
      text: "User Activity",
      icon: <ListAlt />,
      path: "/activity-log",
      roles: ["admin"],
    },
    {
      text: "Subscriptions",
      icon: <MonetizationOn />,
      path: "/subscriptions",
      roles: ["admin"],
    },
    {
      text: "Settings",
      icon: <Settings />,
      path: "/settings",
      roles: ["admin", "user"],
    },
  ];



  const handleLogout = () => {
      setLoading(true); // Show loading state
      logout(); // Perform logout logic

      setTimeout(() => {
          window.location.reload(); // Reload the page after 5 seconds
      }, 5000);
  };


  return (
    <Drawer variant="permanent" className="w-60">
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
