import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

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

const Chart = ({ transactions, totalBudget, onColorMappingChange }) => {
  const [expenseData, setExpenseData] = useState({});
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    if (transactions && totalBudget) {
      const data = transactions
        .filter(transaction => transaction.category === 'expense')
        .reduce((acc, curr) => {
          if (curr.subcategory) {
            acc[curr.subcategory] = (acc[curr.subcategory] || 0) + curr.amount;
          }
          return acc;
        }, {});

      setExpenseData(data);

      const totalExpenses = Object.values(data).reduce((sum, value) => sum + value, 0);
      setRemainingBudget(totalBudget - totalExpenses);
    }
  }, [transactions, totalBudget]);

  const data = useMemo(() => {
    if (!expenseData || Object.keys(expenseData).length === 0) return [];
    
    return [
      ...Object.keys(expenseData).map(subcategory => ({
        name: subcategory,
        value: expenseData[subcategory],
      })),
      {
        name: 'Remaining Budget',
        value: remainingBudget < 0 ? 0 : remainingBudget,
      },
    ];
  }, [expenseData, remainingBudget]);

  const subcategoryColors = useMemo(() => {
    const COLORS = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800',
      '#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300'
    ];

    const colors = {};
    data.forEach((entry, index) => {
      if (entry.name !== 'Remaining Budget') {
        colors[entry.name] = COLORS[index % COLORS.length];
      }
    });

    return colors;
  }, [data]);

  const memoizedOnColorMappingChange = useCallback(() => {
    onColorMappingChange(subcategoryColors);
  }, [onColorMappingChange, subcategoryColors]);

  useEffect(() => {
    memoizedOnColorMappingChange();
  }, [memoizedOnColorMappingChange]);

  if (!totalBudget || !transactions || transactions.length === 0) {
    return (
      <Container>
        <Message>{!totalBudget ? "Error: Total Budget is missing or invalid." : "No transactions available. Add some expenses to see the chart."}</Message>
      </Container>
    );
  }

  return (
    <Container>
      <PieChart
        width={300}
        height={300}
        style={{ maxWidth: '100%', height: 'auto' }} // Make chart responsive
      >
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
            <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#E0E0E0' : subcategoryColors[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Container>
  );
};

export default Chart;
