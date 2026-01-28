import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale } from '@/core/utils/responsive';
import ProfileHeader from './components/ProfileHeader';
import MenuBar from './components/menuBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserScreen() {
    const navigation = useNavigation();

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleHelpSupport = () => {
        navigation.navigate('HelpAndSupport');
    };

    const handleLogout = () => {
        console.log('Logout pressed');
        // Add logout logic here
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <ProfileHeader name="General User" onEditPress={handleEditProfile} />
                <MenuBar onHelpPress={handleHelpSupport} onLogoutPress={handleLogout} />
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