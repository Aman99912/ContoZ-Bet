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

    // 3D Lightweight Coin Component with Texture
    const RenderCoin = ({ coin }) => {
        const isWhite = coin.color === 'white';
        const isQueen = coin.color === 'queen';

        // Colors
        const gradientColors = isQueen
            ? ['#D32F2F', '#B71C1C', '#D32F2F'] // Red for Queen
            : (isWhite ? ['#FFF9C4', '#FBC02D', '#FFF9C4'] : ['#424242', '#212121', '#424242']); // White/Black

        const borderColor = isQueen ? '#B71C1C' : (isWhite ? '#FBC02D' : '#000');

        return (
            <View
                style={[
                    styles.coin,
                    {
                        left: coin.x,
                        top: coin.y,
                        zIndex: 10,
                    }
                ]}
            >
                <LinearGradient
                    colors={gradientColors}
                    style={[styles.coinGradient, { borderColor }]}
                >
                    <View style={styles.coinRingOuter} />
                    <View style={styles.coinRingMid} />
                    <View style={styles.coinCenterDesign} />
                </LinearGradient>
            </View>
        );
    };

    // 3D Striker Component
    const RenderStriker = ({ color }) => {
        const isGreen = color === 'green';
        // Green for Player 1 (Bottom), Blue for Player 2 (Top)
        const gradientColors = isGreen
            ? ['#4CAF50', '#2E7D32', '#1B5E20']
            : ['#2196F3', '#1565C0', '#0D47A1'];
        const borderColor = isGreen ? '#1B5E20' : '#0D47A1';

        return (
            <View style={styles.strikerContainerInner}>
                <LinearGradient
                    colors={gradientColors}
                    style={[styles.strikerGradient, { borderColor }]}
                >
                    {/* Inner design for grip/texture */}
                    <View style={styles.strikerRingOuter} />
                    <View style={styles.strikerRingInner} />
                    <View style={styles.strikerCenter} />
                </LinearGradient>
            </View>
        );
    };

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
                    {renderArrow(135, moderateScale(60), moderateScale(60), null, null)}
                    {renderArrow(225, moderateScale(60), null, null, moderateScale(60))}
                    {renderArrow(45, null, moderateScale(60), moderateScale(60), null)}
                    {renderArrow(-45, null, null, moderateScale(60), moderateScale(60))}

                    {/* Baselines */}
                    {renderBaselineHorizontal(true)}
                    {renderBaselineHorizontal(false)}
                    {renderBaselineVertical(true)}
                    {renderBaselineVertical(false)}

                    {/* Center Design */}
                    <View style={styles.centerDesign}>
                        <View style={styles.centerOuterLoop} />
                        <View style={styles.centerMiddleFill} />
                        <View style={styles.centerRedDot} />
                    </View>

                    {/* Coins */}
                    {coins.map((coin, index) => (
                        !coin.potted && (
                            <RenderCoin key={index} coin={coin} />
                        )
                    ))}

                    {/* Striker Area - Player 1 (Green) */}
                    {currentPlayer === 'white' && (
                        <View style={styles.strikerTrackBottom}>
                            <TouchableOpacity
                                style={[styles.strikerContainer, { left: strikerX + '%' }]}
                                onPress={handleStrike}
                                activeOpacity={0.9}
                            >
                                <RenderStriker color="green" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Striker Area - Player 2 (Blue) */}
                    {currentPlayer === 'black' && (
                        <View style={styles.strikerTrackTop}>
                            <View style={[styles.strikerContainer, { left: '50%' }]}>
                                <RenderStriker color="blue" />
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

    // Pockets
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

    // Center Design
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

    // Baselines
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

    // Baseline Circles
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


    // 3D Coins Styles
    coin: {
        position: 'absolute',
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2.5,
    },
    coinGradient: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
    },
    coinRingOuter: {
        position: 'absolute',
        width: '85%',
        height: '85%',
        borderRadius: moderateScale(10),
        borderWidth: 1,
        opacity: 0.2,
    },
    coinRingMid: {
        position: 'absolute',
        width: '60%',
        height: '60%',
        borderRadius: moderateScale(8),
        borderWidth: 0.5,
        opacity: 0.2,
    },
    coinCenterDesign: {
        width: '40%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },

    // Striker
    strikerTrackBottom: {
        position: 'absolute',
        bottom: moderateScale(42),
        left: moderateScale(60),
        right: moderateScale(60),
        height: moderateScale(30),
        justifyContent: 'center',
    },
    strikerTrackTop: {
        position: 'absolute',
        top: moderateScale(42),
        left: moderateScale(60),
        right: moderateScale(60),
        height: moderateScale(30),
        justifyContent: 'center',
    },
    strikerContainer: {
        position: 'absolute',
        width: moderateScale(36),
        height: moderateScale(36),
        marginLeft: -moderateScale(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
    strikerContainerInner: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(18),
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    strikerGradient: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(18),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    strikerRingOuter: {
        position: 'absolute',
        width: '80%',
        height: '80%',
        borderRadius: moderateScale(15),
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    strikerRingInner: {
        position: 'absolute',
        width: '50%',
        height: '50%',
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    strikerCenter: {
        width: '20%',
        height: '20%',
        borderRadius: moderateScale(4),
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
});

export default CarromBoard;
