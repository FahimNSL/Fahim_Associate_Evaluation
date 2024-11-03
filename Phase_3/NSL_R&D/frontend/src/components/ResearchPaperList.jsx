import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { api } from '../store/api';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function ResearchPaperList({ projectId, canAdd, canDelete }) {
  const [open, setOpen] = useState(false);
  const [paper, setPaper] = useState({
    title: '',
    publishedYear: '',
    dataset: '',
    accuracy: '',
    precision: '',
    recall: ''
  });

  const { data: reports = [], isLoading, isError, error } = api.useGetReportsQuery(projectId);
  const [updateReport, { isLoading: isUpdating }] = api.useUpdateReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = api.useDeleteReportMutation();

  const handleAddPaper = async () => {
    try {
      const report = reports.find(r => r.project._id === projectId || r.project === projectId);
      if (report) {
        await updateReport({
          id: report._id,
          researchPapers: [...report.researchPapers, paper]
        }).unwrap();
        toast.success('Research paper added successfully');
      }
      setOpen(false);
      setPaper({ title: '', publishedYear: '', dataset: '', accuracy: '', precision: '', recall: '' });
    } catch (error) {
      console.error('Failed to add research paper:', error);
      toast.error('Failed to add research paper');
    }
  };

  const handleDeletePaper = async (paperId) => {
    const report = reports.find(r => r.project._id === projectId || r.project === projectId);
    if (report) {
      try {
        await updateReport({
          id: report._id,
          researchPapers: report.researchPapers.filter(p => p._id !== paperId)
        }).unwrap();
        toast.success("Research paper deleted successfully");
      } catch (error) {
        console.error('Failed to delete research paper:', error);
        toast.error('Failed to delete research paper');
      }
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error: {error.message}</Typography>;

  const papers = reports?.flatMap(report => report.researchPapers) || [];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>Research Papers</Typography>
        {canAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={isUpdating}
          >
            Add Paper
          </Button>
        )}
      </Box>

      <Paper elevation={2} sx={{ padding: 2 }}>
        {papers.map((paper, index) => (
          <Card key={index} sx={{ mb: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
            <CardContent>
              <Typography variant="h6" component="div">{paper.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Published: {paper.publishedYear}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dataset: {paper.dataset}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Metrics: Accuracy {paper.accuracy}%, Precision {paper.precision}%, Recall {paper.recall}%
              </Typography>
            </CardContent>
            {canDelete && (
              <CardActions>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeletePaper(paper._id)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </CardActions>
            )}
          </Card>
        ))}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Research Paper</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={paper.title}
            onChange={(e) => setPaper({ ...paper, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Published Year"
            type="number"
            fullWidth
            value={paper.publishedYear}
            onChange={(e) => setPaper({ ...paper, publishedYear: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Dataset"
            fullWidth
            value={paper.dataset}
            onChange={(e) => setPaper({ ...paper, dataset: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Accuracy (%)"
            type="number"
            fullWidth
            value={paper.accuracy}
            onChange={(e) => setPaper({ ...paper, accuracy: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Precision (%)"
            type="number"
            fullWidth
            value={paper.precision}
            onChange={(e) => setPaper({ ...paper, precision: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Recall (%)"
            type="number"
            fullWidth
            value={paper.recall}
            onChange={(e) => setPaper({ ...paper, recall: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPaper} variant="contained" disabled={isUpdating}>
            {isUpdating ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
