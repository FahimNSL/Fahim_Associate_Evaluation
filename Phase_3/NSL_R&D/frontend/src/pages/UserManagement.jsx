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
  CircularProgress,
} from "@mui/material";
import { api, useCreateUserMutation, useDeleteUserDatabaseMutation, useChangeUserRoleMutation } from '../store/api';
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

export default function UserManagement() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nslId: "",
    password: "",
    userType: "member",
  });
  const [selectedUser, setSelectedUser] = useState(null); // For changing user role
  const [newRole, setNewRole] = useState("member"); // For role selection

  const { data: users, isLoading } = api.useGetUsersQuery();
  const [createUser, { isLoading: isLoadingCreateUser }] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserDatabaseMutation();
  const [changeUserRole, { isLoading: isLoadingChangeRole }] = useChangeUserRoleMutation();
  
  const handleSubmit = async () => {
    try {
      await createUser(formData).unwrap();
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        nslId: "",
        password: "",
        userType: "member",
      });
      toast.success("User created successfully");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user._id) {
      toast.error("You cannot delete yourself.");
      return;
    }
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleChangeRole = async (userId) => {
    try {
      await changeUserRole({ userId, role: newRole }).unwrap();
      toast.success("User role changed successfully.");
      setSelectedUser(null); // Close the dialog
    } catch (error) {
      console.error("Failed to change user role:", error);
      toast.error("Failed to change user role.");
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">User Management</Typography>
        {user?.userType === "admin" && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add User
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell sx={{ border: "1px solid #ddd", fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Name</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>NSL ID</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Email</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Role</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Actions</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", fontWeight: "bold", backgroundColor: "#3f51b5", color: "white" }}>Change Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell sx={{ border: "1px solid #ddd" }}>{user.name}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>{user.nslId}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>{user.email}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>{user.userType}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {user.userType !== "admin" && (
                    <Button variant="outlined" color="error" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </Button>
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  {user.userType !== "admin" && (
                    <Button variant="outlined" onClick={() => { setSelectedUser(user); setNewRole(user.userType); }}>
                      Change Role
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Add New User
          <Button onClick={() => setOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField fullWidth label="NSL ID" margin="normal" value={formData.nslId} onChange={(e) => setFormData({ ...formData, nslId: e.target.value })} />
          <TextField fullWidth label="Email" type="email" margin="normal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <TextField fullWidth select label="Role" margin="normal" value={formData.userType} onChange={(e) => setFormData({ ...formData, userType: e.target.value })}>
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="projectLead">Project Lead</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isLoadingCreateUser}>
            {isLoadingCreateUser ? <CircularProgress size={24} sx={{ mr: 1 }} /> : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="New Role" margin="normal" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="projectLead">Project Lead</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Cancel</Button>
          <Button onClick={() => selectedUser && handleChangeRole(selectedUser._id)} variant="contained">
            {isLoadingChangeRole ? <CircularProgress size={24} sx={{ mr: 1 }} /> : "Change Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
