import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginWarn from './LoginWarn';

const HomeHeader = ({ balance = 1212, isLoggedIn = false }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.headerContainer, { backgroundColor: colors.background }]}>
            <CText style={[styles.appName, { color: colors.textPrimary }]}>Conto-Z</CText>

            {isLoggedIn ? (
                <TouchableOpacity
                    style={[styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => navigation.navigate('Wallet')}
                    activeOpacity={0.8}
                >
                    <CText style={[styles.balanceAmount, { color: colors.textPrimary }]}>₹{balance}</CText>
                </TouchableOpacity>
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
        backgroundColor: colors.background,
    },
    appName: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontStyle: 'italic',
    },
    balanceCard: {
        backgroundColor: colors.surface,
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(24),
        borderWidth: 2,
        borderColor: colors.border,
        minWidth: moderateScale(120),
        alignItems: 'center',
    },
    balanceAmount: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
});

export default HomeHeader;
