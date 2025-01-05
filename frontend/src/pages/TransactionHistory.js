import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api'; // Use apiService here
import TransactionList from '../components/TransactionList';
import styled from 'styled-components';

// Styled components for Transaction History page
const Container = styled.div`
  max-width: 900px;
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

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Using navigate for React Router v6
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      const fetchTransactions = async () => {
        try {
          const response = await apiService.getTransactions(token);  // Use apiService here
          console.log('Fetched transactions:', response);  // Log the fetched data here

          if (response && Array.isArray(response)) {
            setTransactions(response);  // Set the transactions if the response is an array
          } else {
            setError('Invalid response format');
          }
        } catch (err) {
          console.error('Error fetching transactions:', err);
          setError('Failed to fetch transactions');
        }
      };

      fetchTransactions();
    }
  }, [navigate, token]);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Heading>Transaction History</Heading>
      <TransactionList transactions={transactions} />
    </Container>
  );
};

export default TransactionHistory;
