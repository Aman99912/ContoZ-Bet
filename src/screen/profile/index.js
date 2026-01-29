import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale } from '@/core/utils/responsive';
import ProfileHeader from './components/ProfileHeader';
import MenuBar from './components/menuBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

export default function UserScreen() {
    const navigation = useNavigation();
    const { user, logout } = useApp();

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
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        navigation.replace('Login');
                    },
                },
            ]
        );
    };

    // Get user name from user data, default to "User"
    const userName = user?.name || 'User';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <ProfileHeader name={userName} onEditPress={handleEditProfile} />
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
});