import React from 'react';
import { View, StyleSheet } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const GameHeader = () => {
    return (
        <View style={styles.header}>
            <View style={styles.badge}>
                <MaterialCommunityIcons name="grid" size={moderateScale(18)} color={gamesColor.accent} />
                <CText style={styles.badgeText}>Tic Tac Toe</CText>
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
        borderWidth: 1,
        borderColor: gamesColor.accent + '40',
        elevation: 3,
        shadowColor: gamesColor.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    badgeText: {
        fontSize: moderateScale(14),
        fontWeight: '900',
        color: gamesColor.textPrimary,
        marginLeft: moderateScale(6),
        letterSpacing: 0.5,
    },
});

export default GameHeader;
