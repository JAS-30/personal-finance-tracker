import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api';
import TransactionList from '../components/TransactionList';
import BudgetSummary from '../components/BudgetSummary';
import ExpenseForm from '../components/ExpenseForm';
import Chart from '../components/Chart';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 15px;
    width: 100%;
  }
`;

const Section = styled.section`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Heading = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
    text-align: center;
  }
`;

const Subheading = styled.h3`
  font-size: 20px;
  color: #555;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 18px;
    text-align: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  flex-grow: 1;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 16px;
    margin-right: 0;
    width: 100%;
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
  const [budget, setBudget] = useState({ total: 0, remaining: 0 });
  const [colorMapping, setColorMapping] = useState({});
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // Memoizing checkMonthChange using useCallback to avoid re-creation
  const checkMonthChange = useCallback(() => {
    const currentDate = new Date();
    const lastSavedMonth = parseInt(localStorage.getItem('lastSavedMonth'), 10);
    if (lastSavedMonth !== currentDate.getMonth()) {
      // Handle month change logic here without directly updating state
      localStorage.setItem('lastSavedMonth', currentDate.getMonth());
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    
    // If no token, we rely on Profile.js to handle the redirection
    if (!token) {
      navigate('/login');
      return; // Prevent Home from rendering anything if token is null
    }
  
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching data for token...');
        const userProfile = await authService.getProfile(token);
        setUser(userProfile);
        setBudget(userProfile.budget || { total: 0, remaining: 0 });
  
        const fetchedTransactions = await apiService.getTransactions(token);
        setTransactions(fetchedTransactions);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    checkMonthChange();
    fetchData();
  }, [checkMonthChange, navigate]);
  
  

  const refreshTransactions = async () => {
    const token = localStorage.getItem('token'); 
    try {
      const fetchedTransactions = await apiService.getTransactions(token);
      setTransactions(fetchedTransactions);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
      setError('Failed to refresh transactions');
    }
  };

  const remainingBudget = useMemo(() => {
    if (!user || !user.budget) return 0;

    if (transactions.length === 0) {
      return user.budget.total || 0; // If no transactions, remaining budget is the total set by user
    }

    const totalExpenses = transactions.reduce((sum, transaction) => {
      if (transaction.category === 'expense' && transaction.amount && !isNaN(transaction.amount)) {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);

    const totalBudget = user.budget.total || 0;
    return totalBudget - totalExpenses;
  }, [transactions, user]);

  const totalIncome = useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;

    const incomeTransactions = transactions.filter((transaction) => transaction.category === 'income');
    return incomeTransactions.reduce((sum, transaction) => {
      if (transaction.amount && !isNaN(transaction.amount)) {
        return sum + transaction.amount;
      }
      return sum;
    }, 0);
  }, [transactions]);

  const handleAddTransaction = async (transactionData) => {
    const token = localStorage.getItem('token'); 
    try {
      await apiService.addTransaction(transactionData, token);
      setTransactions((prevTransactions) => [...prevTransactions, transactionData]);
    } catch (err) {
      console.error('Error adding transaction:', err.message);
      setError('Failed to add transaction');
    }
  };

  const handleBudgetUpdate = async (updatedBudget) => {
    const token = localStorage.getItem('token'); 
    setBudget(updatedBudget);
    try {
      const userId = user._id;
      const response = await authService.updateBudget(userId, updatedBudget, token);
      setBudget(response.budget || updatedBudget); 
    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Failed to update budget');
    }
  };

  const handleColorMappingChange = (newColorMapping) => {
    setColorMapping(newColorMapping);
  };

  const handleToggleBudgetEdit = () => {
    setIsEditingBudget(!isEditingBudget);
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  // If the user is still loading, display a loading message
  if (isLoading) {
    return <div>Loading your profile...</div>;
  }

  if (!user) {
    return <LoadingMessage>Loading your profile...</LoadingMessage>;
  }

  if (transactions.length === 0) {
    return (
      <Container>
        <Heading>Welcome, {user.username}</Heading>
        <p>You don't have any transactions yet. Start by adding your first one!</p>
        <p>Your current budget summary:</p>
        <BudgetSummary
          budget={{ total: budget.total, remaining: budget.remaining }}
          income={totalIncome}
          userId={user._id}
          token={localStorage.getItem('token')} 
          onBudgetUpdate={handleBudgetUpdate}
        />
        <ExpenseForm
          userId={user._id}
          token={localStorage.getItem('token')} 
          onAddTransaction={handleAddTransaction}
          totalBudget={budget.total}
        />
      </Container>
    );
  }

  const recentTransactions = transactions.slice(0, 3);
  const totalBudget = budget.total;

  if (totalBudget === undefined || isNaN(totalBudget)) {
    return <ErrorMessage>Total Budget is missing or invalid.</ErrorMessage>;
  }

  const adjustedRemainingBudget = remainingBudget < 0 ? 0 : remainingBudget;

  return (
    <Container>
      <Heading>Welcome, {user.username}</Heading>

      <p>Your budget summary:</p>
      {isEditingBudget ? (
        <div>
          <input
            type="number"
            value={budget.total || ''}
            onChange={(e) => setBudget({ ...budget, total: Number(e.target.value) })}
            placeholder="Total Budget"
          />
          <button onClick={() => { handleBudgetUpdate(budget); handleToggleBudgetEdit(); }}>Save Budget</button>
        </div>
      ) : (
        <div>
          <BudgetSummary
            budget={{ total: totalBudget, remaining: adjustedRemainingBudget }}
            income={totalIncome}
            userId={user._id}
            token={localStorage.getItem('token')} 
            onBudgetUpdate={handleBudgetUpdate}
            transactions={transactions}
          />
        </div>
      )}

      <Section>
        <Subheading>Add New Transaction</Subheading>
        <ExpenseForm userId={user._id} token={localStorage.getItem('token')} onAddTransaction={handleAddTransaction} totalBudget={totalBudget} />
      </Section>

      <Section>
        <Subheading>Your Expense Overview</Subheading>
        {totalBudget && !isNaN(totalBudget) ? (
          <Chart
            transactions={transactions}
            totalBudget={totalBudget}
            onColorMappingChange={handleColorMappingChange}
          />
        ) : (
          <LoadingMessage>Loading your budget...</LoadingMessage>
        )}
      </Section>

      {recentTransactions.length > 0 && (
        <Section>
          <Subheading>Your Recent Transactions</Subheading>
          <TransactionList
            transactions={recentTransactions}
            refreshTransactions={refreshTransactions}
            token={localStorage.getItem('token')} 
            subcategoryColors={colorMapping}
          />
        </Section>
      )}

      <div>
        <ButtonContainer>
          <Button onClick={() => navigate('/profile')}>Go to Profile</Button>
          <Button onClick={() => navigate('/transaction-history')}>View Transaction History</Button>
        </ButtonContainer>
      </div>
    </Container>
  );
};




export default Home;




