import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';

// Screens
import { LoginScreen } from '@/screen/auth';
import HomeScreen from '@/screen/homepage';
import HistoryScreen from '@/screen/history';
import WalletScreen from '@/screen/wallet';
import UserScreen from '@/screen/profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'clock' : 'clock-outline';
                    } else if (route.name === 'Wallet') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'User') {
                        iconName = focused ? 'account' : 'account-outline';
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Wallet" component={WalletScreen} />
            <Tab.Screen name="User" component={UserScreen} />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainApp" component={TabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
