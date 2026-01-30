import axios from 'axios';
import { Alert } from 'react-native';
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
                // Testing both formats based on user requirements
                config.headers.Authorization = token;
                config.headers.token = token;
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
        const errorDetails = {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data,
            code: error.code, // e.g. ECONNABORTED
        };

        console.error('API Error Details:', JSON.stringify(errorDetails, null, 2));

        // Handle specific error codes
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || `Error ${status}`;

            switch (status) {
                case 401:
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
                    console.log('API Error:', message);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.log('Network error - No response received from server');

            // Show alert in release mode for easier debugging of network issues
            if (!__DEV__) {
                Alert.alert(
                    'Network Error',
                    `Unable to connect to server. Please check your internet connection or try again later.\n\nURL: ${error.config?.url}\nError: ${error.message}`,
                    [{ text: 'OK' }]
                );
            }
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Request Setup Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
