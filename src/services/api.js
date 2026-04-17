import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://psxadmin.techmiresolutions.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchStocks = () => api.get('/stocks/');
export const fetchRecommendations = () => api.get('/recommendations/');
export const fetchStockHistory = (symbol) => api.get(`/stocks/${symbol}/history/`);

export default api;
