// Dashboard.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { api } from "../store/api";
import { useAuth } from "../contexts/AuthContext";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();  // Get user info from context
  const [searchTerm, setSearchTerm] = useState("");
  const { data: projects, isLoading, error } = api.useGetProjectsQuery();
  const [deleteProject] = api.useDeleteProjectMutation();

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId).unwrap();
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete the project: ", error);
      toast.error("Failed to delete the project.");
    }
  };

  // Filter projects based on the search term
  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading projects: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", borderRadius: 2 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField
          label="Search Projects"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300, bgcolor: "white", borderRadius: 1 }}
        />
        {(user.userType === "admin" || user.userType === "projectLead") && (
          <Button
            variant="contained"
            onClick={() => setIsOpenProjectModal(true)}
            sx={{ bgcolor: "#007bff", "&:hover": { bgcolor: "#0056b3" } }} // Custom hover color
          >
            New Project
          </Button>
        )}
        <CreateProjectModal
          isOpen={isOpenProjectModal}
          closeModal={() => setIsOpenProjectModal(false)}
        />
      </Box>

      {(!projects || projects.length === 0) ? (
        <Typography align="center">No projects found</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
                <CardContent>
                  <ProjectCard 
                    project={project} 
                    onDelete={handleDeleteProject} 
                    showDelete={user.userType === "admin" } // Conditional render
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
