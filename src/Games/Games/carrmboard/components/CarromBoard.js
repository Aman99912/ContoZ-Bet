import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BOARD_SIZE = moderateScale(320);

const CarromBoard = ({ coins, striker, onStrike, currentPlayer }) => {
    // Simplified Striker control
    // Users drag the striker along the baseline and release to shoot vertically
    const [strikerX, setStrikerX] = useState(0);

    const handleStrike = () => {
        onStrike({ x: strikerX, force: Math.random() * 0.5 + 0.5 }); // Simulation
    };

    return (
        <View style={styles.boardContainer}>
            <View style={styles.boardFrame}>
                <View style={styles.boardSurface}>
                    {/* Pockets */}
                    <View style={[styles.pocket, styles.pocketTL]} />
                    <View style={[styles.pocket, styles.pocketTR]} />
                    <View style={[styles.pocket, styles.pocketBL]} />
                    <View style={[styles.pocket, styles.pocketBR]} />

                    {/* Central Design */}
                    <View style={styles.centerCircle} />
                    <View style={styles.centerInnerCircle} />

                    {/* Coins */}
                    {coins.map((coin, index) => (
                        !coin.potted && (
                            <View
                                key={index}
                                style={[
                                    styles.coin,
                                    {
                                        backgroundColor: coin.color === 'white' ? '#FFF' : '#000',
                                        borderColor: coin.color === 'queen' ? '#F00' : '#888',
                                        left: coin.x,
                                        top: coin.y,
                                        borderWidth: coin.color === 'queen' ? 2 : 1
                                    }
                                ]}
                            />
                        )
                    ))}

                    {/* Striker Area (Bottom for Player 1) */}
                    {currentPlayer === 'white' && (
                        <View style={styles.strikerLineBottom}>
                            <TouchableOpacity
                                style={[styles.striker, { left: strikerX + '%' }]}
                                onPress={handleStrike}
                            />
                        </View>
                    )}

                    {/* Striker Area (Top for Player 2 - Simulation View) */}
                    {currentPlayer === 'black' && (
                        <View style={styles.strikerLineTop}>
                            <View
                                style={[styles.striker, { left: '50%', backgroundColor: gamesColor.player2 }]}
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    boardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(20),
    },
    boardFrame: {
        width: BOARD_SIZE + moderateScale(20),
        height: BOARD_SIZE + moderateScale(20),
        backgroundColor: '#5D4037', // Wood color
        padding: moderateScale(10),
        borderRadius: moderateScale(12),
        elevation: 8,
    },
    boardSurface: {
        flex: 1,
        backgroundColor: '#F5DEB3', // Beige surface
        borderRadius: moderateScale(4),
        position: 'relative',
    },
    pocket: {
        position: 'absolute',
        width: moderateScale(28),
        height: moderateScale(28),
        backgroundColor: '#1A1A1A',
        borderRadius: moderateScale(14),
        zIndex: 1,
    },
    pocketTL: { top: 0, left: 0 },
    pocketTR: { top: 0, right: 0 },
    pocketBL: { bottom: 0, left: 0 },
    pocketBR: { bottom: 0, right: 0 },
    centerCircle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: moderateScale(60),
        height: moderateScale(60),
        marginLeft: -moderateScale(30),
        marginTop: -moderateScale(30),
        borderWidth: 1,
        borderColor: '#A1887F',
        borderRadius: moderateScale(30),
        opacity: 0.5,
    },
    centerInnerCircle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: moderateScale(20),
        height: moderateScale(20),
        marginLeft: -moderateScale(10),
        marginTop: -moderateScale(10),
        backgroundColor: '#A1887F',
        borderRadius: moderateScale(10),
        opacity: 0.2,
    },
    coin: {
        position: 'absolute',
        width: moderateScale(14),
        height: moderateScale(14),
        borderRadius: moderateScale(7),
        elevation: 2,
    },
    strikerLineBottom: {
        position: 'absolute',
        bottom: moderateScale(40),
        left: '15%',
        width: '70%',
        height: 1,
        backgroundColor: '#333',
    },
    strikerLineTop: {
        position: 'absolute',
        top: moderateScale(40),
        left: '15%',
        width: '70%',
        height: 1,
        backgroundColor: '#333',
    },
    striker: {
        position: 'absolute',
        top: -moderateScale(10),
        width: moderateScale(20),
        height: moderateScale(20),
        backgroundColor: '#FFF8E1',
        borderRadius: moderateScale(10),
        borderWidth: 2,
        borderColor: '#333',
        elevation: 4,
    }
});

export default CarromBoard;
