import  { useState } from "react";
import { TextField, Button, Typography, Container, Box, Card, CardContent, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthPage = () => {
    const navigate = useNavigate();
    const { login, signup } = useAuth(); // Assuming you have a signup function in your AuthContext

    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                // Handle Login
                await login(email, password);
                navigate("/dashboard"); // Redirect to dashboard after login
            } else {
                // Handle Sign Up
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                await signup({ username, name, email, password, tenantId: "your-tenant-id" }); 
                navigate("/dashboard"); // Redirect to dashboard after signup
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            >
                <Card sx={{ width: "100%", maxWidth: 650, borderRadius: 4, background: "#334c5d", boxShadow: 5 }}>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: "white" }}>
                            {isLogin ? "Log In" : "Sign Up"}
                        </Typography>

                        {error && (
                            <Typography color="error" align="center" sx={{ marginBottom: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    {/* Username Field */}
                                    <TextField
                                        label="Username"
                                        variant="outlined"
                                        fullWidth
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        sx={{ marginBottom: 3 }}
                                        required
                                    />

                                    {/* Name Field */}
                                    <TextField
                                        label="Name"
                                        variant="outlined"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        sx={{ marginBottom: 3 }}
                                        required
                                    />
                                </>
                            )}

                            {/* Email Field */}
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ marginBottom: 3 }}
                                required
                            />

                            {/* Password Field */}
                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ marginBottom: 3 }}
                                required
                            />

                            {/* Confirm Password Field (Only for Sign Up) */}
                            {!isLogin && (
                                <TextField
                                    label="Confirm Password"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    sx={{ marginBottom: 3 }}
                                    required
                                />
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginBottom: 2, padding: 2 }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: "white" }} />
                                ) : isLogin ? (
                                    "Log In"
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>

                        {/* Toggle Between Login and Sign Up */}
                        <Typography variant="body2" align="center" sx={{ color: "white" }}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Button
                                onClick={() => setIsLogin(!isLogin)}
                                sx={{ color: "#1976d2", textTransform: "none" }}
                            >
                                {isLogin ? "Sign Up" : "Log In"}
                            </Button>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default AuthPage;