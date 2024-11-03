import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project, onDelete, showDelete }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 5,
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            letterSpacing: 0.5,
          }}
        >
          {project.title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, lineHeight: 1.6 }}
        >
          {project.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: project.status === "Completed" ? "green" : "orange",
            }}
          >
            Status: {project.status}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => navigate(`/projects/${project._id}`)}
          sx={{
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          View Details
        </Button>
        {showDelete && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onDelete(project._id)}
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
