import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors, ThemeProvider } from '@/core/theme/colors';

// Screens
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '@/screen/auth';
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
import WithdrawalScreen from '@/screen/profile/Profile-screens/Bank-widr/withrawal';
import BankDetailsScreen from '@/screen/profile/Profile-screens/Bank-widr/bankdetails';
import UPIDetailsScreen from '@/screen/profile/Profile-screens/Bank-widr/upidetails';
import EmailVerify from '@/screen/profile/components/emailVerfiy';
import GameInit from '@/Games/components/Gameinit/gameinit';
import GameWaiting from '@/Games/components/Gameinit/gamewating';
import TicTacToe from '@/Games/Games/tic-tac';
import SplashScreen from '@/screen/splash/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';
import CustomAlert from '@/components/common/CustomAlert';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from '@/core/utils/responsive';
import CreateTicket from '@/screen/profile/Profile-screens/CreateTicket';
import TrackTicket from '@/screen/profile/Profile-screens/TrackTicket';

const TabNavigator = () => {
    const { colors } = useTheme();
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
                        height: moderateScale(70) + insets.bottom,
                        paddingBottom: insets.bottom + moderateScale(8),
                        paddingTop: moderateScale(8),
                        elevation: 0,
                        shadowOpacity: 0,
                        borderTopWidth: 1,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarLabelStyle: {
                        fontSize: moderateScale(12),
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
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                />
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
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="MainApp" component={TabNavigator} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen name="EmailVerify" component={EmailVerify} />
                    <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
                    <Stack.Screen name="CreateTicket" component={CreateTicket} />
                    <Stack.Screen name="TrackTicket" component={TrackTicket} />
                    <Stack.Screen name="ReferAndEarn" component={ReferAndEarn} />
                    <Stack.Screen name="MyGames" component={MyGames} />
                    <Stack.Screen name="Notifications" component={Notifications} />
                    <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
                    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                    <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
                    <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
                    <Stack.Screen name="UPIDetails" component={UPIDetailsScreen} />
                    <Stack.Screen name="GameInit" component={GameInit} />
                    <Stack.Screen name="GameWaiting" component={GameWaiting} />
                    <Stack.Screen name="TicTacToe" component={TicTacToe} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};

export default Navigation;
