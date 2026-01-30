import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';

// Screens
import { LoginScreen, RegisterScreen } from '@/screen/auth';
import HomeScreen from '@/screen/homepage';
import HistoryScreen from '@/screen/history';
import WalletScreen from '@/screen/wallet';
import UserScreen from '@/screen/profile';
import EditProfile from '@/screen/profile/Profile-screens/EditProfile';
import HelpAndSupport from '@/screen/profile/Profile-screens/helpandSupport';
import ReferAndEarn from '@/screen/profile/Profile-screens/ReferandEarn';
import MyGames from '@/screen/profile/Profile-screens/MyGames';
import Notifications from '@/screen/profile/Profile-screens/Notifications';
import TermsAndConditions from '@/screen/profile/Profile-screens/TermsAndConditions';
import PrivacyPolicy from '@/screen/profile/Profile-screens/PrivacyPolicy';
import EmailVerify from '@/screen/profile/components/emailVerfiy';
import GameInit from '@/Games/components/Gameinit/gameinit';
import GameWaiting from '@/Games/components/Gameinit/gamewating';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import CustomAlert from '@/components/common/CustomAlert';
import { useNavigation } from '@react-navigation/native';

const TabNavigator = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { isLoggedIn } = useApp();
    const [showAuthAlert, setShowAuthAlert] = React.useState(false);

    return (
        <>
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
                            setShowAuthAlert(true);
                        }
                    }
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen
                    name="History"
                    component={HistoryScreen}
                />
                <Tab.Screen
                    name="Wallet"
                    component={WalletScreen}
                />
                <Tab.Screen
                    name="User"
                    component={UserScreen}
                />
            </Tab.Navigator>

            <CustomAlert
                visible={showAuthAlert}
                title="Login Required"
                message="Please login to access this feature"
                showConfirm={true}
                confirmText="Login"
                cancelText="Cancel"
                onConfirm={() => navigation.navigate('Login')}
                onClose={() => setShowAuthAlert(false)}
            />
        </>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainApp">
                <Stack.Screen name="MainApp" component={TabNavigator} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="EmailVerify" component={EmailVerify} />
                <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
                <Stack.Screen name="ReferAndEarn" component={ReferAndEarn} />
                <Stack.Screen name="MyGames" component={MyGames} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                <Stack.Screen name="GameInit" component={GameInit} />
                <Stack.Screen name="GameWaiting" component={GameWaiting} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
