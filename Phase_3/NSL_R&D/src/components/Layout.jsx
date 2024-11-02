import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Navigation from "./Navigation";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f4f8', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#3f51b5', boxShadow: 'none' }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              cursor: "pointer",
              fontWeight: 'bold',
              color: '#ffffff',
              '&:hover': {
                color: '#ffeb3b', // Add a hover effect for the title
              },
            }}
            onClick={() => navigate("/")}
          >
            NSL R&D
          </Typography>
          <Navigation isMobile={isMobile} user={user} />
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4, bgcolor: '#ffffff', borderRadius: '8px', boxShadow: 2, p: 4 }}>
        {children}
      </Container>
    </Box>
  );
}