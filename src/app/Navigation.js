import React from 'react';
import { TouchableOpacity } from 'react-native';
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
import EditProfile from '@/screen/profile/Profile-screens/EditProfile';
import HelpAndSupport from '@/screen/profile/Profile-screens/helpandSupport';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    // Set to true when user is logged in
    const isLoggedIn = false; // Change this based on your auth state

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
            screenListeners={({ navigation, route }) => ({
                tabPress: (e) => {
                    // Prevent navigation to History, Wallet, User if not logged in
                    if (!isLoggedIn && (route.name === 'History' || route.name === 'Wallet' || route.name === 'User')) {
                        e.preventDefault();

                    }
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            style={[props.style, !isLoggedIn && { opacity: 0.5 }]}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Wallet"
                component={WalletScreen}
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            style={[props.style, !isLoggedIn && { opacity: 0.5 }]}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="User"
                component={UserScreen}
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            style={[props.style, !isLoggedIn && { opacity: 0.5 }]}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainApp">
                <Stack.Screen name="MainApp" component={TabNavigator} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
