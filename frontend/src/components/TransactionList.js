import React from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TransactionItem = styled.li`
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  list-style-type: none;
`;

const Header = styled.h3`
  font-size: 24px;
  color: #333;
`;

const Text = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

const NoTransactionsMessage = styled.p`
  font-size: 18px;
  color: #666;
  font-style: italic;
`;

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <NoTransactionsMessage>No transactions to display.</NoTransactionsMessage>;
  }

  return (
    <Container>
      <Header>Recent Transactions</Header>
      <ul>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction._id}>
            <Text><strong>Amount:</strong> ${transaction.amount}</Text>
            <Text><strong>Category:</strong> {transaction.category}</Text>
            <Text><strong>Subcategory:</strong> {transaction.subcategory}</Text>
            <Text><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</Text>
            <Text><strong>Description:</strong> {transaction.description}</Text>
          </TransactionItem>
        ))}
      </ul>
    </Container>
  );
};

export default TransactionList;
