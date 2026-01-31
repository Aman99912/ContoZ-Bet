import React from 'react';
import { View, StyleSheet } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const InGameHeader = ({ entryFee }) => {
    return (
        <View style={styles.header}>
            <View style={styles.badge}>
                <MaterialCommunityIcons name="grid" size={moderateScale(18)} color={gamesColor.primary} />
                <CText style={styles.badgeText}>Tic Tac Toe</CText>
                <View style={styles.feeBadge}>
                    <CText style={styles.feeText} numberOfLines={1}>₹{entryFee} Entry</CText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginTop: verticalScale(15),
        marginBottom: verticalScale(10),
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(6),
        backgroundColor: gamesColor.cardBackground,
        borderRadius: moderateScale(20),
        borderWidth: 1.5,
        borderColor: gamesColor.primary + '40',
        elevation: 3,
        shadowColor: gamesColor.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    badgeText: {
        fontSize: moderateScale(14),
        fontWeight: '900',
        color: gamesColor.primary,
        marginLeft: moderateScale(6),
        letterSpacing: 0.5,
    },
    feeBadge: {
        backgroundColor: gamesColor.primary + '20',
        paddingHorizontal: moderateScale(8),
        paddingVertical: verticalScale(2),
        borderRadius: moderateScale(10),
        marginLeft: moderateScale(10),
        borderWidth: 1,
        borderColor: gamesColor.primary + '40',
    },
    feeText: {
        fontSize: moderateScale(11),
        fontWeight: 'bold',
        color: gamesColor.primary,
    },
});

export default InGameHeader;
