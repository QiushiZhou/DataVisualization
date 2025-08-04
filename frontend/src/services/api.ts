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
  const response = await api.get('/data-entries/');
  return response.data;
};

export const createDataEntry = async (data: { date: string; type: string; value: number }) => {
  const response = await api.post('/data-entries/', data);
  return response.data;
};

export const updateDataEntry = async (id: number, data: { date: string; type: string; value: number }) => {
  const response = await api.put(`/data-entries/${id}`, data);
  return response.data;
};

export const deleteDataEntry = async (id: number) => {
  const response = await api.delete(`/data-entries/${id}`);
  return response.data;
};

// Data Type API
export const getDataTypes = async () => {
  const response = await api.get('/data-types/');
  return response.data;
};

export const createDataType = async (data: { name: string }) => {
  const response = await api.post('/data-types/', data);
  return response.data;
};

export const updateDataType = async (id: number, data: { name: string }) => {
  const response = await api.put(`/data-types/${id}`, data);
  return response.data;
};

export const deleteDataType = async (id: number) => {
  const response = await api.delete(`/data-types/${id}`);
  return response.data;
};