import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';

/**
 * Axios instance with base configuration
 */
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor
 * Add auth token or modify request before sending
 */
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error fetching token from storage:', error);
        }

        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handle responses and errors globally
 */
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response.data;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url);

        // Handle specific error codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized - redirect to login
                    console.log('Unauthorized - Please login');
                    break;
                case 403:
                    console.log('Forbidden - Access denied');
                    break;
                case 404:
                    console.log('Not found');
                    break;
                case 500:
                    console.log('Server error');
                    break;
                default:
                    console.log('Error:', error.response.data?.message || 'Something went wrong');
            }
        } else if (error.request) {
            console.log('Network error - No response received');
        }

        return Promise.reject(error);
    }
);

export default api;
