import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the form
const FormContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 10px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  width: 100%;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;


const ExpenseForm = ({ onAddTransaction, totalBudget }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('expense');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
    
    setMinDate(firstDay);
    setMaxDate(lastDay);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && subcategory && date) {
      const transaction = {
        amount: parseFloat(amount),
        category,
        subcategory,
        description,
        date,
      };
      onAddTransaction(transaction);
      setAmount('');
      setCategory('expense');
      setSubcategory('');
      setDescription('');
      setDate('');
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Select>
        <Input
          type="text"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          placeholder="Subcategory"
          required
        />
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <Input
          type="date"
          value={date}
          min={minDate}
          max={maxDate}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button type="submit" disabled={totalBudget <= 0}>Add Transaction</Button>
      </form>
    </FormContainer>
  );
};

export default ExpenseForm;
