import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const darkColors = {
    background: '#0D0D0D',
    surface: '#1A1A1A',
    primary: '#2CB67D',
    error: '#EF4444',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    inputBackground: '#252525',
    border: '#333333',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    pending: '#ff9800',
    // Header/Nav specific
    headerBackground: '#0D0D0D',
    tabBarBackground: '#0D0D0D',
};

const lightColors = {
    background: '#F5F7FA', // Light grey-blueish
    surface: '#FFFFFF',
    primary: '#2CB67D', // Keep primary (maybe adjust contrast if needed)
    error: '#DC2626',
    textPrimary: '#1F2937', // Dark grey/black
    textSecondary: '#6B7280',
    inputBackground: '#E5E7EB',
    border: '#E5E7EB', // Light border
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    pending: '#F59E0B',
    // Header/Nav specific
    headerBackground: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
};

// Legacy support (defaults to dark for now)
export const colors = darkColors;

// Context
const ThemeContext = createContext({
    theme: 'dark',
    colors: darkColors,
    toggleTheme: () => { },
    setTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme) {
                setTheme(savedTheme);
            } else {
                // Default to device theme or dark
                const colorScheme = Appearance.getColorScheme();
                setTheme(colorScheme === 'light' ? 'light' : 'dark');
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('appTheme', newTheme);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    // Memoize value to prevent unnecessary re-renders? 
    // For now simple object is fine as theme changes rarely.
    const activeColors = theme === 'light' ? lightColors : darkColors;

    return (
        <ThemeContext.Provider value={{ theme, colors: activeColors, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
