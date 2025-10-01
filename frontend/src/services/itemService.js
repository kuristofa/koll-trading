import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const itemService = {
  // Get all items
  getAllItems: async () => {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch items');
    }
  },

  // Get single item by ID
  getItemById: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch item');
    }
  },

  // Create new item
  createItem: async (itemData) => {
    try {
      const response = await api.post('/items', itemData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create item');
    }
  },

  // Update existing item
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update item');
    }
  },

  // Delete item
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete item');
    }
  },
};

export default itemService;
