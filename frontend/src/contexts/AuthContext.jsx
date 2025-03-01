import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores logged-in user
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for an existing user session
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Load user from storage
        }
        setLoading(false);
    }, []);

    const login = async  (email, password) => {
        // Simulate a login request
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/tenant/login`, { email, password });
        
            if (response.data.success) {
              const { token, tenantId } = response.data; 
              // Save the user and token to localStorage or in state
              localStorage.setItem("tenantId", tenantId);
              localStorage.setItem("token", token);
              return true; // User successfully logged in
            } else {
              console.error('Login failed:', response.data.message);
              return false; // Login failed
            }
          } catch (error) {
            console.error('Login error:', error);
            return false; // Handle login error
          }
        // return false;
    };

    const signup = async ({ username, domain, name, email, password, tenantId }) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tenant/register`, { username, name, email, password, domain, tenantId });
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
  };


    const logout = () => {
        // Remove user and token from localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Optionally, call the API to invalidate the session
        axios.post(`${import.meta.env._API_URL}/tenant/logout`)
          .then(response => {
            console.log(response.data.message);
          })
          .catch(error => {
            console.error('Logout error:', error);
          });
      };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);