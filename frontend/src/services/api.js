import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

// Get all transactions for a user
const getTransactions = async (token) => {
  console.log(token);
  if (!token) {
    console.error("No token provided");
    throw new Error("Token is required to fetch transactions");
  }

  try {
    const response = await axios.get(`${API_URL}/transactions/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check for a successful response and log the fetched data
    if (response.status === 200) {
      console.log("Transactions fetched successfully:", response.data);
      
      // Ensure the response data is an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error("Unexpected data format:", response.data);
        throw new Error("Failed to fetch transactions: Unexpected data format");
      }
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      throw new Error("Failed to fetch transactions: Invalid status");
    }
  } catch (error) {
    // Log detailed error information
    console.error("Error fetching transactions:", error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error for further handling in the calling component
  }
};


// Add a new transaction
const addTransaction = async (transactionData, token) => {
  console.log('Transaction data:', transactionData); // Log the transaction data before sending the request
  try {
    const response = await axios.post(`${API_URL}/transactions/`, transactionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the data if the request is successful
  } catch (error) {
    // Log the error response
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
    throw error; // Re-throw the error to allow further handling upstream
  }
};




// Update a transaction
const updateTransaction = async (transactionId, transactionData, token) => {
  try {
    console.log('Updating transaction with token:', token); // Log the token being sent

    const response = await axios.put(`${API_URL}/transactions/${transactionId}`, transactionData, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure token is passed here
      },
    });

    console.log('Transaction updated successfully:', response.data); // Log the response

    return response.data;  // Return the updated transaction data
  } catch (error) {
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};





// Delete a transaction
const deleteTransaction = async (transactionId, token) => {
  const response = await axios.delete(`${API_URL}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get transactions by subcategory for a user
const getTransactionsBySubcategory = async (subcategory, token) => {
  if (!token) {
    throw new Error("Token is required to fetch transactions");
  }

  try {
    const response = await axios.get(`${API_URL}/transactions/subcategory/${subcategory}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch transactions: Invalid status");
    }
  } catch (error) {
    throw error;
  }
};

// Assign the object to a variable and export
const apiService = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsBySubcategory,
};

export default apiService;
