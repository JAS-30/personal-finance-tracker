import React, { useState } from 'react';
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
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ExpenseForm = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('expense');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

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
      console.log('Transaction payload:', transaction); // Log payload
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
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button type="submit">Add Transaction</Button>
      </form>
    </FormContainer>
  );
};

export default ExpenseForm;
