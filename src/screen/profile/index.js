import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CText from '@/components/common/CText';
import ProfileHeader from './components/ProfileHeader';
import MenuBar from './components/menuBar';
import VerificationWarning from './components/VerificationWarning';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import CustomAlert from '@/components/common/CustomAlert';

export default function UserScreen() {
    const navigation = useNavigation();
    const { user, logout, refreshProfile } = useApp();
    const { colors, theme } = useTheme();
    const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            refreshProfile();
        }, [])
    );

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleReferEarn = () => {
        navigation.navigate('ReferAndEarn');
    };

    const handleMyGames = () => {
        navigation.navigate('MyGames');
    };

    const handleNotifications = () => {
        navigation.navigate('Notifications');
    };

    const handleTerms = () => {
        navigation.navigate('TermsAndConditions');
    };

    const handlePrivacy = () => {
        navigation.navigate('PrivacyPolicy');
    };

    const handleHelpSupport = () => {
        navigation.navigate('HelpAndSupport');
    };

    const handleLogout = () => {
        setShowLogoutAlert(true);
    };

    const confirmLogout = async () => {
        setShowLogoutAlert(false);
        await logout();
        navigation.replace('Login');
    };

    // Get user name from user data, default to "User"
    const userName = user?.name || 'User';
    const userUsername = user?.username || '';
    // Check if user is verified (0 = not verified, 1 = verified)
    const isVerified = user?.isverified === 1;

    // Define dynamic styles or colors based on theme
    const withdrawalBg = theme === 'dark' ? 'rgba(26, 26, 26, 0.95)' : colors.surface;
    const withdrawalBorder = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : colors.border;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <ProfileHeader name={userName} username={userUsername} onEditPress={handleEditProfile} />

                {/* Withdrawal Button */}
                <TouchableOpacity
                    style={[styles.withdrawalButton, { backgroundColor: withdrawalBg, borderColor: withdrawalBorder, shadowColor: colors.primary }]}
                    onPress={() => navigation.navigate('Withdrawal')}
                    activeOpacity={0.8}
                >
                    <View style={styles.withdrawalContent}>
                        <View style={styles.withdrawalIconContainer}>
                            <MaterialCommunityIcons name="bank-transfer" size={moderateScale(24)} color={colors.primary} />
                        </View>
                        <CText style={[styles.withdrawalText, { color: colors.textPrimary }]}>Withdraw Funds</CText>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={moderateScale(20)} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Show verification warning if not verified */}
                {!isVerified && <VerificationWarning />}

                <MenuBar
                    onReferPress={handleReferEarn}
                    onMyGamesPress={handleMyGames}
                    onNotificationsPress={handleNotifications}
                    onTermsPress={handleTerms}
                    onPrivacyPress={handlePrivacy}
                    onHelpPress={handleHelpSupport}
                    onLogoutPress={handleLogout}
                />
            </ScrollView>

            <CustomAlert
                visible={showLogoutAlert}
                title="Logout"
                message="Are you sure you want to logout?"
                showConfirm={true}
                confirmText="Logout"
                cancelText="Cancel"
                onConfirm={confirmLogout}
                onClose={() => setShowLogoutAlert(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: colors.background,
    },
    scroll: {
        flex: 1,
    },
    withdrawalButton: {
        marginHorizontal: moderateScale(20),
        marginTop: verticalScale(16),
        marginBottom: verticalScale(8),
        padding: moderateScale(16),
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    withdrawalContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    withdrawalIconContainer: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(44, 182, 125, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(12),
        borderWidth: 1,
        borderColor: 'rgba(44, 182, 125, 0.2)',
    },
    withdrawalText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
});