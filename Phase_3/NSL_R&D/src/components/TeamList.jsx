import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import { api } from '../store/api';

export default function TeamList({ projectId, canManageTeam, members, lead }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [updateProject] = api.useUpdateProjectMutation();

  const handleAddMember = async () => {
    try {
      await updateProject({
        id: projectId,
        members: [...members.map(m => m._id), email]
      });
      setOpen(false);
      setEmail('');
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await updateProject({
        id: projectId,
        members: members.filter(m => m._id !== memberId).map(m => m._id)
      });
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Team Members</Typography>
        {canManageTeam && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
              borderRadius: '8px',
            }}
          >
            Add Member
          </Button>
        )}
      </Box>

      <Paper elevation={3} sx={{ borderRadius: '12px' }}>
        <List>
          <ListItem sx={{ backgroundColor: '#f0f4ff', borderRadius: '8px', mb: 1 }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#3f51b5' }}>{lead.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={lead.name}
              secondary="Project Lead"
              primaryTypographyProps={{ fontWeight: 'bold', color: '#3f51b5' }}
            />
          </ListItem>
          {members.map((member) => (
            <ListItem
              key={member._id}
              secondaryAction={
                canManageTeam && member._id !== lead._id && (
                  <IconButton onClick={() => handleRemoveMember(member._id)} sx={{ color: '#f44336' }}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
              sx={{ mb: 1 }}
            >
              <ListItemAvatar>
                <Avatar>{member.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={member.email}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained" sx={{ backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}