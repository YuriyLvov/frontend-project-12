import axios from 'axios';

const API_PATH = '/api/v1';

export const login = ({ username, password }) => axios.post(`${API_PATH}/login`, { username, password });

export const signup = ({ username, password }) => axios.post(`${API_PATH}/signup`, { username, password });

export const getData = ({ token }) => axios.get(`${API_PATH}/data`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
