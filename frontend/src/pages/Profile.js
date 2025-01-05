import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api'; // Import the api service for fetching transactions
import styled from 'styled-components';

// Styled components for Profile page
const Container = styled.div`
  max-width: 600px;
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

const Info = styled.div`
  font-size: 18px;
  color: #555;
  margin-bottom: 15px;

  p {
    margin: 8px 0;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const EditButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Only get token from localStorage

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token found
    } else {
      const fetchUserProfile = async () => {
        try {
          const profile = await authService.getProfile(token); // Only pass token to get profile
          setUser(profile);

          // Fetch transactions after profile is fetched
          const fetchedTransactions = await apiService.getTransactions(token);
          setTransactions(fetchedTransactions);
        } catch (err) {
          setError('Failed to fetch profile');
        }
      };
      fetchUserProfile();
    }
  }, [navigate, token]); // Effect will run on token change

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!user || transactions.length === 0) {
    return <div>Loading...</div>; // You can replace this with a loading spinner if you prefer
  }

  // Calculate the remaining budget by subtracting total expenses from the total budget
  const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const remainingBudget = user.budget.total - totalExpenses;

  return (
    <Container>
      <Heading>{user.username}'s Profile</Heading>
      <Info>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Budget:</strong> ${user.budget.total}</p>
        <p><strong>Remaining Budget:</strong> ${remainingBudget}</p> {/* Display the calculated remaining budget */}
      </Info>
      <EditButton>Edit Profile</EditButton>
    </Container>
  );
};

export default Profile;
