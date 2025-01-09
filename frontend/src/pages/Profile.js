import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import apiService from '../services/api';
import styled from 'styled-components';

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

const SaveButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
  }
`;

const CancelButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #c82333;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
  }
`;

const DeleteButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #c82333;
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
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const fetchUserProfile = async () => {
        try {
          const profile = await authService.getProfile(token);
          setUser(profile);
          setNewEmail(profile.email);
          const fetchedTransactions = await apiService.getTransactions(token);
          setTransactions(fetchedTransactions);
        } catch (err) {
          setError('Failed to fetch profile');
        }
      };
      fetchUserProfile();
    }
  }, [navigate, token]);

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await authService.deleteAccount(user._id, token);
        alert(response.message);
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        alert('Failed to delete account. Please try again.');
        console.error(err);
      }
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveEmail = async () => {
    try {
      await authService.updateEmail(user._id, newEmail, token);
      setUser({ ...user, email: newEmail });
      setEditMode(false);
      alert('Email updated successfully');
    } catch (err) {
      alert('Failed to update email. Please try again.');
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewEmail(user.email);
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalExpenses = transactions
    .filter(transaction => transaction.category === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const remainingBudget = user.budget.total - totalExpenses;

  return (
    <Container>
      <Heading>{user.username}'s Profile</Heading>
      <Info>
        <p>
          <strong>Email:</strong> {editMode ? (
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          ) : (
            user.email
          )}
        </p>
        <p><strong>Budget:</strong> ${user.budget.total}</p>
        <p><strong>Remaining Budget:</strong> ${remainingBudget}</p>
      </Info>
      {editMode ? (
        <>
          <SaveButton onClick={handleSaveEmail}>Save</SaveButton>
          <CancelButton onClick={handleCancelEdit}>Cancel</CancelButton>
        </>
      ) : (
        <>
          <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
          <DeleteButton onClick={handleDeleteAccount}>Delete Account</DeleteButton>
        </>
      )}
    </Container>
  );
};

export default Profile;
