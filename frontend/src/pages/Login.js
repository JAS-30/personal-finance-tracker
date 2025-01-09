import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full viewport height */
  background-color: #f8f9fa;
`;

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  width: 100%; /* Ensure it takes full width on smaller devices */

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
    margin-bottom: 15px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  input {
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus {
    border-color: #007bff;
    outline: none;
  }

  button {
    padding: 14px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;

    &:hover {
      background-color: #0056b3;
    }
  }

  @media (max-width: 768px) {
    gap: 15px;

    button {
      padding: 12px;
      font-size: 14px;
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

const RegisterLink = styled.p`
  text-align: center;
  font-size: 14px;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;


const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await authService.login({ email, password });

      if (user && user.token) {
        localStorage.setItem('token', user.token); // Store the token
        setIsAuthenticated(true); // Update authentication state in parent (App.js)
        navigate('/home'); // Redirect to home after successful login
      } else {
        setError('Invalid credentials or server error');
      }
    } catch (err) {
      console.error('Login error:', err.response || err);
      setError('Invalid credentials or server error');
    }
  };

  return (
    <PageWrapper>
    <Container>
      <Heading>Login</Heading>
      <Form onSubmit={handleLogin}>
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
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <button type="submit">Login</button>
      </Form>
      <RegisterLink>
        Don't have an account? <a href="/register">Register</a>
      </RegisterLink>
    </Container>
    </PageWrapper>
  );
};

export default Login;
