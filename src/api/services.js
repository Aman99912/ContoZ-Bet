import api from './index';

/**
 * Example API Service
 * Demonstrates how to use the base api instance
 */

// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/user/login', credentials),
    register: (userData) => api.post('/user/register', userData),
    logout: () => api.post('/auth/logout'),
};

// User APIs
export const userAPI = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
};

// Wallet APIs
export const walletAPI = {
    getBalance: () => api.get('/wallet/balance'),
    addMoney: (amount) => api.post('/wallet/add', { amount }),
    withdraw: (data) => api.post('/wallet/withdraw', data),
    getTransactions: (page = 1, limit = 10) =>
        api.get(`/wallet/transactions?page=${page}&limit=${limit}`),
};

// Game APIs
export const gameAPI = {
    getGames: () => api.get('/games'),
    getGameDetails: (gameId) => api.get(`/games/${gameId}`),
    joinGame: (gameId) => api.post(`/games/${gameId}/join`),
};

/**
 * Example Usage:
 * 
 * import { authAPI, walletAPI } from '@/api/services';
 * 
 * // Login
 * const handleLogin = async () => {
 *     try {
 *         const response = await authAPI.login({ email, password });
 *         console.log('Login success:', response);
 *     } catch (error) {
 *         console.error('Login failed:', error);
 *     }
 * };
 * 
 * // Get wallet balance
 * const getBalance = async () => {
 *     try {
 *         const balance = await walletAPI.getBalance();
 *         console.log('Balance:', balance);
 *     } catch (error) {
 *         console.error('Error:', error);
 *     }
 * };
 */
