import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, Avatar } from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Importing Sign Up Icon
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import listImage from '../assets/list.png';


const MotionButton = motion(Button); // Creating a MotionButton component for animations

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  // Use MUI's useTheme and useMediaQuery to make the navbar responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(768));

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    // Set the display name when isAuthenticated changes
    if (isAuthenticated) {
      setDisplayName(user.name); // If authenticated, show the user's name
    } else {
      setDisplayName('Sign Up'); // If not authenticated, show 'Sign Up'
    }
  }, [isAuthenticated, user]); // Only re-run effect when isAuthenticated or user.name changes

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility

  // Create a handler function for protected routes
  const handleProtectedRoute = () => {
    toggleDrawer();
    setOpenDialog(true);
  };

  return (
    <>
      {/* AppBar for large screens */}
      <AppBar position="sticky" sx={{ backgroundImage: 'linear-gradient(135deg, #000000, #333333)' }}>
        <Toolbar>
          {/* Menu Icon for mobile view */}
          {isMobile ? (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          ) : null}

          {/* App Name as home link */}
          <Typography 
  variant="h6" 
  sx={{
    flexGrow: 1,
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "1px",
    display: "flex",           // Add this to align items horizontally
    alignItems: "center",      // Center the items vertically
  }}
  onClick={() => navigate('/')}
>
  <img src={listImage} alt="Logo" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
  Task Master
</Typography>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <>
              <MotionButton 
                color="inherit" 
                component={Link} 
                to="/" 
                sx={{ margin: '0 10px' }}
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
              >
                Home
              </MotionButton>
              {isAuthenticated ? (
                <>
                  <MotionButton 
                    color="inherit" 
                    component={Link} 
                    to="/todo-list" 
                    sx={{ margin: '0 10px' }}
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                  >
                    To-Do-List
                  </MotionButton>
                  <MotionButton 
                    color="inherit" 
                    component={Link} 
                    to="/contact" 
                    sx={{ margin: '0 10px' }}
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                  >
                    Contact
                  </MotionButton>
                </>
              ) : (
                <>
                  <MotionButton 
                    color="inherit" 
                    onClick={() => setOpenDialog(true)} 
                    sx={{ margin: '0 10px' }}
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                  >
                    To-Do-List
                  </MotionButton>
                  <MotionButton 
                    color="inherit" 
                    onClick={() => setOpenDialog(true)} 
                    sx={{ margin: '0 10px' }}
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                  >
                    Contact
                  </MotionButton>
                </>
              )}
              <MotionButton
                color="inherit"
                startIcon={<AccountCircleIcon />}
                onClick={isAuthenticated ? handleClick : loginWithRedirect}
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                sx={{
                  margin: '0 10px',
                  cursor: "pointer",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                {isAuthenticated ? `Welcome, ${displayName}` : displayName}
              </MotionButton>
            </>
          ) : null}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      {isMobile ? (
        <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
          <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer}>
              <ListItemText primary="Home" />
            </ListItem>
            {isAuthenticated ? (
              <>
                <ListItem button component={Link} to="/todo-list" onClick={toggleDrawer}>
                  <ListItemText primary="To-Do-List" />
                </ListItem>
                <ListItem button component={Link} to="/contact" onClick={toggleDrawer}>
                  <ListItemText primary="Contact" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button onClick={handleProtectedRoute} sx={{marginLeft: "50px"}}>
                  <ListItemText primary="To-Do-List" />
                </ListItem>
                <ListItem button onClick={handleProtectedRoute}>
                  <ListItemText primary="Contact" />
                </ListItem>
              </>
            )}
            {/* Sign Up / User Menu for Mobile View */}
            {isAuthenticated ? (
              <>
                <ListItem button onClick={handleClick}>
                  <AccountCircleIcon sx={{ mr: 2 }} />
                  <ListItemText 
                    primary={`Welcome, ${displayName}`}
                  />
                </ListItem>
                <Menu
                  id="account-menu-mobile"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem disabled>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                    {user?.email}
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleClose();
                    logout({ returnTo: window.location.origin });
                  }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <ListItem button onClick={loginWithRedirect}>
                <AccountCircleIcon sx={{ mr: 2 }} />
                <ListItemText primary="Sign Up" />
              </ListItem>
            )}
          </List>
        </Drawer>
      ) : null}

      {/* Add the Menu component outside the Button */}
      {isAuthenticated && (
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem disabled>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
            {user?.email}
          </MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            logout({ returnTo: window.location.origin });
          }}>
            Logout
          </MenuItem>
        </Menu>
      )}

      {/* Warning Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '500px',
            m: 2,
            overflowX: 'hidden',  // Prevent horizontal scroll
            '& .MuiDialogTitle-root': {
              pb: 2,
            },
            '& .MuiDialogContent-root': {
              pb: 2,
              px: 3,
              overflowX: 'hidden',  // Prevent horizontal scroll
            },
            '& .MuiDialogActions-root': {
              px: 3,
              pb: 2,
            }
          }
        }}
      >
        <DialogTitle sx={{ pr: 6 }}>  {/* Added right padding for close button */}
          Protected Page
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={() => setOpenDialog(false)} 
            aria-label="close" 
            sx={{
              position: 'absolute', 
              right: 8, 
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info">
            Please sign up to access this page.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
