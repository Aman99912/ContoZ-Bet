import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryHeader = ({ balance = 1212 }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
            <CText style={[styles.appName, { color: colors.textPrimary }]}>History</CText>

            <TouchableOpacity
                style={[styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Wallet')}
                activeOpacity={0.8}
            >
                <CText style={[styles.balanceAmount, { color: colors.textPrimary }]}>₹{Number(balance).toFixed(1)}</CText>
            </TouchableOpacity>
        </View>
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
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: colors.textPrimary,
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

export default HistoryHeader;
