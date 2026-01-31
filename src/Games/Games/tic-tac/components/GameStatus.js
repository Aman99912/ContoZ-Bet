import React from 'react';
import { View, StyleSheet } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const GameStatus = ({ winner, isXNext }) => {
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
        <View style={styles.container}>
            <CText style={styles.turnText}>
                TURN: <CText style={{ color: isXNext ? gamesColor.player1 : gamesColor.player2 }}>PLAYER {isXNext ? 'X' : 'O'}</CText>
            </CText>
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
    turnText: {
        fontSize: moderateScale(18),
        fontWeight: '800',
        color: gamesColor.textPrimary,
        letterSpacing: 1,
    },
});

export default GameStatus;
