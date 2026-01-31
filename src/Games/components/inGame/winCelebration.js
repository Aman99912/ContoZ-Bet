import React, { useEffect, useRef, useMemo, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, Easing, Modal, ScrollView, Image, Platform, Alert } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { Audio } from 'expo-av';

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
            size: Math.random() * 6 + 4,
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
const WinCelebration = ({ visible, amount, onNewGame, onQuit, isWinner = true, entryFee = 0 }) => {
    // Animations
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const receiptSlide = useRef(new Animated.Value(-50)).current; // For sliding out the receipt

    // States
    const [isCapturing, setIsCapturing] = useState(false);
    const viewShotRef = useRef(null);

    // Config
    const totalPot = entryFee * 2;
    const platformCharge = entryFee > 0 ? (totalPot - amount) : 0; // Just for internal calc if needed

    // Golden Theme Colors
    const goldGradient = ['#FFF5C3', '#FDB931', '#F9D976', '#D4AF37']; // Luxury Gold
    const cardGradient = ['#FFF8E1', '#FFECB3']; // Creamy Gold card body
    const slotColor = '#4E342E'; // Dark brown for the slot
    const paperColor = '#FFFDE7'; // Light cream for paper

    useEffect(() => {
        if (visible) {
            // Card Entrance
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();

            // Receipt Slide Out Animation (after card appears)
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
            if (visible && isWinner) {
                try {
                    const { sound } = await Audio.Sound.createAsync(
                        require('@/sound/coin_sound_add.wav')
                    );
                    soundObject = sound;
                    await sound.playAsync();
                } catch (error) {
                    console.log("Error playing win sound:", error);
                    if (error && error.message) console.log("Error details:", error.message);
                }
            }
        };

        playSound();

        return () => {
            if (soundObject) {
                soundObject.unloadAsync();
            }
        };
    }, [visible, isWinner]);

    const handleShare = async () => {
        if (isCapturing) return;
        try {
            setIsCapturing(true);
            setTimeout(async () => {
                try {
                    const uri = await captureRef(viewShotRef, { format: 'png', quality: 0.9, result: 'tmpfile' });
                    await Share.open({
                        url: uri,
                        message: isWinner ? "Big Win! Beat my score on ContoZ-Bet!" : "Check out my game result on ContoZ-Bet!"
                    });
                } catch (e) { console.log(e); } finally { setIsCapturing(false); }
            }, 100);
        } catch (e) { setIsCapturing(false); }
    };

    const handleSaveImage = async () => {
        if (isCapturing) return;
        try {
            setIsCapturing(true);
            setTimeout(async () => {
                try {
                    const uri = await captureRef(viewShotRef, { format: 'png', quality: 1.0, result: 'tmpfile' });
                    const destPath = `${RNFS.DownloadDirectoryPath}/Win_${Date.now()}.png`;
                    if (Platform.OS === 'android') {
                        await RNFS.copyFile(uri, destPath);
                        await RNFS.scanFile(destPath);
                        Alert.alert("Saved!", "Image saved.");
                    } else { Share.open({ url: uri, saveToFiles: true }); }
                } catch (e) { Alert.alert("Error", "Failed to save."); } finally { setIsCapturing(false); }
            }, 100);
        } catch (e) { setIsCapturing(false); }
    };

    return (
        <Modal transparent visible={visible} onRequestClose={onQuit} animationType="none">
            <View style={styles.container}>
                <View style={styles.backdrop} />
                {isWinner && <Confetti visible={visible} />}

                <Animated.View style={[
                    styles.cardContainer,
                    { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
                ]}>
                    <ViewShot ref={viewShotRef} style={{ backgroundColor: 'transparent', alignItems: 'center', width: '100%', paddingTop: 70 }} options={{ result: 'base64' }}>

                        {/* Header Crest (Wings + Circle) - Partially outside the card */}
                        <View style={styles.crestContainer}>
                            {/* Wings (Simulated with Shapes) */}
                            <View style={styles.wingLeft} />
                            <View style={styles.wingRight} />

                            {/* Main Seal */}
                            <LinearGradient colors={goldGradient} style={styles.sealCircle}>
                                <View style={styles.sealInner}>
                                    <MaterialCommunityIcons name={isWinner ? "rocket-launch" : "emoticon-sad"} size={40} color="#8B4513" />
                                </View>
                            </LinearGradient>

                            {/* Ribbon Banner */}
                            <View style={styles.ribbonContainer}>
                                <Image
                                    style={styles.ribbonImage}
                                    resizeMode="contain"
                                    source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Gold_Ribbon.svg/2560px-Gold_Ribbon.svg.png" }} // Fallback or use a View shape if no asset
                                />
                                {/* Since we don't have Ribbon Asset, we use a styled text view acting as ribbon */}
                            </View>
                        </View>

                        {/* Main Card Body */}
                        <LinearGradient colors={cardGradient} style={styles.card}>


                            <View style={styles.cardContent}>
                                {/* Title */}
                                <CText style={styles.congratsText}>{isWinner ? "Congratulations" : "Game Over"}</CText>

                                {/* Result Badges */}
                                <View style={styles.badgeRow}>
                                    <View style={[styles.badge, { backgroundColor: isWinner ? '#4CAF50' : '#F44336' }]}>
                                        <CText style={styles.badgeText}>{isWinner ? "Victory" : "Defeat"}</CText>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: '#FF9800' }]}>
                                        <CText style={styles.badgeText}>Level 1</CText>
                                    </View>
                                </View>

                                {/* Receipt Slot Section */}
                                <View style={styles.slotContainer}>
                                    {/* The Receipt Paper (Animated) */}
                                    <Animated.View style={[
                                        styles.receiptPaper,
                                        { transform: [{ translateY: receiptSlide }] },
                                        { zIndex: 1 }
                                    ]}>
                                        <CText style={styles.bonusLabel}>Total Bonus</CText>
                                        <CText style={styles.bonusValue}>₹{amount.toFixed(2)}</CText>
                                        <CText style={styles.receiptId}>ID: {Date.now().toString().slice(-8)}</CText>

                                        {/* Zigzag bottom visual (simple dots/dashes) */}
                                        <View style={styles.zigzagLine} />
                                    </Animated.View>

                                    {/* The Slot Cover */}
                                    <View style={[styles.slotCover, { backgroundColor: slotColor }]}>
                                        <View style={styles.slotHole} />
                                    </View>
                                </View>

                                {/* Internal Share Button */}
                                {!isCapturing && (
                                    <View style={styles.internalActions}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={handleShare}>
                                            <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.shareBtnGold}>
                                                <MaterialCommunityIcons name="share-variant" size={20} color="#5D4037" />
                                                <CText style={styles.shareBtnText}>SHARE</CText>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </LinearGradient>
                    </ViewShot>

                    {/* Close Button (Moved Outside ViewShot) */}
                    {!isCapturing && (
                        <TouchableOpacity style={styles.closeBtnCircle} onPress={onQuit}>
                            <MaterialIcons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        // marginTop removed, spacing handled internally
        overflow: 'visible',
    },
    // Crest Styles
    crestContainer: {
        position: 'absolute',
        top: 0, // Reset to 0 (inside ViewShot top area)
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 120,
    },
    sealCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        backgroundColor: '#FFD700',
        elevation: 10,
        zIndex: 22,
    },
    sealInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF8E1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FDB931',
    },
    wingLeft: {
        position: 'absolute',
        left: width * 0.1,
        top: 30,
        width: 70,
        height: 35,
        backgroundColor: '#FFC107',
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 10,
        transform: [{ rotate: '-15deg' }],
        borderWidth: 2,
        borderColor: '#FFF',
        zIndex: 15,
    },
    wingRight: {
        position: 'absolute',
        right: width * 0.1,
        top: 30,
        width: 70,
        height: 35,
        backgroundColor: '#FFC107',
        borderTopRightRadius: 40,
        borderBottomRightRadius: 10,
        transform: [{ rotate: '15deg' }],
        borderWidth: 2,
        borderColor: '#FFF',
        zIndex: 15,
    },

    card: {
        width: '100%',
        borderRadius: 25,
        paddingTop: 50, // Reduced padding since crest is higher
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#E6C100',
        shadowColor: '#DAA520',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
        backgroundColor: '#FFF8E1', // Ensure bg color 
    },
    cardContent: {
        alignItems: 'center',
        width: '100%',
    },
    congratsText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#4E342E',
        marginBottom: 8,
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 15,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    // Receipt Slot
    slotContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15, // Reduced margin
        position: 'relative',
        height: 100, // Reduced height
    },
    slotCover: {
        width: '95%',
        height: 20, // Slightly smaller
        borderRadius: 10,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
    },
    slotHole: {
        width: '92%',
        height: 6,
        backgroundColor: '#2D1B1E',
        borderRadius: 4,
    },
    receiptPaper: {
        width: '85%',
        height: 85, // Reduced paper height
        backgroundColor: '#FFFDE7',
        position: 'absolute',
        top: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    bonusLabel: {
        fontSize: 10, // Smaller label
        color: '#8D6E63',
        marginBottom: 2,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    bonusValue: {
        fontSize: 26, // Smaller value
        color: '#3E2723',
        fontWeight: '900',
    },
    receiptId: {
        marginTop: 5,
        fontSize: 8,
        color: '#A1887F',
    },
    zigzagLine: {
        position: 'absolute',
        bottom: 5,
        width: '90%',
        height: 2,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D7CCC8',
        borderRadius: 1
    },

    internalActions: {
        width: '90%',
        marginBottom: 10,
    },
    shareBtnGold: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
        borderWidth: 1,
        borderColor: '#FFF',
        elevation: 3,
    },
    shareBtnText: {
        color: '#5D4037',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },

    footerText: {
        color: '#8D6E63',
        fontSize: 10,
        fontStyle: 'italic',
        marginBottom: 5,
    },
    closeBtnCircle: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24, // Smaller close button
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(78, 52, 46, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
});

export default WinCelebration;
