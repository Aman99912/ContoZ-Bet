import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - moderateScale(24);

const CarromBoard = ({ coins, striker, onStrike, currentPlayer }) => {
    // Simplified Striker control
    const [strikerX, setStrikerX] = useState(0);

    const handleStrike = () => {
        onStrike({ x: strikerX, force: Math.random() * 0.5 + 0.5 });
    };

    // Helper to render diagonal arrows with curved guide style (Simplified)
    const renderArrow = (rotation, top, left, bottom, right) => (
        <View style={[
            styles.arrowContainer,
            { top, left, bottom, right, transform: [{ rotate: `${rotation}deg` }] }
        ]}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowCurveLeft} />
            <View style={styles.arrowCurveRight} />
            <View style={styles.arrowHead} />
        </View>
    );

    // Double-line Baseline (Horizontal)
    const renderBaselineHorizontal = (isTop) => (
        <View style={[styles.baselineBoxHorz, isTop ? { top: moderateScale(45) } : { bottom: moderateScale(45) }]}>
            <View style={styles.baseCircleRed} />
            <View style={styles.doubleLineContainerHorz}>
                <View style={styles.singleLine} />
                <View style={styles.singleLine} />
            </View>
            <View style={styles.baseCircleRed} />
        </View>
    );

    // Double-line Baseline (Vertical)
    const renderBaselineVertical = (isLeft) => (
        <View style={[styles.baselineBoxVert, isLeft ? { left: moderateScale(45) } : { right: moderateScale(45) }]}>
            <View style={styles.baseCircleRed} />
            <View style={styles.doubleLineContainerVert}>
                <View style={styles.singleLineVert} />
                <View style={styles.singleLineVert} />
            </View>
            <View style={styles.baseCircleRed} />
        </View>
    );

    return (
        <View style={styles.boardContainer}>
            {/* Frame - Jet Black shiny look as per image */}
            <View style={styles.boardFrame}>
                <View style={styles.boardSurface}>
                    {/* Corner Pockets with Mesh Pattern */}
                    <View style={[styles.pocket, styles.pocketTL]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>
                    <View style={[styles.pocket, styles.pocketTR]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>
                    <View style={[styles.pocket, styles.pocketBL]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>
                    <View style={[styles.pocket, styles.pocketBR]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="alpha-s-circle-outline" size={20} color="#D32F2F" />
                        <View style={{ height: 1, width: 40, backgroundColor: '#D32F2F', marginHorizontal: 4 }} />
                        <MaterialCommunityIcons name="crown" size={16} color="#D32F2F" />
                    </View>

                    {/* Diagonal Lines (Arrows) */}
                    {/* Top-Left */}
                    {renderArrow(135, moderateScale(60), moderateScale(60), null, null)}
                    {/* Top-Right */}
                    {renderArrow(225, moderateScale(60), null, null, moderateScale(60))}
                    {/* Bottom-Left */}
                    {renderArrow(45, null, moderateScale(60), moderateScale(60), null)}
                    {/* Bottom-Right */}
                    {renderArrow(-45, null, null, moderateScale(60), moderateScale(60))}

                    {/* Baselines - Black double lines with Red Circles */}
                    {renderBaselineHorizontal(true)}
                    {renderBaselineHorizontal(false)}
                    {renderBaselineVertical(true)}
                    {renderBaselineVertical(false)}

                    {/* Center Design */}
                    <View style={styles.centerDesign}>
                        {/* Outer Red/Black ring pattern simulation */}
                        <View style={styles.centerOuterLoop} />
                        <View style={styles.centerMiddleFill} />
                        <View style={styles.centerRedDot} />
                    </View>

                    {/* Coins */}
                    {coins.map((coin, index) => (
                        !coin.potted && (
                            <View
                                key={index}
                                style={[
                                    styles.coin,
                                    {
                                        backgroundColor: coin.color === 'white' ? '#F3E5AB' : '#212121', // Beige/Black
                                        borderColor: coin.color === 'white' ? '#D4C4A8' : '#000',
                                        left: coin.x,
                                        top: coin.y,
                                        borderWidth: coin.color === 'queen' ? 0 : 1,
                                        backgroundColor: coin.color === 'queen' ? '#E53935' : (coin.color === 'white' ? '#F3E5AB' : '#212121'),
                                    }
                                ]}
                            >
                                <View style={[
                                    styles.coinRing,
                                    { borderColor: coin.color === 'white' ? '#D7CCC8' : '#424242' }
                                ]} />
                            </View>
                        )
                    ))}

                    {/* Striker Area */}
                    {currentPlayer === 'white' && (
                        <View style={styles.strikerTrackBottom}>
                            <TouchableOpacity
                                style={[styles.strikerContainer, { left: strikerX + '%' }]}
                                onPress={handleStrike}
                                activeOpacity={0.9}
                            >
                                <View style={styles.strikerBody} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Opponent View */}
                    {currentPlayer === 'black' && (
                        <View style={styles.strikerTrackTop}>
                            <View style={[styles.strikerContainer, { left: '50%' }]}>
                                <View style={[styles.strikerBody, { backgroundColor: '#FFEE58' }]} />
                            </View>
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
        marginTop: verticalScale(10),
    },
    boardFrame: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        padding: moderateScale(20), // Wide black frame
        borderRadius: moderateScale(30),
        backgroundColor: '#050505', // Jet black as per image
        elevation: 8,
    },
    boardSurface: {
        flex: 1,
        backgroundColor: '#F2D7B4', // Light wood texture color
        borderRadius: moderateScale(10),
        position: 'relative',
        overflow: 'hidden',
    },

    // Pockets with Mesh look
    pocket: {
        position: 'absolute',
        width: moderateScale(36),
        height: moderateScale(36),
        backgroundColor: '#111',
        borderRadius: moderateScale(18),
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    pocketTL: { top: -moderateScale(8), left: -moderateScale(8) },
    pocketTR: { top: -moderateScale(8), right: -moderateScale(8) },
    pocketBL: { bottom: -moderateScale(8), left: -moderateScale(8) },
    pocketBR: { bottom: -moderateScale(8), right: -moderateScale(8) },

    // Logo
    logoContainer: {
        position: 'absolute',
        top: moderateScale(20),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.8,
    },

    // Center Design - Matches Image
    centerDesign: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: moderateScale(100),
        height: moderateScale(100),
        marginLeft: -moderateScale(50),
        marginTop: -moderateScale(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerOuterLoop: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(50),
        borderWidth: 1.5,
        borderColor: '#212121', // Thin outer black ring
    },
    centerMiddleFill: {
        position: 'absolute',
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#B71C1C',
    },
    centerRedDot: {
        width: moderateScale(16),
        height: moderateScale(16),
        borderRadius: moderateScale(8),
        backgroundColor: '#D32F2F', // Solid red center
    },

    // Baselines - Double Lines
    baselineBoxHorz: {
        position: 'absolute',
        left: moderateScale(48),
        right: moderateScale(48),
        height: moderateScale(22),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2,
    },
    doubleLineContainerHorz: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        gap: moderateScale(14), // Matches image spacing
        marginHorizontal: moderateScale(2),
    },
    singleLine: {
        width: '100%',
        height: 1.5,
        backgroundColor: '#000', // Solid black lines
    },

    baselineBoxVert: {
        position: 'absolute',
        top: moderateScale(48),
        bottom: moderateScale(48),
        width: moderateScale(22),
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2,
    },
    doubleLineContainerVert: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(14),
        marginVertical: moderateScale(2),
    },
    singleLineVert: {
        height: '100%',
        width: 1.5,
        backgroundColor: '#000',
    },

    // Baseline Circles - Solid Red
    baseCircleRed: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(10),
        backgroundColor: '#D32F2F',
        borderWidth: 1,
        borderColor: '#000',
    },

    // Arrows
    arrowContainer: {
        position: 'absolute',
        width: moderateScale(80),
        height: moderateScale(80),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0,0,0,0.05)', // Debug
    },
    arrowLine: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: '#000',
    },
    arrowCurveLeft: {
        position: 'absolute',
        width: moderateScale(20),
        height: moderateScale(20),
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000',
        borderRadius: moderateScale(20), // Curve
        left: moderateScale(5),
        bottom: '50%',
        transform: [{ rotate: '45deg' }]
    },
    arrowCurveRight: {
        position: 'absolute',
        width: moderateScale(20),
        height: moderateScale(20),
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderColor: '#000',
        borderRadius: moderateScale(20), // Curve
        right: moderateScale(5),
        top: '50%',
        transform: [{ rotate: '45deg' }]
    },
    arrowHead: {
        position: 'absolute',
        right: 0,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#000',
    },


    // Coins
    coin: {
        position: 'absolute',
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(11),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        zIndex: 10,
    },
    coinRing: {
        width: '70%',
        height: '70%',
        borderRadius: moderateScale(8),
        borderWidth: 1,
        opacity: 0.5,
    },

    // Striker
    strikerTrackBottom: {
        position: 'absolute',
        bottom: moderateScale(42),
        left: moderateScale(60),
        right: moderateScale(60),
        height: moderateScale(22),
        justifyContent: 'center',
    },
    strikerTrackTop: {
        position: 'absolute',
        top: moderateScale(42),
        left: moderateScale(60),
        right: moderateScale(60),
        height: moderateScale(22),
        justifyContent: 'center',
    },
    strikerContainer: {
        position: 'absolute',
        width: moderateScale(32),
        height: moderateScale(32),
        marginLeft: -moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    strikerBody: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(16),
        backgroundColor: '#FFF', // White striker
        borderWidth: 4,
        borderColor: '#E0E0E0', // slight rim
        elevation: 4,
    },
});

export default CarromBoard;
