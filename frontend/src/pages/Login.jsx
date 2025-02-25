import { useState } from "react";
import { TextField, Button, Typography, Container, Box, Card, CardContent, CircularProgress } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpg"; // Make sure to add your logo image to this path
import { keyframes } from "@emotion/react";

// Define the bounce animation
const bounce = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

// Define the shake animation
const shake = keyframes`
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
    `;



// Scaling dots animation
const scaleDots = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, signup } = useAuth();

    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // States for shake animations
    const [shakeName, setShakeName] = useState(false);
    const [shakeUser, setShakeUser] = useState(false);
    const [shakeEmail, setShakeEmail] = useState(false);
    const [shakePassword, setShakePassword] = useState(false);
    const [shakeConfirmPassword, setShakeConfirmPassword] = useState(false);

    // Validatio state
    const [validation, setValidation] = useState({
        valid: true,
        errors: {}
    });

     // Function to reset input fields
     const resetForm = () => {
        setUsername("");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setValidation({ valid: true, errors: {} }); // Reset validation state
    };

    const validateForm = (formData, isLogin) => {
        const errors = {};

        if (!isLogin) {
            if (!formData.username) errors.username = "Username is required.";
            if (!formData.name) errors.name = "Name is required.";
        }

        // Validate email format using regex
        if (!formData.email) {
            errors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Invalid email format.";
        }

        if (!formData.password) {
            errors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            errors.password = "Password too short.";
        } else if (formData.password === formData.email) {
            errors.password = "Password cannot be the same as your email.";
        }

        if (!isLogin && !formData.confirmPassword) {
            errors.confirmPassword = "Confirm Password is required.";
        } else if (!isLogin && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        return {
            valid: Object.keys(errors).length === 0, // True if no errors
            errors, // Object containing error messages
        };
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error 
        setError("");

        // Set Loading to true
        setLoading(true);

        // Reset shake states
        setShakeEmail(false);
        setShakePassword(false);
        setShakeConfirmPassword(false);
        setShakeName(false);
        setShakeUser(false);





        // Validate the form
        const validationResult = validateForm({ username, name, email, password, confirmPassword }, isLogin);
        setValidation(validationResult);

        if (!validationResult.valid) {
            // Set error messages
            setError("Please fix the errors below.");

            // Trigger shake animations for invalid fields
            if (validationResult.errors.email) setShakeEmail(true);
            if (validationResult.errors.password) setShakePassword(true);
            if (validationResult.errors.confirmPassword) setShakeConfirmPassword(true);
            if (validationResult.errors.username) setShakeUser(true);
            if (validationResult.errors.name) setShakeName(true);

            setLoading(false);
            return;
        }

        try {
            if (isLogin) {

                // Simulate a 5-second delay for login
            await new Promise((resolve) => setTimeout(resolve, 5000));

                // Handle Login
                const loginSuccessful = await login(email, password);
                if (loginSuccessful) {
                    navigate("/dashboard");
                } else {
                    throw new Error("Invalid email or password.");
                }

                navigate("/dashboard");
            } else {

                await signup({ username, name, email, password, tenantId: "tenantId" });
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message);
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    // Shared styles for form field fields
    const getFieldStyles = (shake) => ({
        marginBottom: 3,
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: shake ? "#e96060" : "#9d8d6c", // Active state border color
            },
            "&:hover fieldset": {
                borderColor: "#fff", // Hover state border color
            },
            "&.Mui-focused fieldset": {
                borderColor: "#fff", // Focused state border color
            },
        },
        "& .MuiInputLabel-root": {
            color: shake ? "#e96060" : "#9d8d6c", // Default label color
            "&.Mui-focused": {
                color: "#fff",
            },
        },
        "& .MuiOutlinedInput-input": {
            color: "#fff", // White input text
        },
    });



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
                {/* Logo with bounce effect */}
                <Box
                    sx={{
                        marginBottom: 4,
                        animation: `${bounce} 2s infinite`,
                    }}
                >
                    <img src={Logo} alt="Logo" width={100} height={100} style={{ borderRadius: "50%" }} />
                </Box>

                {/* Card for the Login Form */}
                <Card sx={{ width: "100%", maxWidth: 650, borderRadius: 4, background: "#334c5d", boxShadow: 5 }}>
                    <CardContent>
                        {/* Title */}
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: "white", marginBottom: 4 }}>
                            {isLogin ? "Log In" : "Sign Up"}
                        </Typography>

                        {/* Error Message */}
                        {error && (
                            <Typography color="error" align="center" sx={{ marginBottom: 3 }}>
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
                                        sx={{ ...getFieldStyles(shakeUser), animation: shakeUser ? `${shake} 0.5s ease` : "none" }}
                                        error={!!validation.errors.username}
                                        helperText={validation.errors.username}
                                        required
                                    />

                                    {/* Name Field */}
                                    <TextField
                                        label="Name"
                                        variant="outlined"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        sx={{ ...getFieldStyles(shakeName), animation: shakeName ? `${shake} 0.5s ease` : "none" }}
                                        error={!!validation.errors.name}
                                        helperText={validation.errors.name}
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
                                sx={{
                                    ...getFieldStyles(shakeEmail),
                                    animation: shakeEmail ? `${shake} 0.5s ease` : "none",
                                }}
                                error={!!validation.errors.email}
                                helperText={validation.errors.email}
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
                                sx={{
                                    ...getFieldStyles(shakePassword),
                                    animation: shakePassword ? `${shake} 0.5s ease` : "none",
                                }}
                                error={!!validation.errors.password}
                                helperText={validation.errors.password}
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
                                    sx={{ ...getFieldStyles(shakeConfirmPassword), animation: shakeConfirmPassword ? `${shake} 0.5s ease` : "none" }}
                                    error={!!validation.errors.confirmPassword}
                                    helperText={validation.errors.confirmPassword}
                                    required
                                />
                            )}

                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSubmit}
                                sx={{
                                    marginBottom: 3, // Added spacing
                                    padding: 2,
                                    backgroundColor: "#9d8d6c",
                                    "&:hover": {
                                        backgroundColor: "#6E6E6E",
                                    },
                                    position: "relative",
                                }}
                                disabled={loading}
                            >
                                <Box sx={{ display: "flex" }}>
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: "white", animation: `${scaleDots} 4s infinite` }} />

                                    ) : isLogin ? (
                                        "Log In"
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Box>
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

export default LoginPage;





