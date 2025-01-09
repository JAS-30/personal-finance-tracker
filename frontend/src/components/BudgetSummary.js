import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import authService from '../services/auth';
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Styled components for BudgetSummary
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 15px;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
    margin-top: 20px;
  }
`;

const Heading = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;

  @media (max-width: 768px) {
    padding-left: 10px;
  }
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  padding: 5px;
  font-size: 16px;
  width: 120px;

  @media (max-width: 768px) {
    width: 100px;
    font-size: 14px;
  }
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

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center;     /* Center vertically */

  @media (max-width: 768px) {
    height: 250px;  /* Adjusted height for medium screens */
  }

  @media (max-width: 480px) {
    height: 200px;  /* Even smaller height for very small screens */
  }
`;



const BudgetSummary = ({ budget, userId, token, onBudgetUpdate, income, transactions = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState({
    total: budget.total,
    remaining: budget.remaining,
  });

  const expenses = transactions.reduce((acc, transaction) => {
    if (transaction.category === 'expense') {
      acc += transaction.amount; // Sum the amount of all expense transactions
    }
    return acc;
  }, 0);

  useEffect(() => {
    setEditedBudget({
      total: budget.total,
      remaining: budget.remaining || budget.total, // Ensure remaining budget equals total if not defined
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
      remaining: budget.remaining || budget.total,
    });
    setIsEditing(false);
  };

  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '5px' }}>
          <strong>{label}:</strong> ${payload[0].value.toFixed(2)}
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
      <LeftColumn>
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
              `$${(editedBudget.total || 0).toFixed(2)}`
            )}
          </ListItem>
          <ListItem>
            <strong>Remaining Budget:</strong>{' '}
            ${(editedBudget.total - expenses || 0).toFixed(2)} {/* Subtract expenses from the total */}
          </ListItem>
          <ListItem>
            <strong>Extra Incomes:</strong>{' '}
            {`$${(income || 0).toFixed(2)}`}
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
      </LeftColumn>

      <RightColumn>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Budget', value: editedBudget.total || 0, color: '#4CAF50' },
                { name: 'Expenses', value: expenses, color: '#FF6347' },
                { name: 'Extra Incomes', value: income || 0, color: '#FFD700' },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                payload={[
                  { value: 'Budget', type: 'square', color: '#4CAF50' },
                  { value: 'Expenses', type: 'square', color: '#FF6347' },
                  { value: 'Extra Incomes', type: 'square', color: '#FFD700' },
                ]}
              />
              <Bar dataKey="value" name="Categories">
                {[
                  { name: 'Budget', value: editedBudget.total || 0, color: '#4CAF50' },
                  { name: 'Expenses', value: expenses, color: '#FF6347' },
                  { name: 'Extra Incomes', value: income || 0, color: '#FFD700' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </RightColumn>
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
  income: PropTypes.number.isRequired,
};

export default BudgetSummary;
