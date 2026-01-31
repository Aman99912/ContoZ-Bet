import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginWarn from './LoginWarn';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const HomeHeader = ({ balance = 1212, isLoggedIn = false }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.headerContainer, { backgroundColor: colors.background }]}>
            <CText style={[styles.appName, { color: colors.textPrimary }]}>Conto-Z</CText>

            {isLoggedIn ? (
                <View style={styles.rightSection}>
                    <TouchableOpacity
                        style={[styles.notificationIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('Notifications')}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="bell-outline" size={moderateScale(20)} color={colors.primary} />
                        {/* Notification Dot */}
                        <View style={[styles.notificationDot, { backgroundColor: colors.error }]} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('Wallet')}
                        activeOpacity={0.8}
                    >
                        <CText style={[styles.balanceAmount, { color: colors.textPrimary }]}>₹{Number(balance).toFixed(1)}</CText>
                    </TouchableOpacity>
                </View>
            ) : (
                <LoginWarn />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
    },
    appName: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontStyle: 'italic',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    notificationIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: moderateScale(8),
        right: moderateScale(8),
        width: moderateScale(10),
        height: moderateScale(10),
        borderRadius: moderateScale(5),
        borderWidth: 2,
        borderColor: colors.surface,
    },
    balanceCard: {
        backgroundColor: colors.surface,
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(24),
        borderWidth: 2,
        borderColor: colors.border,
        minWidth: moderateScale(100),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceAmount: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
});

export default HomeHeader;
