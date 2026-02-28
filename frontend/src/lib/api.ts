import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api', // Note: Make sure backend runs on 3001 or update this
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token if we had real auth
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
