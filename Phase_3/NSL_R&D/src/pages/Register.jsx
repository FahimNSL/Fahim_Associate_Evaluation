import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  MenuItem,
  Grid,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    nslId: "",
    email: "",
    password: "",
    userType: "member",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/");
      toast.success("Registration successful");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #d1c4e9 0%, #bbdefb 100%)",
        padding: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          maxWidth: 520,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.2)",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#283593", mb: 2 }}
        >
          Welcome to NSL R&D
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Sign up and start your journey with us.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c5cae9" },
                    "&:hover fieldset": { borderColor: "#5c6bc0" },
                    "&.Mui-focused fieldset": { borderColor: "#283593" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NSL ID"
                margin="normal"
                variant="outlined"
                value={formData.nslId}
                onChange={(e) =>
                  setFormData({ ...formData, nslId: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c5cae9" },
                    "&:hover fieldset": { borderColor: "#5c6bc0" },
                    "&.Mui-focused fieldset": { borderColor: "#283593" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c5cae9" },
                    "&:hover fieldset": { borderColor: "#5c6bc0" },
                    "&.Mui-focused fieldset": { borderColor: "#283593" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c5cae9" },
                    "&:hover fieldset": { borderColor: "#5c6bc0" },
                    "&.Mui-focused fieldset": { borderColor: "#283593" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Type"
                select
                margin="normal"
                variant="outlined"
                value={formData.userType}
                onChange={(e) =>
                  setFormData({ ...formData, userType: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#c5cae9" },
                    "&:hover fieldset": { borderColor: "#5c6bc0" },
                    "&.Mui-focused fieldset": { borderColor: "#283593" },
                  },
                }}
              >
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="projectLead">Project Lead</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 4,
              backgroundColor: "#283593",
              color: "#fff",
              "&:hover": { backgroundColor: "#1a237e" },
              py: 1.75,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 3,
            }}
          >
            Register
          </Button>
          <Typography
            align="center"
            sx={{ mt: 3 }}
            variant="body2"
            color="textSecondary"
          >
            Already have an account?{" "}
            <Link
              onClick={() => navigate("/login")}
              sx={{
                color: "#283593",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}