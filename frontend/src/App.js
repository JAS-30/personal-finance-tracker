
// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TransactionHistory from './pages/TransactionHistory';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && validateToken(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const AuthenticatedLayout = ({ children }) => (
    <>
      <Navbar />
      {children}
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
        <Route path="/home" element={isAuthenticated ? <AuthenticatedLayout><Home /></AuthenticatedLayout> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <AuthenticatedLayout><Profile /></AuthenticatedLayout> : <Navigate to="/login" />} />
        <Route path="/transaction-history" element={isAuthenticated ? <AuthenticatedLayout><TransactionHistory /></AuthenticatedLayout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
