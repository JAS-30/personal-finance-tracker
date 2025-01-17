import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 

// Helper function for handling errors
const handleError = (error) => {
  if (error.response) {
    // Server responded with a status code outside 2xx range
    return error.response.data.message || 'An error occurred. Please try again.';
  } else if (error.request) {

    return 'No response from the server. Please check your network.';
  } else {
    return 'An error occurred. Please try again.';
  }
};

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',  
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get user profile
const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Update user budget
const updateBudget = async (userId, budget, token) => {
  console.log("Token in updateBudget:", token);  
  try {
    const response = await axios.put(
      `${API_URL}/budget/${userId}`,
      budget,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
// Update user email
const updateEmail = async (userId, email, token) => {
  try {
    const response = await axios.put(`${API_URL}/email/${userId}`, 
      { newEmail: email }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Delete user account
const deleteAccount = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-account/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Reset user data (reset budget and delete transactions)
const resetUserData = async (userId, token) => {
  try {
    const response = await axios.put(`${API_URL}/reset-data/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};


// Assign the object to a variable and export
const authService = {
  register,
  login,
  getProfile,
  updateBudget,
  deleteAccount,
  resetUserData,
  updateEmail 
};

export default authService;
