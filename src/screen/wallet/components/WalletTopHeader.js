import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale, scale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

const WalletTopHeader = ({ balance, cashBalance, earningsBalance, onAddMoney, onTransfer }) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const arrowTranslate = useRef(new Animated.Value(20)).current;
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const buttonRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    useEffect(() => {
        if (Number(earningsBalance) >= 0 && !hasAnimated.current) {
            hasAnimated.current = true;
            Animated.timing(arrowTranslate, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.elastic(1)),
                useNativeDriver: true,
            }).start();

            if (buttonRef.current) {
                setTimeout(() => {
                    buttonRef.current?.measureInWindow((x, y, width, height) => {
                        setTooltipPos({ x, y, width, height });
                        setShowTooltip(true);
                    });
                }, 100);
            }

            const timer = setTimeout(() => setShowTooltip(false), 5500);
            return () => clearTimeout(timer);
        }
    }, [earningsBalance]);

    const rotateInterpolation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <>
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <View style={styles.balanceRow}>
                    <View>
                        <CText style={styles.totalBalanceLabel}>Total balance</CText>
                        <CText style={styles.totalBalanceAmount}>₹{balance}</CText>
                    </View>
                    <TouchableOpacity style={styles.addMoneyPill} onPress={onAddMoney}>
                        <MaterialCommunityIcons name="plus" size={moderateScale(16)} color={colors.black} />
                        <CText style={styles.addMoneyPillText} numberOfLines={1}>Add Money</CText>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.walletCardsRow}>
                    <View style={[styles.walletCard, { marginRight: 8 }]}>
                        <CText style={styles.walletCardLabel}>Cash Wallet</CText>
                        <CText style={styles.walletCardAmount}>₹{cashBalance}</CText>
                        <CText style={styles.walletCardFooter}>Used for games</CText>
                    </View>

                    <View style={styles.transferContainer}>
                        <View style={styles.animationWrapper}>
                            <Animated.View
                                style={[
                                    styles.gradientRotation,
                                    { transform: [{ rotate: rotateInterpolation }] }
                                ]}
                            >
                                <LinearGradient
                                    colors={['transparent', colors.background, colors.primary, colors.background, 'transparent']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.fullSize}
                                />
                            </Animated.View>

                            <TouchableOpacity
                                ref={buttonRef}
                                style={styles.arrowButtonInside}
                                onPress={onTransfer}
                                activeOpacity={0.8}
                            >
                                <Animated.View style={{ transform: [{ translateX: arrowTranslate }] }}>
                                    <MaterialCommunityIcons name="arrow-left" size={moderateScale(22)} color={colors.primary} />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.walletCard, { marginLeft: 8 }]}>
                        <CText style={styles.walletCardLabel}>Earnings Wallet</CText>
                        <CText style={styles.walletCardAmount}>₹{earningsBalance}</CText>
                        <CText style={styles.walletCardFooter}>Withdraw / Transfer</CText>
                    </View>
                </View>
            </View>

            <Modal visible={showTooltip} transparent animationType="fade" onRequestClose={() => setShowTooltip(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTooltip(false)}>
                    <View style={[styles.tooltipModalContainer, { top: tooltipPos.y + tooltipPos.height }]}>
                        <View style={styles.tooltipContentWrapper}>
                            <View style={styles.tooltipArrow} />
                            <View style={styles.tooltipBubble}>
                                <CText style={styles.tooltipText}>Transfer Earnings to cash wallet</CText>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: colors.surface,
        // top: verticalScale(16),
        margin: moderateScale(16),
        padding: moderateScale(20),
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: verticalScale(-2),
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    totalBalanceLabel: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        marginBottom: 4,
    },
    totalBalanceAmount: {
        fontSize: moderateScale(32),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    addMoneyPill: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        borderRadius: moderateScale(24),
        gap: moderateScale(4),
    },
    addMoneyPillText: {
        color: colors.black,
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: verticalScale(16),
    },
    walletCardsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    walletCard: {
        flex: 1,
        alignItems: 'center',
    },
    walletCardLabel: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        marginBottom: 4,
        textAlign: 'center',
    },
    walletCardAmount: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 2,
        textAlign: 'center',
    },
    walletCardFooter: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        textAlign: 'center',
    },
    transferContainer: {
        alignItems: 'center',
        marginHorizontal: moderateScale(10),
        justifyContent: 'center',
    },
    animationWrapper: {
        width: moderateScale(42),
        height: moderateScale(42),
        borderRadius: moderateScale(21),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        overflow: 'hidden',
    },
    gradientRotation: {
        position: 'absolute',
        width: '200%',
        height: '200%',
    },
    fullSize: {
        flex: 1,
    },
    arrowButtonInside: {
        width: moderateScale(38),
        height: moderateScale(38),
        borderRadius: moderateScale(19),
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
    },
    tooltipModalContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    tooltipContentWrapper: {
        alignItems: 'center',
    },
    tooltipArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: moderateScale(6),
        borderRightWidth: moderateScale(6),
        borderBottomWidth: verticalScale(8),
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.primary,
        marginBottom: -1,
    },
    tooltipBubble: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: moderateScale(6),
        paddingHorizontal: moderateScale(12),
        paddingVertical: verticalScale(6),
        minWidth: moderateScale(200),
    },
    tooltipText: {
        color: colors.primary,
        fontSize: moderateScale(12),
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default WalletTopHeader;
