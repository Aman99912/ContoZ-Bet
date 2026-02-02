
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Vibration } from 'react-native';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - moderateScale(24);

const CarromBoard = ({ coins, striker, onStrike, currentPlayer }) => {
    // Striker control - Simple and performant
    const [strikerX, setStrikerX] = useState(0);
    const [isPulling, setIsPulling] = useState(false);
    const [pullVector, setPullVector] = useState({ x: 0, y: 0 });
    const [isShooting, setIsShooting] = useState(false); // Hide striker during shot

    const startPosRef = React.useRef({ x: 0, y: 0 });
    const strikerStartXRef = React.useRef(0);

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                strikerStartXRef.current = strikerX;
                startPosRef.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
                setIsPulling(false);
                setPullVector({ x: 0, y: 0 });
            },
            onPanResponderMove: (evt, gestureState) => {
                const { dx, dy } = gestureState;

                // Determine if user is pulling (vertical dominant) or positioning (horizontal dominant)
                const pullBackThreshold = 15; // Increased threshold for better detection
                const isPullBackGesture = currentPlayer === 'white' ? dy > pullBackThreshold : dy < -pullBackThreshold;

                if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > pullBackThreshold && isPullBackGesture) {
                    // Pulling mode - show aim line
                    if (!isPulling) {
                        setIsPulling(true);
                        Vibration.vibrate(10); // Haptic feedback on mode switch
                    }
                    setPullVector({ x: dx, y: dy });
                } else if (Math.abs(dx) > 5) {
                    // Horizontal positioning mode - 1:1 mapping with screen pixels
                    // Track width is approx 200-300px, we want 1:1 pixel movement
                    const trackWidthPx = 250; // Approximate track width
                    const percentPerPixel = 90 / trackWidthPx; // 90% range = -45 to +45
                    const newValue = strikerStartXRef.current + (dx * percentPerPixel);
                    setStrikerX(Math.max(-45, Math.min(45, newValue)));
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dx, dy } = gestureState;

                // Check if user pulled back (even if isPulling state wasn't set yet)
                const pullBackThreshold = 15;
                const isPullBackGesture = currentPlayer === 'white' ? dy > pullBackThreshold : dy < -pullBackThreshold;
                const hasSignificantPull = Math.abs(dy) > pullBackThreshold && isPullBackGesture;

                if (isPulling || hasSignificantPull) {
                    // Calculate shot velocity based on final pull vector
                    const finalDx = dx;
                    const finalDy = dy;
                    const POWER_FACTOR = 0.2;

                    // Shot is opposite to pull direction
                    const vx = -finalDx * POWER_FACTOR;
                    const vy = -finalDy * POWER_FACTOR;

                    // Clamp maximum power
                    const maxSpeed = 30;
                    const speed = Math.sqrt(vx * vx + vy * vy);
                    const finalVx = speed > maxSpeed ? (vx / speed) * maxSpeed : vx;
                    const finalVy = speed > maxSpeed ? (vy / speed) * maxSpeed : vy;

                    // Only shoot if there's meaningful power
                    if (speed > 1) {
                        setIsShooting(true); // Hide striker during shot
                        Vibration.vibrate(30); // Strong haptic on shot
                        onStrike({ startX: strikerX, vx: finalVx, vy: finalVy });

                        // Show striker again after shot completes
                        setTimeout(() => setIsShooting(false), 3000);
                    }
                }

                setIsPulling(false);
                setPullVector({ x: 0, y: 0 });
            }
        })
    ).current;

    // Render aim line with arrow for better feedback
    const renderAimLine = () => {
        if (!isPulling) return null;

        const { x, y } = pullVector;
        const pullLength = Math.sqrt(x * x + y * y);
        if (pullLength < 5) return null;

        // Shot direction is opposite to pull
        const shotAngle = Math.atan2(-y, -x) * (180 / Math.PI);

        // Power indicator (longer pull = more power)
        const powerPercent = Math.min(pullLength / 100, 1);
        const lineColor = `rgba(255, ${255 - powerPercent * 155}, ${255 - powerPercent * 255}, 0.8)`;

        return (
            <View style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: Math.min(pullLength * 1.5, 150),
                height: 6,
                backgroundColor: lineColor,
                borderRadius: 3,
                transform: [
                    { translateY: -3 },
                    { rotate: `${shotAngle} deg` },
                ],
                zIndex: 100,
                shadowColor: '#fff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
                elevation: 10,
            }}>
                {/* Arrow tip */}
                <View style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    width: 0,
                    height: 0,
                    borderLeftWidth: 12,
                    borderLeftColor: lineColor,
                    borderTopWidth: 6,
                    borderTopColor: 'transparent',
                    borderBottomWidth: 6,
                    borderBottomColor: 'transparent',
                }} />
            </View>
        );
    };

    // Helper to render diagonal arrows
    const renderArrow = (rotation, top, left, bottom, right) => (
        <View style={[
            styles.arrowContainer,
            { top, left, bottom, right, transform: [{ rotate: `${rotation} deg` }] }
        ]}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowCurveLeft} />
            <View style={styles.arrowCurveRight} />
            <View style={styles.arrowHead} />
        </View>
    );

    // Baseline Line Only (No Circles)
    const renderBaselineHorizontal = (isTop) => (
        <View style={[styles.baselineBoxHorz, isTop ? { top: moderateScale(45) } : { bottom: moderateScale(45) }]}>
            <View style={styles.doubleLineContainerHorz}>
                <View style={styles.singleLine} />
                <View style={styles.singleLine} />
            </View>
        </View>
    );

    const renderBaselineVertical = (isLeft) => (
        <View style={[styles.baselineBoxVert, isLeft ? { left: moderateScale(45) } : { right: moderateScale(45) }]}>
            <View style={styles.doubleLineContainerVert}>
                <View style={styles.singleLineVert} />
                <View style={styles.singleLineVert} />
            </View>
        </View>
    );

    // Independent Corner Circles
    const renderCornerCircles = () => (
        <>
            <View style={[styles.baseCircleRed, { position: 'absolute', top: moderateScale(45), left: moderateScale(45) }]} />
            <View style={[styles.baseCircleRed, { position: 'absolute', top: moderateScale(45), right: moderateScale(45) }]} />
            <View style={[styles.baseCircleRed, { position: 'absolute', bottom: moderateScale(45), left: moderateScale(45) }]} />
            <View style={[styles.baseCircleRed, { position: 'absolute', bottom: moderateScale(45), right: moderateScale(45) }]} />
        </>
    );

    // 3D Lightweight Coin Component - Memoized for performance
    const RenderCoin = React.memo(({ coin }) => {
        // Special rendering for the Physics Striker (during shot)
        if (coin.isStriker) {
            return (
                <View
                    style={[
                        styles.coin,
                        {
                            left: coin.x,
                            top: coin.y,
                            zIndex: 100,
                            width: moderateScale(36),
                            height: moderateScale(36),
                            borderRadius: moderateScale(18),
                            marginLeft: -moderateScale(6),
                            marginTop: -moderateScale(6),
                        }
                    ]}
                >
                    <RenderStriker color={currentPlayer === 'white' ? 'green' : 'blue'} />
                </View>
            );
        }

        const isWhite = coin.color === 'white';
        const isQueen = coin.color === 'queen';

        const gradientColors = isQueen
            ? ['#D32F2F', '#B71C1C', '#D32F2F']
            : (isWhite ? ['#FFF9C4', '#FBC02D', '#FFF9C4'] : ['#424242', '#212121', '#424242']);

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
    });

    // 3D Striker Component - Memoized
    const RenderStriker = React.memo(({ color }) => {
        const isGreen = color === 'green';
        const gradientColors = isGreen
            ? ['#66BB6A', '#43A047', '#2E7D32']
            : ['#42A5F5', '#1E88E5', '#1565C0'];

        const borderColor = isGreen ? '#1B5E20' : '#0D47A1';

        return (
            <View style={styles.strikerContainerInner}>
                <LinearGradient
                    colors={gradientColors}
                    style={[styles.strikerGradient, { borderColor }]}
                >
                    <View style={styles.strikerCenter} />
                </LinearGradient>
            </View>
        );
    });

    return (
        <View style={styles.boardContainer}>
            <View style={styles.boardFrame}>
                <View style={styles.boardSurface}>
                    <View style={[styles.pocket, styles.pocketTL]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>
                    <View style={[styles.pocket, styles.pocketTR]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>
                    <View style={[styles.pocket, styles.pocketBL]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>
                    <View style={[styles.pocket, styles.pocketBR]}><MaterialCommunityIcons name="grid" size={24} color="#DDD" style={{ opacity: 0.5 }} /></View>

                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="alpha-s-circle-outline" size={20} color="#D32F2F" />
                        <View style={{ height: 1, width: 40, backgroundColor: '#D32F2F', marginHorizontal: 4 }} />
                        <MaterialCommunityIcons name="crown" size={16} color="#D32F2F" />
                    </View>

                    {renderArrow(135, moderateScale(60), moderateScale(60), null, null)}
                    {renderArrow(225, moderateScale(60), null, null, moderateScale(60))}
                    {renderArrow(45, null, moderateScale(60), moderateScale(60), null)}
                    {renderArrow(-45, null, null, moderateScale(60), moderateScale(60))}

                    {renderBaselineHorizontal(true)}
                    {renderBaselineHorizontal(false)}
                    {renderBaselineVertical(true)}
                    {renderBaselineVertical(false)}

                    {renderCornerCircles()}

                    <View style={styles.centerDesign}>
                        <View style={styles.centerOuterLoop} />
                        <View style={styles.centerMiddleFill} />
                        <View style={styles.centerRedDot} />
                    </View>

                    {coins.map((coin, index) => (
                        !coin.potted && (
                            <RenderCoin key={index} coin={coin} />
                        )
                    ))}

                    {currentPlayer === 'white' && !isShooting && (
                        <View style={styles.strikerTrackBottom}>
                            <View
                                style={[styles.strikerContainer, { left: `${50 + strikerX}%` }]}
                                {...panResponder.panHandlers}
                            >
                                {renderAimLine()}
                                <View style={{ width: '100%', height: '100%' }}>
                                    <RenderStriker color="green" />
                                </View>
                            </View>
                        </View>
                    )}

                    {currentPlayer === 'black' && !isShooting && (
                        <View style={styles.strikerTrackTop}>
                            <View
                                style={[styles.strikerContainer, { left: `${50 + strikerX}%` }]}
                                {...panResponder.panHandlers}
                            >
                                {renderAimLine()}
                                <View style={{ width: '100%', height: '100%' }}>
                                    <RenderStriker color="blue" />
                                </View>
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
        padding: moderateScale(20),
        borderRadius: moderateScale(30),
        backgroundColor: '#050505',
        elevation: 8,
    },
    boardSurface: {
        flex: 1,
        backgroundColor: '#F2D7B4',
        borderRadius: moderateScale(10),
        position: 'relative',
        overflow: 'hidden',
    },

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

    logoContainer: {
        position: 'absolute',
        top: moderateScale(20),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.8,
    },

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
        borderColor: '#212121',
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
        backgroundColor: '#D32F2F',
    },

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
        gap: moderateScale(14),
        marginHorizontal: moderateScale(2),
    },
    singleLine: {
        width: '100%',
        height: 1.5,
        backgroundColor: '#000',
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

    baseCircleRed: {
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(11),
        backgroundColor: '#FF0000',
        borderWidth: 1,
        borderColor: '#000',
        opacity: 1,
        elevation: 2,
        zIndex: 5,
    },

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
        borderRadius: moderateScale(20),
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
        borderRadius: moderateScale(20),
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

    strikerTrackBottom: {
        position: 'absolute',
        bottom: moderateScale(42),
        left: moderateScale(60),
        right: moderateScale(60),
        height: moderateScale(30),
        justifyContent: 'center',
        zIndex: 20,
        elevation: 10,
    },
    strikerTrackTop: {
        position: 'absolute',
        top: moderateScale(42),
        left: moderateScale(60),
        right: moderateScale(60),
        height: moderateScale(30),
        justifyContent: 'center',
        zIndex: 20,
        elevation: 10,
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
    strikerCenter: {
        width: '20%',
        height: '20%',
        borderRadius: moderateScale(4),
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
});

export default CarromBoard;
