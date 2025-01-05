import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

// Styled components for the chart
const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #555;
  font-family: 'Arial', sans-serif;
`;

const Chart = ({ transactions, totalBudget }) => {
  console.log("Transactions in Chart:", transactions); // Debug log
  console.log("Total Budget:", totalBudget); // Debug log to check totalBudget

  // Check if totalBudget is available
  if (totalBudget === undefined || totalBudget === null || isNaN(totalBudget)) {
    return (
      <Container>
        <Message>Error: Total Budget is missing or invalid.</Message>
      </Container>
    );
  }

  // Check if transactions exist
  if (!transactions || transactions.length === 0) {
    return (
      <Container>
        <Message>No transactions available. Add some expenses to see the chart.</Message>
      </Container>
    );
  }

  // Group the expenses by subcategory
  const expenseData = transactions
    .filter(transaction => transaction.category === 'expense') // Filter out non-expense transactions
    .reduce((acc, curr) => {
      if (curr.subcategory) {  // Ensure subcategory exists
        acc[curr.subcategory] = (acc[curr.subcategory] || 0) + curr.amount;
      }
      return acc;
    }, {});

  console.log("Grouped Expense Data:", expenseData); // Debug log to see the grouped data

  // Sum all expenses
  const totalExpenses = Object.values(expenseData).reduce((acc, amount) => acc + amount, 0);
  console.log("Total Expenses:", totalExpenses); // Debug log to see the sum of expenses

  // Calculate remaining budget
  const remainingBudget = totalBudget - totalExpenses;
  console.log("Remaining Budget:", remainingBudget); // Debug log to check remaining budget

  // Prepare data for Recharts
  const data = [
    ...Object.keys(expenseData).map((subcategory) => ({
      name: subcategory,
      value: expenseData[subcategory],
    })),
    {
      name: 'Remaining Budget',
      value: remainingBudget,
    },
  ];

  // Define the colors for each slice (using a light gray for remaining budget)
  const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800',
    '#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300', '#E0E0E0'  // Grayish color for remaining budget
  ];

  return (
    <Container>
      {Object.keys(expenseData).length > 0 ? (
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#E0E0E0' : COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <Message>No transactions available. Add some expenses to see the chart.</Message>
      )}
    </Container>
  );
};


export default Chart;
