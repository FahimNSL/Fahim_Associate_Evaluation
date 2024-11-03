import React, { useState } from "react";
import { Button, IconButton, Menu, MenuItem, Box, Hidden, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

const Navigation = ({ isMobile, user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path) => {
    if (path) navigate(path);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Hidden smDown>
        {/* Desktop Navigation */}
        {user && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button 
              color="inherit" 
              onClick={() => navigate("/")} 
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              Dashboard
            </Button>
            {(user.userType === "admin" || user.userType === "projectLead") && (
              <Button 
                color="inherit" 
                onClick={() => navigate("/users")} 
                sx={{ fontWeight: "bold", letterSpacing: 1 }}
              >
                Users
              </Button>
            )}
            <Button 
              color="inherit" 
              onClick={() => navigate("/profile")} 
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              Profile
            </Button>
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                "&:hover": {
                  color: "red",
                },
              }}
              title="Logout"
            >
              Logout
            </Button>
          </Box>
        )}
      </Hidden>
      <Hidden smUp>
        {/* Mobile Navigation */}
        <IconButton
          color="inherit"
          onClick={handleMenuClick}
          aria-controls="menu-appbar"
          aria-haspopup="true"
          sx={{ ml: 1 }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
          sx={{
            "& .MuiPaper-root": {
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              minWidth: 200,
            },
          }}
        >
          {user && (
            <>
              <MenuItem 
                onClick={() => handleClose("/")} 
                sx={{ fontWeight: "medium" }}
              >
                Dashboard
              </MenuItem>
              {(user.userType === "admin" || user.userType === "projectLead") && (
                <MenuItem 
                  onClick={() => handleClose("/users")} 
                  sx={{ fontWeight: "medium" }}
                >
                  Users
                </MenuItem>
              )}
              <MenuItem 
                onClick={() => handleClose("/profile")} 
                sx={{ fontWeight: "medium" }}
              >
                Profile
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                onClick={logout} 
                title="Logout"
                sx={{ color: "red", fontWeight: "bold" }}
              >
                <LogoutIcon sx={{ mr: 1, color: "red" }} />
                Logout
              </MenuItem>
            </>
          )}
        </Menu>
      </Hidden>
    </Box>
  );
};

export default Navigation;
