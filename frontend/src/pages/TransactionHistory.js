import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import TransactionList from '../components/TransactionList';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;

  @media (max-width: 1200px) {
    max-width: 90%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
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

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Dropdown = styled.select`
  margin: 0 auto 20px;
  display: block;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 16px;
  margin: 10px 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;


const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [colorMapping, setColorMapping] = useState({});
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchTransactions = useCallback(async () => {
    try {
      let response;
      if (selectedSubcategory === 'all') {
        response = await apiService.getTransactions(token);
      } else {
        response = await apiService.getTransactionsBySubcategory(selectedSubcategory, token);
      }
      if (response && Array.isArray(response)) {
        setTransactions(response);
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    }
  }, [token, selectedSubcategory]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchTransactions();
    }
  }, [navigate, token, fetchTransactions]);

  useEffect(() => {
    const COLORS = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', // Red, Blue, Yellow, Green, Orange
      '#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300'  // More colors if needed
    ];
  
    // Filter transactions to exclude those with category 'income'
    const filteredTransactions = transactions.filter(transaction => transaction.category !== 'income');
  
    const colorMap = {};
    const subcategories = filteredTransactions.map(transaction => transaction.subcategory);
    const uniqueSubcategories = [...new Set(subcategories)];
  
    uniqueSubcategories.forEach((subcategory, index) => {
      const color = COLORS[index % COLORS.length]; // Cycle through available colors
      colorMap[subcategory] = color;
    });
  
    setColorMapping(colorMap);
  }, [transactions]);
  

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Heading>Transaction History</Heading>
      <Dropdown
        value={selectedSubcategory}
        onChange={(e) => setSelectedSubcategory(e.target.value)}
      >
        <option value="all">All Subcategories</option>
        {[...new Set(transactions.map(tx => tx.subcategory))].map(sub => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </Dropdown>
      <TransactionList
        transactions={transactions}
        subcategoryColors={colorMapping}
        token={token}
        refreshTransactions={fetchTransactions}
      />
    </Container>
  );
};

export default TransactionHistory;
