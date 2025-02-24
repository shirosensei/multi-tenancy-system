import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DUMMY_USERS } from "../data/dummyUsers"

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
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

    // Dummy login function
    const login = (email, password) => {
        // Simulate a login request
        const foundUser = DUMMY_USERS.find((u) => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("user", JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    // Signup function
    const signup = async ({ username, name, email, password, tenantId }) => {
        try {
            // Simulate a signup request
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, name, email, password, tenantId }),
            });

            if (!response.ok) {
                throw new Error("Signup failed");
            }

            const newUser = await response.json();
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
            return true;
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);