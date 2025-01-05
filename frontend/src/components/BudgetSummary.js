import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import authService from '../services/auth';

// Styled components for BudgetSummary
const Container = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 20px;
`;

const Heading = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 5px;
  font-size: 16px;
  width: 100px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ $cancel }) => ($cancel ? '#ccc' : '#007bff')};
  color: ${({ $cancel }) => ($cancel ? '#333' : '#fff')};
  margin-right: 10px;

  &:hover {
    background-color: ${({ $cancel }) => ($cancel ? '#bbb' : '#0056b3')};
  }
`;

const BudgetSummary = ({ budget, userId, token, onBudgetUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState({
    total: budget.total,
    remaining: budget.remaining,
  });

  // Update local state when the budget prop changes
  useEffect(() => {
    setEditedBudget({
      total: budget.total,
      remaining: budget.remaining,
    });
  }, [budget]);

  const handleInputChange = (field, value) => {
    setEditedBudget({ ...editedBudget, [field]: Number(value) });
  };

  const handleSave = async () => {
    try {
      const updatedBudget = await authService.updateBudget(userId, editedBudget, token);
      onBudgetUpdate(updatedBudget); // Notify parent of the changes
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update budget. Please try again.');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditedBudget({
      total: budget.total,
      remaining: budget.remaining,
    });
    setIsEditing(false);
  };

  return (
    <Container>
      <Heading>Budget Overview</Heading>
      <List>
        <ListItem>
          <strong>Total Budget:</strong>{' '}
          {isEditing ? (
            <Input
              type="number"
              value={editedBudget.total}
              onChange={(e) => handleInputChange('total', e.target.value)}
            />
          ) : (
            `$${editedBudget.total.toFixed(2)}`
          )}
        </ListItem>
        <ListItem>
          <strong>Remaining Budget:</strong>{' '}
          {isEditing ? (
            <Input
              type="number"
              value={editedBudget.remaining}
              onChange={(e) => handleInputChange('remaining', e.target.value)}
            />
          ) : (
            `$${editedBudget.remaining.toFixed(2)}`
          )}
        </ListItem>
      </List>
      {isEditing ? (
        <>
          <Button onClick={handleSave}>Save</Button>
          <Button $cancel onClick={handleCancel}>Cancel</Button>
        </>
      ) : (
        <Button onClick={() => setIsEditing(true)}>Edit</Button>
      )}
    </Container>
  );
};

BudgetSummary.propTypes = {
  budget: PropTypes.shape({
    total: PropTypes.number.isRequired,
    remaining: PropTypes.number.isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  onBudgetUpdate: PropTypes.func.isRequired,
};

export default BudgetSummary;
