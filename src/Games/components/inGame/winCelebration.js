import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

const WinCelebration = ({ visible, amount, onNewGame, onQuit, isWinner = true }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.spring(rotateAnim, {
                        toValue: 0,
                        friction: 4,
                        useNativeDriver: true,
                    })
                ])
            ]).start();
        } else {
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '10deg']
    });

    return (
        <Modal
            isVisible={visible}
            backdropOpacity={0.8}
            animationIn="zoomIn"
            animationOut="zoomOut"
            useNativeDriver
        >
            <View style={styles.container}>
                <Animated.View style={[
                    styles.card,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }, { rotate: rotation }]
                    },
                    isWinner ? styles.winCard : styles.lostCard
                ]}>
                    <View style={styles.content}>
                        {/* 3D Depth Top */}
                        <View style={styles.cardDepth} />

                        <View style={styles.mainBody}>
                            <View style={[styles.iconContainer, { backgroundColor: isWinner ? gamesColor.primary + '20' : '#FF3B3F20' }]}>
                                <MaterialCommunityIcons
                                    name={isWinner ? "trophy" : "emoticon-sad-outline"}
                                    size={moderateScale(60)}
                                    color={isWinner ? gamesColor.primary : "#FF3B3F"}
                                />
                            </View>

                            <CText style={styles.title}>
                                {isWinner ? "YOU WON!" : "GAME OVER"}
                            </CText>

                            <View style={styles.prizeBox}>
                                <CText style={styles.prizeLabel}>{isWinner ? "WINNINGS" : "ENTRY FEE LOST"}</CText>
                                <CText style={[styles.prizeValue, { color: isWinner ? gamesColor.primary : "#FF3B3F" }]}>
                                    ₹{amount}
                                </CText>
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.btnSecondary} onPress={onQuit}>
                                    <CText style={styles.btnTextSecondary}>Quit</CText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btnPrimary, { backgroundColor: isWinner ? gamesColor.primary : gamesColor.accent }]}
                                    onPress={onNewGame}
                                >
                                    <CText style={styles.btnTextPrimary}>New Match</CText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
    card: {
        width: width * 0.85,
        backgroundColor: '#1E1E2E',
        borderRadius: moderateScale(25),
        borderWidth: 2,
        overflow: 'hidden',
    },
    winCard: {
        borderColor: gamesColor.primary + '80',
        shadowColor: gamesColor.primary,
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    lostCard: {
        borderColor: '#FF3B3F80',
        shadowColor: '#FF3B3F',
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 20,
    },
    content: {
        width: '100%',
    },
    cardDepth: {
        height: verticalScale(10),
        backgroundColor: '#00000040',
        width: '100%',
    },
    mainBody: {
        padding: moderateScale(25),
        alignItems: 'center',
    },
    iconContainer: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    title: {
        fontSize: moderateScale(32),
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
        marginBottom: verticalScale(10),
    },
    prizeBox: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
        backgroundColor: '#00000030',
        paddingHorizontal: moderateScale(30),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(15),
    },
    prizeLabel: {
        fontSize: moderateScale(12),
        color: '#FFFFFF80',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    prizeValue: {
        fontSize: moderateScale(36),
        fontWeight: '900',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: moderateScale(15),
    },
    btnPrimary: {
        flex: 1,
        height: verticalScale(50),
        borderRadius: moderateScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#00000040',
    },
    btnSecondary: {
        flex: 1,
        height: verticalScale(50),
        backgroundColor: '#FFFFFF10',
        borderRadius: moderateScale(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF20',
    },
    btnTextPrimary: {
        color: '#FFF',
        fontSize: moderateScale(16),
        fontWeight: '900',
    },
    btnTextSecondary: {
        color: '#FFFFFF80',
        fontSize: moderateScale(16),
        fontWeight: '900',
    },
});

export default WinCelebration;
