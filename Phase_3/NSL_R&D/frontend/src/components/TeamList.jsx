import { useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAddUserMutation, useDeleteUserMutation } from '../store/api';

export default function TeamList({ projectId, canManageTeam, members, lead }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loadingRemove, setLoadingRemove] = useState(null); // Holds member ID of the loading removal

  // Redux Toolkit Query hooks for API calls
  const [addMember, { isLoading: loadingAdd }] = useAddUserMutation();
  const [removeMember] = useDeleteUserMutation();

  const handleAddMember = async () => {
    try {
      await addMember({ projectId, email }).unwrap(); // Unwrap the promise to handle success/error
      setOpen(false);
      setEmail('');
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setLoadingRemove(memberId);
    try {
      await removeMember({ projectId, memberId }).unwrap(); // Unwrap the promise to handle success/error
    } catch (error) {
      console.error('Failed to remove member:', error);
    } finally {
      setLoadingRemove(null);
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: '8px', boxShadow: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Team Members</Typography>
        {canManageTeam && (
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Add Member
          </Button>
        )}
      </Box>

      <Paper elevation={2} sx={{ borderRadius: '8px' }}>
        <List>
          {/* Colorful lead row */}
          <ListItem sx={{ bgcolor: 'secondary.main', borderRadius: '8px', mb: 1, color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>{lead?.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1" sx={{ fontWeight: '600', color: 'white' }}>{lead?.name}</Typography>}
              secondary={<Typography variant="body2" color="white">Project Lead</Typography>}
            />
          </ListItem>

          {members?.map((member) => (
            <ListItem
              key={member._id}
              secondaryAction={
                canManageTeam && member._id !== lead?._id && (
                  <IconButton onClick={() => handleRemoveMember(member._id)} disabled={loadingRemove === member._id}>
                    {loadingRemove === member._id ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </IconButton>
                )
              }
              sx={{ mb: 1, borderRadius: '8px', bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.100' } }}
            >
              <ListItemAvatar>
                <Avatar>{member.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: '600' }}>{member.name}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{member.email}</Typography>}
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
            variant="outlined"
            sx={{ bgcolor: 'background.default', borderRadius: '4px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddMember} variant="contained" color="primary" disabled={loadingAdd}>
            {loadingAdd ? <CircularProgress size={24} color="inherit" /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
