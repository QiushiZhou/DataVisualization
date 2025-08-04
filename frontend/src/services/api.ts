import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Data Entry API
export const getDataEntries = async () => {
  try {
    const response = await api.get('/data-entries/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data entries:', error);
    return [];
  }
};

export const createDataEntry = async (data: { date: string; type: string; value: number }) => {
  try {
    const response = await api.post('/data-entries/', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create data entry:', error);
    throw error;
  }
};

export const updateDataEntry = async (id: number, data: { date: string; type: string; value: number }) => {
  try {
    const response = await api.put(`/data-entries/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update data entry:', error);
    throw error;
  }
};

export const deleteDataEntry = async (id: number) => {
  try {
    const response = await api.delete(`/data-entries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete data entry:', error);
    throw error;
  }
};

// Data Type API
export const getDataTypes = async () => {
  try {
    const response = await api.get('/data-types/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data types:', error);
    return [];
  }
};

export const createDataType = async (data: { name: string }) => {
  try {
    const response = await api.post('/data-types/', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create data type:', error);
    throw error;
  }
};

export const updateDataType = async (id: number, data: { name: string }) => {
  try {
    const response = await api.put(`/data-types/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update data type:', error);
    throw error;
  }
};

export const deleteDataType = async (id: number) => {
  try {
    const response = await api.delete(`/data-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete data type:', error);
    throw error;
  }
}; 