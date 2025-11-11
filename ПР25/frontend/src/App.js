import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            YourApp - CRUD Application
          </Typography>
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" href="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h4" color="error">
                404 - Page Not Found
              </Typography>
            </Box>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;