import { toast } from 'react-toastify';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Zoom,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useChangePasswordMutation } from '../store/api';

export default function Profile() {
  const { user } = useAuth();
  const [changePassword, { isLoading: isLoadingChangePassword }] = useChangePasswordMutation();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        userId: user._id,
      }).unwrap();
      toast.success("Password changed successfully");
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setOpen(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#1976d2' }}>
        Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Zoom in={true} timeout={1000}>
            <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>User Information</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Name:</strong> {user.name}</Typography>
                <Typography><strong>NSL ID:</strong> {user.nslId}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
                <Typography><strong>Role:</strong> {user.userType}</Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                sx={{
                  mt: 2,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': { borderColor: '#115293', color: '#115293' },
                  transition: '0.3s',
                  '&:active': { transform: 'scale(0.95)' },
                }}
              >
                Change Password
              </Button>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>

      {/* Modal for Changing Password */}
      <Dialog open={open} onClose={() => setOpen(false)} TransitionComponent={Zoom}>
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>Change Password</DialogTitle>
        <DialogContent>
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              margin="normal"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1976d2' } } }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              margin="normal"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1976d2' } } }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              margin="normal"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#1976d2' } } }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoadingChangePassword}
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
          >
            {isLoadingChangePassword ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Processing
              </Box>
            ) : (
              "Change Password"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
