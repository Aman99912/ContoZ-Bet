import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [wallets, setWallets] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Load user data and token from storage on app start
    useEffect(() => {
        loadUserData();
    }, []);

    const refreshWallets = async () => {
        if (!token) return;
        try {
            // Using a direct import of api here if needed, or ensuring it's available
            const api = require('@/api').default;
            const res = await api.get('/user/get_wallets');
            if (res && res.wallets) {
                setWallets(res.wallets);
                const mainWallet = res.wallets.find(w => w.slug === 'main_wallet')?.value || 0;
                const fundWallet = res.wallets.find(w => w.slug === 'fund_wallet')?.value || 0;
                const incomeWallet = res.wallets.find(w => w.slug === 'level_income')?.value || 0;

                const total = res.totalIncome || (mainWallet + fundWallet + incomeWallet);
                setTotalBalance(total);
            }
        } catch (error) {
            console.error('Error refreshing wallets in AppContext:', error);
        }
    };

    useEffect(() => {
        if (token) {
            refreshWallets();
        }
    }, [token]);

    const loadUserData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            const storedUser = await AsyncStorage.getItem('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (authToken, userData) => {
        try {
            await AsyncStorage.setItem('authToken', authToken);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            setToken(authToken);
            setUser(userData);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const updateUser = async (updatedData) => {
        try {
            const newUserData = { ...user, ...updatedData };
            await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
            setUser(newUserData);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const updateVerificationStatus = async (isVerified) => {
        try {
            const updatedUser = { ...user, isverified: isVerified ? 1 : 0 };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            console.error('Error updating verification status:', error);
        }
    };

    const value = {
        user,
        token,
        wallets,
        totalBalance,
        isLoading,
        isLoggedIn: !!token,
        login,
        logout,
        updateUser,
        updateVerificationStatus,
        refreshWallets,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export default AppContext;
