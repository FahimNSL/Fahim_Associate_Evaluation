import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Navigation from "./Navigation";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={3} sx={{ bgcolor: "#3f51b5" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: 1,
              "&:hover": {
                color: "#ffeb3b",
              },
            }}
          >
            R&D Reports
          </Typography>
          {isMobile ? (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => navigate("/menu")}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Navigation isMobile={isMobile} user={user} />
          )}
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          py: 3,
          px: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {children}
      </Container>
 
    </Box>
  );
}
