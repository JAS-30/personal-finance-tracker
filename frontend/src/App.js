import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TransactionHistory from './pages/TransactionHistory';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Validate token on app load
  const validateToken = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token Payload:', payload); 
      return payload.exp * 1000 > Date.now();  // Check if token is expired
    } catch (error) {
      console.error('Token Validation Error:', error);  
      return false;
    }
  };

  // Check if token is valid on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && validateToken(token)) {
      console.log('Valid token found, setting authenticated to true');
      setIsAuthenticated(true);
    } else {
      console.log('No valid token found, setting authenticated to false');
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]); // Run once on mount, not on auth state change

  // Ensure state updates on login to redirect properly
  const handleAuthentication = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  const AuthenticatedLayout = ({ children }) => (
    <>
      <Navbar setIsAuthenticated={handleAuthentication} />
      {children}
    </>
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={handleAuthentication} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/home" /> : <Register />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <AuthenticatedLayout><Home /></AuthenticatedLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <AuthenticatedLayout><Profile /></AuthenticatedLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/transaction-history"
          element={isAuthenticated ? <AuthenticatedLayout><TransactionHistory /></AuthenticatedLayout> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
