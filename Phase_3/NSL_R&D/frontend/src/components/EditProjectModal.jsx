import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../store/api";
import { useAuth } from "../contexts/AuthContext";

const EditProjectModal = ({ isOpen, closeModal, project }) => {
  const { users } = useAuth();
  const [title, setTitle] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [description, setDescription] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [duration, setDuration] = useState({ startDate: "", endDate: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updateProject, { isLoading }] = api.useUpdateProjectMutation();
  const navigate = useNavigate();

  // State for input validation
  const [errors, setErrors] = useState({
    uniqueId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (project) {
      setTitle(project?.title);
      setUniqueId(project?.uniqueId);
      setDescription(project?.description);
      setProjectLead(project?.projectLead);
      setDuration(project?.duration);
      setSelectedUsers(project?.projectMembers);
    }
  }, [project]);

  const handleSelectChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  const handleDelete = (userId) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset errors
    setErrors({
      uniqueId: "",
      startDate: "",
      endDate: "",
    });
  
    let isValid = true;
  
    // Check if unique ID is empty
    if (!uniqueId.trim()) {
      setErrors((prev) => ({ ...prev, uniqueId: "Unique ID cannot be empty" }));
      isValid = false;
    }
  
    // Validate dates
    const startDate = new Date(duration.startDate);
    const endDate = new Date(duration.endDate);
  
    if (!duration.startDate) {
      setErrors((prev) => ({ ...prev, startDate: "Start date is required" }));
      isValid = false;
    }
  
    if (!duration.endDate) {
      setErrors((prev) => ({ ...prev, endDate: "End date is required" }));
      isValid = false;
    }
  
    // Check if end date is earlier than start date
    if (endDate < startDate) {
      setErrors((prev) => ({ ...prev, endDate: "End date must be later than or equal to start date" }));
      isValid = false;
    }
  
    if (!isValid) return;
  
    const projectData = {
      title,
      uniqueId,
      description,
      projectLead,
      projectMembers: selectedUsers,
      duration,
    };
  
    try {
      await updateProject({ id: project._id, ...projectData }).unwrap();
      toast.success("Project updated successfully");
      navigate("/");
      closeModal();
    } catch (error) {
      toast.error("Failed to update project");
    }
  };
  

  return (
    <Dialog open={isOpen} onClose={closeModal} maxWidth="md" fullWidth>
      <Paper sx={{ padding: 4, borderRadius: 3, position: "relative" }}>
        <Button
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "gray",
          }}
        >
          <CloseIcon />
        </Button>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
          Edit Project
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unique ID"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
                error={!!errors.uniqueId}
                helperText={errors.uniqueId}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required margin="dense">
                <InputLabel id="project-lead-label">Project Lead</InputLabel>
                <Select
                  labelId="project-lead-label"
                  value={projectLead}
                  onChange={(e) => setProjectLead(e.target.value)}
                  label="Project Lead"
                >
                  {users
                    .filter((user) => user.userType === "projectLead")
                    .map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} ({user.userType === "projectLead" ? "Lead" : ""})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required margin="dense">
                <InputLabel id="user-select-label">Project Members</InputLabel>
                <Select
                  labelId="user-select-label"
                  multiple
                  value={selectedUsers}
                  onChange={handleSelectChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => (
                        <Chip
                          key={id}
                          label={users.find((user) => user._id === id)?.name}
                          onDelete={() => handleDelete(id)}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {selectedUsers.includes(user._id) && <CheckIcon fontSize="small" />} {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={duration.startDate}
                onChange={(e) =>
                  setDuration({ ...duration, startDate: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
                margin="dense"
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={duration.endDate}
                onChange={(e) =>
                  setDuration({ ...duration, endDate: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
                margin="dense"
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              sx={{
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                px: 4,
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} sx={{ color: "#fff", mr: 1 }} />
                  Processing...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Dialog>
  );
};

export default EditProjectModal;
