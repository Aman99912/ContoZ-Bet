import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';

const RootProvider = ({ children }) => {
    return (
        <SafeAreaProvider>
            <AppProvider>
                <StatusBar style="light" />
                {children}
            </AppProvider>
        </SafeAreaProvider>
    );
};

export default RootProvider;
