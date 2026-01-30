import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [wallets, setWallets] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [savedBanks, setSavedBanks] = useState([]);
    const [savedUPIs, setSavedUPIs] = useState([]);
    const [config, setConfig] = useState(null);

    // Load user data and token from storage on app start
    useEffect(() => {
        loadUserData();
        loadSavedMethods();
    }, []);

    const refreshConfig = async () => {
        if (!token) return;
        try {
            const api = require('@/api').default;
            const res = await api.get('/user/project-config');
            if (res) {
                setConfig(res);
            }
        } catch (error) {
            console.error('Error refreshing project config:', error);
        }
    };

    const refreshWallets = async () => {
        if (!token) return;
        try {
            // Using a direct import of api here if needed, or ensuring it's available
            const api = require('@/api').default;
            const res = await api.get('/user/get_wallets');
            if (res && res.wallets) {
                setWallets(res.wallets);

                // MAPPING BASED ON USER REQUIREMENT:
                // Fund_wallet (id: 2) -> Deposit Balance (cashBalance)
                // Main_wallet (id: 1) -> Winning Amount / Withdrawal (earningsBalance)

                const mainWallet = res.wallets.find(w => w.slug === 'main_wallet')?.value || 0; // Winnings
                const fundWallet = res.wallets.find(w => w.slug === 'fund_wallet')?.value || 0; // Deposit
                // const incomeWallet = res.wallets.find(w => w.slug === 'level_income')?.value || 0; 

                // For Total Balance display if needed, we can sum them or just expose them
                // We'll store the total valid balance
                const total = mainWallet + fundWallet;
                setTotalBalance(total);
            }
        } catch (error) {
            console.error('Error refreshing wallets in AppContext:', error);
        }
    };

    useEffect(() => {
        if (token) {
            refreshWallets();
            refreshPaymentDetails();
            refreshConfig();
        }
    }, [token]);

    const refreshPaymentDetails = async () => {
        if (!token) return;
        try {
            const api = require('@/api').default;
            const res = await api.get('/user/get-user-payment-details');

            if (res && res.success && Array.isArray(res.data)) {
                const banks = [];
                const upis = [];

                res.data.forEach(item => {
                    if (item.bank) {
                        // Normalize bank data to match UI expectations
                        banks.push({
                            ...item.bank,
                            holderName: item.bank.holder, // Map holder -> holderName
                            ifscCode: item.bank.ifsc,     // Map ifsc -> ifscCode if needed (UI uses ifscCode in card?)
                            // existing fields: bankName, accountNumber, branch, ac_type
                        });
                    }
                    if (item.upi) {
                        upis.push(item.upi);
                    }
                });

                setSavedBanks(banks);
                setSavedUPIs(upis);
            }
        } catch (error) {
            console.error('Error refreshing payment details:', error);
        }
    };

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

    const loadSavedMethods = async () => {
        try {
            const storedBanks = await AsyncStorage.getItem('savedBanks');
            const storedUPIs = await AsyncStorage.getItem('savedUPIs');
            if (storedBanks) setSavedBanks(JSON.parse(storedBanks));
            if (storedUPIs) setSavedUPIs(JSON.parse(storedUPIs));
        } catch (error) {
            console.error('Error loading saved methods:', error);
        }
    };

    const saveBank = async (bankDetails) => {
        try {
            const newBanks = [...savedBanks, bankDetails];
            setSavedBanks(newBanks);
            await AsyncStorage.setItem('savedBanks', JSON.stringify(newBanks));
            return true;
        } catch (error) {
            console.error('Error saving bank:', error);
            return false;
        }
    };

    const saveUPI = async (upiDetails) => {
        try {
            const newUPIs = [...savedUPIs, upiDetails];
            setSavedUPIs(newUPIs);
            await AsyncStorage.setItem('savedUPIs', JSON.stringify(newUPIs));
            return true;
        } catch (error) {
            console.error('Error saving UPI:', error);
            return false;
        }
    };

    const removeBank = async (index) => {
        try {
            const newBanks = savedBanks.filter((_, i) => i !== index);
            setSavedBanks(newBanks);
            await AsyncStorage.setItem('savedBanks', JSON.stringify(newBanks));
        } catch (error) {
            console.error('Error removing bank:', error);
        }
    };

    const removeUPI = async (index) => {
        try {
            const newUPIs = savedUPIs.filter((_, i) => i !== index);
            setSavedUPIs(newUPIs);
            await AsyncStorage.setItem('savedUPIs', JSON.stringify(newUPIs));
        } catch (error) {
            console.error('Error removing UPI:', error);
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
        savedBanks,
        savedUPIs,
        config,
        isLoading,
        isLoggedIn: !!token,
        login,
        logout,
        updateUser,
        updateVerificationStatus,
        refreshWallets,
        refreshPaymentDetails,
        refreshConfig,
        saveBank,
        saveUPI,
        removeBank,
        removeUPI,
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
