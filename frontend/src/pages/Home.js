import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api';
import TransactionList from '../components/TransactionList';
import BudgetSummary from '../components/BudgetSummary';
import ExpenseForm from '../components/ExpenseForm';
import Chart from '../components/Chart';
import styled from 'styled-components';

// Styled components for Home page
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Section = styled.section`
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Heading = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Subheading = styled.h3`
  font-size: 20px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 18px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  color: #666;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Home = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [budget, setBudget] = useState({ total: 0, remaining: 0 }); // Add budget state
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const fetchData = async () => {
        try {
          const userProfile = await authService.getProfile(token);
          setUser(userProfile);
          setBudget(userProfile.budget); // Set the budget from the user profile

          const fetchedTransactions = await apiService.getTransactions(token);
          setTransactions(fetchedTransactions);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to fetch data');
        }
      };

      fetchData();
    }
  }, [navigate, token]);

  const remainingBudget = useMemo(() => {
    if (!user || !transactions) return 0;
    const totalExpenses = transactions.reduce((sum, transaction) => {
      if (transaction.amount && !isNaN(transaction.amount)) {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);
    const totalBudget = user?.budget?.total || 0;
    return totalBudget - totalExpenses;
  }, [transactions, user]);

  const handleAddTransaction = async (transactionData) => {
    try {
      await apiService.addTransaction(transactionData, token);
      setTransactions((prevTransactions) => [...prevTransactions, transactionData]);
    } catch (err) {
      console.error('Error adding transaction:', err.message);
      setError('Failed to add transaction');
    }
  };

  // Add a function to handle updating the budget
  const handleBudgetUpdate = (updatedBudget) => {
    setBudget(updatedBudget); // Update the budget state when it's edited
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!user || transactions.length === 0) {
    return <LoadingMessage>Loading your profile and transactions...</LoadingMessage>;
  }

  const recentTransactions = transactions.slice(0, 3);

  const totalBudget = budget.total; // Use the budget state for total budget
  if (totalBudget === undefined || isNaN(totalBudget)) {
    return <ErrorMessage>Total Budget is missing or invalid.</ErrorMessage>;
  }

  const adjustedRemainingBudget = remainingBudget < 0 ? 0 : remainingBudget;

  return (
    <Container>
      <Heading>Welcome, {user.username}</Heading>
      <p>Your budget summary:</p>
      <BudgetSummary
        budget={{
          total: totalBudget,
          remaining: adjustedRemainingBudget,
        }}
        userId={user._id}
        token={token}
        onBudgetUpdate={handleBudgetUpdate} // Pass down the handler for budget update
      />
      <Section>
        <Subheading>Add New Transaction</Subheading>
        <ExpenseForm userId={user._id} token={token} onAddTransaction={handleAddTransaction} />
      </Section>

      <Section>
        <Subheading>Your Expense Overview</Subheading>
        {totalBudget && !isNaN(totalBudget) ? (
          <Chart transactions={transactions} totalBudget={totalBudget} />
        ) : (
          <LoadingMessage>Loading your budget...</LoadingMessage>
        )}
      </Section>

      {recentTransactions.length > 0 && (
        <Section>
          <Subheading>Your Recent Transactions</Subheading>
          <TransactionList transactions={recentTransactions} />
        </Section>
      )}

      <div>
        <Button onClick={() => navigate('/profile')}>Go to Profile</Button>
        <Button onClick={() => navigate('/transaction-history')}>View Transaction History</Button>
      </div>
    </Container>
  );
};

export default Home;
