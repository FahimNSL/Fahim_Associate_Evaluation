import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      await axios.post('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    }
  };

  return (
    <Box sx={{ p: 6, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ mb: 6, fontWeight: 'bold' }}><h2>{user.name}</h2></Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>User Information</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>NSL ID:</strong> {user.nslId}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Role:</strong> {user.userType}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Change Password</Typography>
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
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1 }} />, // Added lock icon
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc', // Light border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#a0a0a0', // Darker border on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3f51b5', // Focused border color
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                margin="normal"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1 }} />, // Added lock icon
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc', // Light border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#a0a0a0', // Darker border on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3f51b5', // Focused border color
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                margin="normal"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1 }} />, // Added lock icon
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc', // Light border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#a0a0a0', // Darker border on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3f51b5', // Focused border color
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: '#3f51b5', // Primary color
                  '&:hover': {
                    backgroundColor: '#2c387e', // Darker shade on hover
                  },
                }}
              >
                Change Password
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}