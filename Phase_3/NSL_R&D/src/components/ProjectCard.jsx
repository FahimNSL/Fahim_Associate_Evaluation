import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <Card sx={{
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: 6,
      },
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: 2,
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ height: '60px', overflow: 'hidden' }}>
          {project.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium', color: project.status === 'active' ? 'green' : 'red' }}>
          Status: {project.status}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          size="small"
          onClick={() => navigate(`/projects/${project._id}`)}
          variant="contained"
          sx={{
            backgroundColor: '#3f51b5',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#303f9f',
            },
            borderRadius: '8px',
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}