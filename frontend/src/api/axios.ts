import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('demotrade_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
