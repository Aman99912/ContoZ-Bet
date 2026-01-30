import api from './index';

/**
 * Example API Service
 * Demonstrates how to use the base api instance
 */

// Auth APIs
export const authAPI = {
    /**
     * Login User
     * Response:
     * {
     *     "message": "Login successful.",
     *     "status": 200,
     *     "token": "eyJhbGci...",
     *     "user": { ... }
     * }
     */
    login: (credentials) => api.post('/user/login', credentials),
    register: (userData) => api.post('/user/register', userData),
    logout: () => api.post('/auth/logout'),
};

// User APIs
export const userAPI = {
    /**
     * Get User Profile
     * Endpoint: /user/get_profile
     * Header: token
     * Response:
     * {
     *     "uid": 11,
     *     "username": "CZ788751",
     *     "name": "dmeo12121111",
     *     "email": "deta@gmail.com",
     *     "mobile": "+915677868364",
     *     "status": 0,
     *     "isverified": 1,
     *     "sponsor_username": null,
     *     "sponsor_name": null,
     *     "joining_date": "2026-01-29T17:17:40.842Z",
     *     "Activation_date": null
     * }
     */
    getProfile: () => api.get('/user/get_profile'),

    updateProfile: (data) => api.put('/user/profile', data),

    /**
     * Add Bank Details
     * Endpoint: /user/add-bank-details
     * Payload:
     * {
     *     "bankName": "data",
     *     "accountNumber": 55645645,
     *     "ifsc": "GJFFH6565A",
     *     "holder": "TEST",
     *     "ac_type": "saving", // saving, current, salary
     *     "branch": "SBI423"
     * }
     */
    addBankDetails: (data) => api.post('/user/add-bank-details', data),

    createRechargeOrder: (data) => api.post('/user/recharge-create-order', data),
    verifyRechargePayment: (data) => api.post('/user/recharge-verify-payment', data),

    getUserPaymentDetails: () => api.get('/user/get-user-payment-details'),

    getProjectConfig: () => api.get('/user/project-config'),

    transferMainToFund: (data) => api.post('/user/main-to-fund-transfer', data),

    getWallets: () => api.get('/user/get_wallets'),
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
