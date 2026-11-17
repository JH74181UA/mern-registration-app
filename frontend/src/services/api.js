import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

/**
 * Register a new user
 * @param {Object} userData - Registration payload
 * @returns {Promise} Axios response
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.request) {
      throw {
        success: false,
        message: 'Cannot reach backend server. Please verify Express is running on port 5000.'
      };
    } else {
      throw {
        success: false,
        message: error.message || 'An unexpected error occurred.'
      };
    }
  }
};

/**
 * Login user
 * @param {Object} credentials - { identifier, password }
 * @returns {Promise} Axios response
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.request) {
      throw {
        success: false,
        message: 'Cannot reach backend server. Please verify Express is running on port 5000.'
      };
    } else {
      throw {
        success: false,
        message: error.message || 'An unexpected error occurred.'
      };
    }
  }
};

/**
 * Fetch all registered users
 * @returns {Promise}
 */
export const getRegisteredUsers = async () => {
  try {
    const response = await apiClient.get('/auth/users');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: 'Failed to fetch registered users list.'
    };
  }
};

export default apiClient;
