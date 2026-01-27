import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const RootProvider = ({ children }) => {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            {children}
        </SafeAreaProvider>
    );
};

export default RootProvider;
