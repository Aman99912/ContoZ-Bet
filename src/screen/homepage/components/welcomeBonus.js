import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, Easing, Modal, Platform } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useTheme } from '@/core/theme/colors';

const { width, height } = Dimensions.get('window');

// --- Confetti Component (Lightweight) ---
const ConfettiPiece = ({ color, x, size, duration, delay, rotationInitial }) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1,
                duration: 1500 + Math.random() * 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, {
                    toValue: height * 0.8,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: (Math.random() - 0.5) * 80,
                    duration: duration,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(duration - 500),
                    Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true })
                ])
            ]),
        ]).start();
    }, []);

    const rotation = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: [`${rotationInitial}deg`, `${rotationInitial + 720}deg`],
    });

    return (
        <Animated.View
            style={[
                styles.confettiPiece,
                {
                    left: x,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    transform: [{ translateY }, { translateX }, { rotate: rotation }],
                    opacity
                },
            ]}
        />
    );
};

const Confetti = ({ visible }) => {
    const pieces = useMemo(() => {
        if (!visible) return [];
        const colors = [gamesColor.primary, '#FFD700', '#FF69B4', '#00BFFF', '#FFF'];
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * width,
            size: Math.random() * moderateScale(6) + moderateScale(4),
            color: colors[Math.floor(Math.random() * colors.length)],
            duration: Math.random() * 1500 + 2000,
            delay: Math.random() * 1000,
            rotationInitial: Math.random() * 360,
        }));
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {pieces.map((p) => <ConfettiPiece key={p.id} {...p} />)}
        </View>
    );
};

const WelcomeBonus = ({ visible, amount = 50, onClose }) => {
    const { colors } = useTheme();

    // Animations
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const receiptSlide = useRef(new Animated.Value(-50)).current;

    // Primary Theme Colors
    const primaryGradient = [colors.primary, '#24A56A', '#1E8F5A'];
    const cardGradient = ['#F0FDF4', '#DCFCE7'];
    const slotColor = '#1A1A1A';

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();

            Animated.sequence([
                Animated.delay(300),
                Animated.spring(receiptSlide, { toValue: 0, friction: 6, useNativeDriver: true })
            ]).start();
        } else {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            receiptSlide.setValue(-50);
        }
    }, [visible]);

    // Sound Effect
    useEffect(() => {
        let soundObject = null;
        const playSound = async () => {
            if (visible) {
                try {
                    const { sound } = await Audio.Sound.createAsync(
                        require('@/sound/coin_sound_add.wav')
                    );
                    soundObject = sound;
                    await sound.playAsync();
                } catch (error) {
                    console.log("Error playing welcome sound:", error);
                }
            }
        };

        playSound();

        return () => {
            if (soundObject) {
                soundObject.unloadAsync();
            }
        };
    }, [visible]);

    return (
        <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
            <View style={styles.container}>
                <View style={styles.backdrop} />
                <Confetti visible={visible} />

                <Animated.View style={[
                    styles.cardContainer,
                    { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
                ]}>
                    <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: '100%', paddingTop: moderateScale(70) }}>
                        {/* Header Crest */}
                        <View style={styles.crestContainer}>
                            <View style={styles.wingLeft} />
                            <View style={styles.wingRight} />

                            <LinearGradient colors={primaryGradient} style={styles.sealCircle}>
                                <View style={styles.sealInner}>
                                    <MaterialCommunityIcons name="gift" size={moderateScale(40)} color="#2CB67D" />
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Main Card Body */}
                        <LinearGradient colors={cardGradient} style={styles.card}>
                            <View style={styles.cardContent}>
                                <CText style={styles.congratsText}>Welcome to ContoZ-Bet!</CText>

                                {/* Receipt Slot Section */}
                                <View style={styles.slotContainer}>
                                    <Animated.View style={[
                                        styles.receiptPaper,
                                        { transform: [{ translateY: receiptSlide }] },
                                        { zIndex: 1 }
                                    ]}>
                                        <CText style={styles.bonusLabel}>Welcome Bonus</CText>
                                        <CText style={styles.bonusValue}>₹{amount.toFixed(2)}</CText>
                                        <CText style={styles.receiptId}>ID: {Date.now().toString().slice(-8)}</CText>
                                        <View style={styles.zigzagLine} />
                                    </Animated.View>

                                    <View style={[styles.slotCover, { backgroundColor: slotColor }]}>
                                        <View style={styles.slotHole} />
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <TouchableOpacity style={styles.closeBtnCircle} onPress={onClose}>
                        <MaterialIcons name="close" size={moderateScale(24)} color="#FFF" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    confettiPiece: {
        position: 'absolute',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    cardContainer: {
        width: width * 0.75,
        alignItems: 'center',
        overflow: 'visible',
    },
    crestContainer: {
        position: 'absolute',
        top: 0,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: moderateScale(120),
    },
    sealCircle: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: moderateScale(3),
        borderColor: '#FFF',
        backgroundColor: '#2CB67D',
        elevation: moderateScale(10),
        zIndex: 22,
    },
    sealInner: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(30),
        backgroundColor: '#FFF8E1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: moderateScale(1),
        borderColor: '#2CB67D',
    },
    wingLeft: {
        position: 'absolute',
        left: width * 0.1,
        top: moderateScale(30),
        width: moderateScale(70),
        height: moderateScale(35),
        backgroundColor: '#2CB67D',
        borderTopLeftRadius: moderateScale(40),
        borderBottomLeftRadius: moderateScale(10),
        transform: [{ rotate: '-15deg' }],
        borderWidth: moderateScale(2),
        borderColor: '#FFF',
        zIndex: 15,
    },
    wingRight: {
        position: 'absolute',
        right: width * 0.1,
        top: moderateScale(30),
        width: moderateScale(70),
        height: moderateScale(35),
        backgroundColor: '#2CB67D',
        borderTopRightRadius: moderateScale(40),
        borderBottomRightRadius: moderateScale(10),
        transform: [{ rotate: '15deg' }],
        borderWidth: moderateScale(2),
        borderColor: '#FFF',
        zIndex: 15,
    },
    card: {
        width: '100%',
        borderRadius: moderateScale(25),
        paddingTop: moderateScale(50),
        paddingBottom: moderateScale(20),
        paddingHorizontal: moderateScale(20),
        alignItems: 'center',
        borderWidth: moderateScale(3),
        borderColor: '#2CB67D',
        shadowColor: '#2CB67D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: moderateScale(20),
        elevation: moderateScale(15),
        backgroundColor: '#FFF8E1',
    },
    cardContent: {
        alignItems: 'center',
        width: '100%',
    },
    congratsText: {
        fontSize: moderateScale(22),
        fontWeight: '900',
        color: '#4E342E',
        marginBottom: moderateScale(8),
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        textAlign: 'center',
    },
    slotContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: moderateScale(15),
        position: 'relative',
        height: moderateScale(100),
    },
    slotCover: {
        width: '95%',
        height: moderateScale(20),
        borderRadius: moderateScale(10),
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: moderateScale(2) },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(2),
        elevation: moderateScale(5),
    },
    slotHole: {
        width: '92%',
        height: moderateScale(6),
        backgroundColor: '#2D1B1E',
        borderRadius: moderateScale(4),
    },
    receiptPaper: {
        width: '85%',
        height: moderateScale(85),
        backgroundColor: '#FFFDE7',
        position: 'absolute',
        top: moderateScale(10),
        borderBottomLeftRadius: moderateScale(10),
        borderBottomRightRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        padding: moderateScale(8),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: moderateScale(3) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(4),
        elevation: moderateScale(2),
    },
    bonusLabel: {
        fontSize: moderateScale(10),
        color: '#8D6E63',
        marginBottom: moderateScale(2),
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    bonusValue: {
        fontSize: moderateScale(26),
        color: '#3E2723',
        fontWeight: '900',
        textAlign: 'center',
    },
    receiptId: {
        marginTop: moderateScale(5),
        fontSize: moderateScale(8),
        color: '#A1887F',
        textAlign: 'center',
    },
    zigzagLine: {
        position: 'absolute',
        bottom: moderateScale(5),
        width: '90%',
        height: moderateScale(2),
        borderStyle: 'dashed',
        borderWidth: moderateScale(1),
        borderColor: '#D7CCC8',
        borderRadius: moderateScale(1)
    },
    closeBtnCircle: {
        position: 'absolute',
        top: moderateScale(8),
        right: moderateScale(8),
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: 'rgba(78, 52, 46, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
});

export default WelcomeBonus;
