import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HistoryItem = ({ game, entryFee, result, amount, date, icon, onPress }) => {
    const isWon = result === 'WON';
    const resultColor = isWon ? colors.primary : colors.error;

    return (
        <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={icon || 'gamepad-variant'} size={24} color={colors.primary} />
            </View>

            <View style={styles.content}>
                <CText style={styles.gameName}>{game}</CText>
                <CText style={styles.entryFee}>Entry Fee: ₹{entryFee}</CText>
            </View>

            <View style={styles.right}>
                <CText style={[styles.amount, { color: resultColor }]}>
                    ₹{amount} {result}
                </CText>
                <CText style={styles.date}>{date}</CText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(8),
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconBox: {
        width: moderateScale(50),
        height: moderateScale(50),
        backgroundColor: colors.inputBackground,
        borderRadius: moderateScale(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(12),
    },
    content: {
        flex: 1,
    },
    gameName: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    entryFee: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
    right: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        marginBottom: 4,
    },
    date: {
        fontSize: moderateScale(11),
        color: colors.textSecondary,
    },
});

export default HistoryItem;
