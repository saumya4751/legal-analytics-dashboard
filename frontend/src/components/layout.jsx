import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
} from '@mui/material';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Legal Analytics Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}