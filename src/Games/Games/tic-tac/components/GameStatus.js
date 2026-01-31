import React from 'react';
import { View, StyleSheet } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const GameStatus = ({ winner, isXNext, prizePool }) => {
    if (winner) {
        return (
            <View style={styles.container}>
                <CText style={[styles.statusText, { color: winner === 'Draw' ? gamesColor.textPrimary : (winner === 'X' ? gamesColor.player1 : gamesColor.player2) }]}>
                    {winner === 'Draw' ? "GAME DRAW!" : `PLAYER ${winner} WINS!`}
                </CText>
            </View>
        );
    }

    return (
        <View style={styles.prizeContainer}>
            <View style={styles.prizeLabelBox}>
                <CText style={styles.prizeLabel}>WINNING AMOUNT</CText>
            </View>
            <View style={styles.prizeValueBox}>
                <CText style={styles.prizeValue}>₹{prizePool}</CText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: verticalScale(10),
        alignItems: 'center',
    },
    statusText: {
        fontSize: moderateScale(24),
        fontWeight: '900',
        letterSpacing: 2,
    },
    prizeContainer: {
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    prizeLabelBox: {
        marginBottom: verticalScale(2),
    },
    prizeLabel: {
        fontSize: moderateScale(10),
        fontWeight: 'bold',
        color: gamesColor.textPrimary + '80',
        letterSpacing: 1,
    },
    prizeValueBox: {
        backgroundColor: gamesColor.primary + '15',
        paddingHorizontal: moderateScale(20),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: gamesColor.primary + '40',
    },
    prizeValue: {
        fontSize: moderateScale(20),
        fontWeight: '900',
        color: gamesColor.primary,
    },
});

export default GameStatus;
