import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      // Redirect to the intended route or to the home page if no route is defined
      const redirectPath =
        new URLSearchParams(location.search).get("redirect") || "/";
      navigate(redirectPath);
    }
  }, [user, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      // After login, it will automatically redirect in useEffect
      toast.success("Login successful");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    
    <Box
    
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ece9f7 0%, #e3d7ff 100%)",
        padding: 2,
      }}
    >

      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.15)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#4a148c", mb: 1 }}
        >
          NSL R&D
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Sign in to access your account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="filled"
            InputProps={{ style: { backgroundColor: "#f3f0ff" } }}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="filled"
            InputProps={{ style: { backgroundColor: "#f3f0ff" } }}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              backgroundColor: "#6a1b9a",
              color: "#fff",
              "&:hover": { backgroundColor: "#4a148c" },
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
          <Typography
            align="center"
            sx={{ mt: 3 }}
            variant="body2"
            color="textSecondary"
          >
            Don’t have an account?{" "}
            <Link
              onClick={() => navigate("/register")}
              sx={{
                color: "#6a1b9a",
                cursor: "pointer",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Register
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}