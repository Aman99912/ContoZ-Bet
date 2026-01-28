import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeHeader = ({ balance = 1212 }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.headerContainer}>
            <CText style={styles.appName}>Conto-Z</CText>

            <TouchableOpacity
                style={styles.balanceCard}
                onPress={() => navigation.navigate('Wallet')}
                activeOpacity={0.8}
            >
                <CText style={styles.balanceAmount}>₹{balance}</CText>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        // paddingVertical: verticalScale(12),
        backgroundColor: colors.background,
    },
    appName: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontStyle: 'italic',
    },
    balanceCard: {
        backgroundColor: colors.surface,
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(12),
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
