import { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { api } from "../store/api";

export default function ReportList({ projectId, canAdd }) {
  const navigate = useNavigate();
  const { data: reports, isLoading } = api.useGetReportsQuery(projectId);

  if (isLoading) {
    return <Typography>Loading reports...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Reports</Typography>
        {canAdd && (
          <Button
            variant="contained"
            onClick={() => navigate("/reports/new", { state: { projectId } })}
          >
            Add Report
          </Button>
        )}
      </Box>

      <Paper>
        <List>
          {reports?.map((report) => (
            <ListItem key={report._id}>
              <ListItemText
                primary={report.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      Status: {report.status}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Accuracy: {report.accuracy}%
                    </Typography>
                  </>
                }
              />
              {canAdd && (
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => navigate(`/reports/${report._id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
