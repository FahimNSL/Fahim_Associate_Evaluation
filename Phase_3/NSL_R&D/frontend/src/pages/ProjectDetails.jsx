import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
} from "@mui/material";
import { api } from "../store/api";
import { useAuth } from "../contexts/AuthContext";
import ReportList from "../components/ReportList";
import TeamList from "../components/TeamList";
import ResearchPaperList from "../components/ResearchPaperList";
import EditProjectModal from "../components/EditProjectModal";
import TeamContributionGraph from "../components/TeamContributionGraph";

export default function ProjectDetails() {
  const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const { data: project, isLoading } = api.useGetProjectQuery(id);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isProjectLead = user._id === project?.projectLead?._id;
  const isMember = project?.projectMembers.some((member) => member._id === user._id);
  const canEdit = user.userType === "admin" || isProjectLead;

  return (
    <Box sx={{ p: 2, mx: 'auto', maxWidth: 'lg' }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#6a1b9a', mb: { xs: 2, md: 0 } }}>
          {project?.title}
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsOpenProjectModal(true)}
            sx={{ borderRadius: 2 }}
          >
            Edit Project
          </Button>
        )}
        <EditProjectModal
          project={project}
          isOpen={isOpenProjectModal}
          closeModal={() => setIsOpenProjectModal(false)}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Paper sx={{ mb: 4, p: 2, borderRadius: 2, boxShadow: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable" // This makes the tabs scrollable on smaller screens
          scrollButtons="auto" // Show scroll buttons automatically
        >
          <Tab label="Overview" />
          <Tab label="Reports" />
          <Tab label="Research Papers" />
          <Tab label="Team" />
          <Tab label="Contribution Graph" />
        </Tabs>
      </Paper>

      <Box sx={{ overflowX: 'auto' }}>
        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography sx={{ mb: 2 }}>{project?.description}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography>
                    <strong>Status:</strong> {project?.status}
                  </Typography>
                  <Typography>
                    <strong>Duration:</strong>{" "}
                    {new Date(project?.duration?.startDate).toLocaleDateString()} -{" "}
                    {new Date(project?.duration?.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    <strong>Project Lead:</strong> {project?.projectLead?.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <ReportList projectId={id} canAdd={canEdit || isMember} />
        )}

        {activeTab === 2 && (
          <ResearchPaperList projectId={id} canAdd={canEdit || isMember} canDelete={canEdit} />
        )}

        {activeTab === 3 && (
          <TeamList
            projectId={id}
            canManageTeam={canEdit}
            members={project?.projectMembers}
            lead={project?.projectLead}
          />
        )}
        
        {activeTab === 4 && (
          <TeamContributionGraph projectId={id} />
        )}
      </Box>
    </Box>
  );
}
