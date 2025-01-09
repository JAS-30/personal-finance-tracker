import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import styled from 'styled-components';

// Styled components for Register page (same as before)
const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 15px;
  }
`;

const Heading = styled.h2`
  font-size: 28px;
  text-align: center;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  input {
    padding: 12px;
    font-size: 16px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: #007bff;
    }

    @media (max-width: 768px) {
      padding: 10px;
      font-size: 14px;
    }
  }

  button {
    padding: 12px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }

    @media (max-width: 768px) {
      font-size: 14px;
      padding: 10px 16px;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const RedirectLink = styled.p`
  text-align: center;
  font-size: 16px;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');  // New state for password error
  const [loading, setLoading] = useState(false);  // New loading state
  const navigate = useNavigate(); // Using navigate for React Router v6

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    // Client-side validation for password
    if (passwordError) {
      setLoading(false);
      return; // Prevent form submission if there's an error
    }

    try {
      // Call register service from authService
      await authService.register({ username, email, password });

      // Redirect to login after successful registration
      navigate('/login');
    } catch (err) {
      // Handle error and set specific message
      setError(err.message || 'Error during registration, please try again');
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <Container>
      <Heading>Register</Heading>
      <Form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);  // Validate password on change
          }}
          required
        />
        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <button type="submit" disabled={loading || passwordError}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </Form>
      <RedirectLink>
        Already have an account? <a href="/login">Login</a>
      </RedirectLink>
    </Container>
  );
};

export default Register;
