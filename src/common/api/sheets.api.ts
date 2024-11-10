import axios from 'axios';

export const sheetsApi = axios.create({
  baseURL: process.env.SHEETS_API,
  headers: {
    'Content-Type': 'application/json',
  },
});
