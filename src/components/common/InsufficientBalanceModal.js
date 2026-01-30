import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const { height: screenHeight } = Dimensions.get('window');

const InsufficientBalanceModal = ({
    visible,
    onClose,
    requiredAmount = 0,
    cashBalance = 0,
    earningsBalance = 0,
    onAddMoney,
    onTransfer,
}) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(verticalScale(300))).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            slideAnim.setValue(verticalScale(300));
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: verticalScale(300),
            duration: 250,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    if (!visible) return null;

    const showTransferOption = earningsBalance > 0;

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={handleClose}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={handleClose}
                />
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [{ translateY: slideAnim }],
                            paddingBottom: Math.max(insets.bottom, verticalScale(20)),
                            backgroundColor: colors.surface,
                            borderColor: colors.border
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <MaterialIcons
                            name="account-balance-wallet"
                            size={moderateScale(48)}
                            color="#e32828ff"
                            style={styles.icon}
                        />
                        <CText style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>Insufficient Balance</CText>
                    </View>

                    <View style={[styles.infoContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                        <View style={styles.infoRow}>
                            <CText style={[styles.infoLabel, { color: colors.textSecondary }]}>Required Amount:</CText>
                            <CText style={[styles.infoValue, styles.requiredText]} numberOfLines={1}>
                                ₹{requiredAmount.toFixed(2)}
                            </CText>
                        </View>
                        <View style={styles.infoRow}>
                            <CText style={[styles.infoLabel, { color: colors.textSecondary }]}>Cash Balance:</CText>
                            <CText style={[styles.infoValue, { color: colors.textPrimary }]} numberOfLines={1}>₹{cashBalance.toFixed(2)}</CText>
                        </View>
                        {earningsBalance > 0 && (
                            <View style={styles.infoRow}>
                                <CText style={[styles.infoLabel, { color: colors.textSecondary }]}>Earnings Balance:</CText>
                                <CText style={[styles.infoValue, { color: colors.textPrimary }]} numberOfLines={1}>₹{earningsBalance.toFixed(2)}</CText>
                            </View>
                        )}
                    </View>

                    {showTransferOption && (
                        <TouchableOpacity
                            style={[styles.transferButton, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                            onPress={() => {
                                handleClose();
                                onTransfer?.();
                            }}
                            activeOpacity={0.8}
                        >
                            <CText style={[styles.transferButtonText, { color: colors.primary }]} numberOfLines={1} adjustsFontSizeToFit>
                                Transfer Money from Earnings Wallet
                            </CText>
                        </TouchableOpacity>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                            onPress={handleClose}
                        >
                            <CText style={[styles.cancelButtonText, { color: colors.textSecondary }]} numberOfLines={1} adjustsFontSizeToFit>Cancel</CText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.addMoneyButton, { backgroundColor: colors.primary }]}
                            onPress={() => {
                                handleClose();
                                onAddMoney?.();
                            }}
                        >
                            <CText style={[styles.addMoneyButtonText, { color: colors.black }]} numberOfLines={1} adjustsFontSizeToFit>Add Money</CText>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },
    modalBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        padding: moderateScale(20),
        paddingBottom: verticalScale(30),
        alignItems: 'center',
        borderWidth: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    icon: {
        marginBottom: verticalScale(10),
    },
    title: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: verticalScale(20),
        borderWidth: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(6),
    },
    infoLabel: {
        fontSize: moderateScale(14),
        fontWeight: '500',
    },
    infoValue: {
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    requiredText: {
        color: colors.error,
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    transferButton: {
        width: '100%',
        height: verticalScale(50),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(12),
        borderWidth: 1,
    },
    transferButtonText: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        paddingHorizontal: moderateScale(10),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: moderateScale(12),
    },
    button: {
        flex: 1,
        height: verticalScale(40),
        bottom: verticalScale(5),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    addMoneyButton: {
    },
    cancelButtonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    addMoneyButtonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});

export default InsufficientBalanceModal;
