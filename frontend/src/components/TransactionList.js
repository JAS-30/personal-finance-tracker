import React, { useState } from 'react';
import styled from 'styled-components';
import apiService from '../services/api'; 


const Container = styled.div`
  padding: 20px; /* Increased padding */
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
/* Add a max width to prevent stretching on large screens */
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const TransactionItem = styled.li`
  padding: 12px 20px; /* Increased padding for better spacing */
  margin-bottom: 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  list-style-type: none;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%; /* Full width */

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

const ColorBanner = styled.div`
  width: 12px; /* Increased the banner width */
  height: 100%;
  background-color: ${(props) => props.color};
  position: absolute;
  top: 0;
  left: 0;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const Header = styled.h3`
  font-size: 22px; /* Increased font size */
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Text = styled.p`
  font-size: 16px; /* Increased text size for better readability */
  margin: 6px 0;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const NoTransactionsMessage = styled.p`
  font-size: 18px;
  color: #666;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Button = styled.button`
  padding: 8px 16px; /* Increased button size */
  margin-top: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  width: auto;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const MobileFormInputs = styled.input`
  font-size: 16px;
  padding: 8px;
  margin-bottom: 8px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const MobileSelect = styled.select`
  font-size: 16px;
  padding: 8px;
  margin-bottom: 8px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const TransactionList = ({ transactions, token, refreshTransactions, subcategoryColors }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});

  if (!transactions || transactions.length === 0) {
    return <NoTransactionsMessage>No transactions to display.</NoTransactionsMessage>;
  }

  const handleEditClick = (transaction) => {
    setIsEditing(transaction._id);
    setEditedTransaction(transaction);
  };

  const handleDeleteClick = async (transactionId) => {
    try {
      await apiService.deleteTransaction(transactionId, token);
      alert('Transaction deleted successfully');
      refreshTransactions(); // Refresh the transaction list
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const handleSaveEdit = async () => {
    try {
      await apiService.updateTransaction(editedTransaction._id, editedTransaction, token);
      alert('Transaction updated successfully');
      setIsEditing(null);
      refreshTransactions(); 
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedTransaction({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({
      ...editedTransaction,
      [name]: value,
    });
  };

  const getCategoryColor = (category, subcategory) => {
    // If the category is income, assign a different color
    if (category === 'income') {
      return '#9C27B0 '; // Purple color for income
    }

    // Otherwise, use subcategory color logic for expenses
    return subcategoryColors?.[subcategory] || '#E0E0E0'; // Default to gray if no color is found
  };

  return (
    <Container>
      <Header>Recent Transactions</Header>
      <ul>
        {transactions.map((transaction) => {
          // Get the color based on category and subcategory
          const categoryColor = getCategoryColor(transaction.category, transaction.subcategory);

          return (
            <TransactionItem key={transaction._id}>
              <ColorBanner color={categoryColor} />
              {isEditing === transaction._id ? (
                <>
                  <Text>
                    <strong>Amount:</strong>
                    <MobileFormInputs
                      type="number"
                      name="amount"
                      value={editedTransaction.amount}
                      onChange={handleChange}
                    />
                  </Text>
                  <Text>
                    <strong>Category:</strong>
                    <MobileSelect
                      name="category"
                      value={editedTransaction.category || 'expense'}
                      onChange={handleChange}
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </MobileSelect>
                  </Text>
                  <Text>
                    <strong>Subcategory:</strong>
                    <MobileFormInputs
                      type="text"
                      name="subcategory"
                      value={editedTransaction.subcategory || ''}
                      onChange={handleChange}
                    />
                  </Text>
                  <Text>
                    <strong>Description:</strong>
                    <MobileFormInputs
                      type="text"
                      name="description"
                      value={editedTransaction.description}
                      onChange={handleChange}
                    />
                  </Text>
                  <Button onClick={handleSaveEdit}>Save</Button>
                  <Button onClick={handleCancelEdit}>Cancel</Button>
                </>
              ) : (
                <>
                  <Text><strong>Amount:</strong> ${transaction.amount}</Text>
                  <Text><strong>Category:</strong> {transaction.category}</Text>
                  <Text><strong>Subcategory:</strong> {transaction.subcategory || 'N/A'}</Text>
                  <Text><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</Text>
                  <Text><strong>Description:</strong> {transaction.description}</Text>
                  <Button onClick={() => handleEditClick(transaction)}>Edit</Button>
                  <DeleteButton onClick={() => handleDeleteClick(transaction._id)}>Delete</DeleteButton>
                </>
              )}
            </TransactionItem>
          );
        })}
      </ul>
    </Container>
  );
};

export default TransactionList;
