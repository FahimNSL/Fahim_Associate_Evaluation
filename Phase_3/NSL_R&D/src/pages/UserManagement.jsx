import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { api } from "../store/api";
import CloseIcon from "@mui/icons-material/Close";

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nslId: "",
    password: "",
    userType: "member",
  });

  const { data: users, isLoading } = api.useGetUsersQuery();
  const [createUser] = api.useCreateUserMutation();

  const handleSubmit = async () => {
    try {
      await createUser(formData);
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        nslId: "",
        password: "",
        userType: "member",
      });
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          mb: 4,
          display: { xs: "block", sm: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0d47a1" }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            mt: { xs: 2, sm: 0 },
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", border: "1px solid #ccc" }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", border: "1px solid #ccc" }}>NSL ID</TableCell>
              <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", border: "1px solid #ccc" }}>Email</TableCell>
              <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", border: "1px solid #ccc" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell sx={{ border: "1px solid #ccc" }}>{user.name}</TableCell>
                <TableCell sx={{ border: "1px solid #ccc" }}>{user.nslId}</TableCell>
                <TableCell sx={{ border: "1px solid #ccc" }}>{user.email}</TableCell>
                <TableCell sx={{ border: "1px solid #ccc" }}>{user.userType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Add New User
          <Button onClick={() => setOpen(false)} sx={{ color: "grey.600" }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="NSL ID"
            margin="normal"
            value={formData.nslId}
            onChange={(e) =>
              setFormData({ ...formData, nslId: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <TextField
            fullWidth
            select
            label="Role"
            margin="normal"
            value={formData.userType}
            onChange={(e) =>
              setFormData({ ...formData, userType: e.target.value })
            }
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="projectLead">Project Lead</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}