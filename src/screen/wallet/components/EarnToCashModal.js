import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CustomAlert from '@/components/common/CustomAlert';
import api from '@/api';
import { Audio } from 'expo-av';

const formatCurrency = (value, decimals = 2) =>
    Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

// Truncation helper to ensure we don't exceed balance
const truncateToTwoDecimals = (num) => Math.floor(Number(num || 0) * 100) / 100;

import { useApp } from '@/context/AppContext';

// ...

const EarnToCashModal = ({
    // ... props ...
    visible,
    onClose,
    cashBalance = 0,
    earningsBalance = 0,
    availableToConvert = 0,
    onTransfer,
}) => {
    const { colors } = useTheme();
    const { config } = useApp(); // Get config

    // Dynamic minimum investment
    const minInvestment = config?.investment?.minimum_investment || 50;

    const [amount, setAmount] = useState('');
    // ... existing ...
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [gstPercent, setGstPercent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => setShowAlert(false)
    });

    const playWalletSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('@/sound/wallet.mp3')
            );
            await sound.playAsync();
        } catch (error) {
            console.log("Error playing wallet sound:", error);
        }
    };

    // ... existing useEffects ...
    useEffect(() => {
        if (!visible) return;
        console.log('[EarnToCashModal] Balances:', {
            cashBalance,
            earningsBalance,
            availableToConvert,
            gstPercent,
        });
    }, [visible, cashBalance, earningsBalance, availableToConvert, gstPercent]);

    // GST is fixed at 18% as per requirement
    // useEffect(() => {
    //     if (!visible) return;
    //     const loadGst = async () => {
    //         try {
    //             const res = await api.get('/api/gst');
    //             const igst = res?.data?.data?.IGST;
    //             if (typeof igst === 'number') {
    //                 setGstPercent(igst);
    //             }
    //         } catch (err) {
    //             // Keep default GST if request fails
    //             console.log('[EarnToCashModal] GST fetch failed, using default 18%');
    //         }
    //     };
    //     loadGst();
    // }, [visible]);

    useEffect(() => {
        if (!visible) {
            setAmount('');
            setSelectedPreset(null);
        }
    }, [visible]);

    const amountNumber = useMemo(() => Number(amount || 0), [amount]);

    // maxAmount is now just availableToConvert (minus buffer)
    const maxAmount = useMemo(() => {
        return Math.max(truncateToTwoDecimals(availableToConvert - 0.0001), 0);
    }, [availableToConvert]);

    const handlePreset = value => {
        setSelectedPreset(value);
        const nextAmount = truncateToTwoDecimals((maxAmount * value) / 100);
        setAmount(nextAmount > 0 ? String(nextAmount) : '');
    };

    const handleMax = () => {
        setSelectedPreset(null);
        setAmount(maxAmount > 0 ? String(maxAmount) : '');
    };

    const sanitizeAmountInput = text => {
        const cleaned = text.replace(/[^\d.]/g, '');
        const parts = cleaned.split('.');
        const integerPart = parts[0] || '';
        const decimalPart = parts[1] ? parts[1].slice(0, 2) : '';
        let next = integerPart;
        if (parts.length > 1) {
            next = `${integerPart || '0'}.${decimalPart}`;
        }
        if (next.startsWith('0') && !next.startsWith('0.')) {
            const parsed = parseInt(next, 10);
            return Number.isNaN(parsed) ? '' : String(parsed);
        }
        return next;
    };

    const isAmountValid =
        Number.isFinite(amountNumber) &&
        amountNumber >= minInvestment &&
        amountNumber <= 100000 &&
        amountNumber > 0 &&
        amountNumber <= maxAmount + 0.001;

    const handleTransfer = async () => {
        if (isSubmitting) return;
        const amountValue = Number(amount || 0);

        // Validation
        if (!Number.isFinite(amountValue) || amountValue <= 0) {
            setAlertConfig({
                title: 'Invalid Amount',
                message: 'Please enter a valid amount to transfer.',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
            return;
        }

        if (amountValue > availableToConvert) {
            setAlertConfig({
                title: 'Insufficient Balance',
                message: 'You do not have enough earnings for this transfer.',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
            return;
        }

        console.log('[EarnToCashModal] Starting transfer', { amount: amountValue });

        setIsSubmitting(true);
        try {
            // Updated API Call
            const { userAPI } = require('@/api/services'); // dynamic import or ensuring it's available
            // Note: In this file stricture, better to import at top, but to avoid replacing whole file I will use api instance or correct import if available.
            // The file imports 'api' from '@/api'. But I added the method to 'userAPI' in services.js.
            // I should verify imports. 'api' default export is axios instance usually. 
            // Better to use the direct path if I can't see the top imports easily in this context, 
            // but I see `import api from '@/api';` at line 22.
            // And I see `import { useApp } from '@/context/AppContext';`
            // I'll assume I need to use the endpoint directly or import userAPI.
            // Let's rely on the `api` instance which is likely the axios instance, and call post directly to be safe 
            // OR strictly correct it. 
            // Actually, I just added `transferMainToFund` to `userAPI` in `services.js`.
            // Let's use `api.post('/user/main-to-fund-transfer', ...)` directly to avoid import issues or add the import.
            // Adding import is cleaner but risky with `replace_file_content` if I miss exact lines.
            // I'll use the direct path `api.post('/user/main-to-fund-transfer', ...)` as `api` is already imported.

            const res = await api.post('/user/main-to-fund-transfer', { amount: amountValue });

            console.log('[EarnToCashModal] Transfer success', res?.data);
            playWalletSound();

            setAlertConfig({
                title: 'Success',
                message: res?.data?.message || 'Funds successfully transferred',
                onConfirm: () => {
                    setShowAlert(false);
                    onClose();
                    onTransfer?.(res?.data); // Callback to refresh wallets
                }
            });
            setShowAlert(true);
            setAmount('');
            setSelectedPreset(null);

        } catch (err) {
            console.log('[EarnToCashModal] Transfer failed', err);
            const apiMessage = err?.response?.data?.message || err?.message || 'Transfer failed';

            setAlertConfig({
                title: 'Transfer Failed',
                message: apiMessage,
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (<>
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            avoidKeyboard
            style={styles.modal}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardWrap}
                pointerEvents="box-none"
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView style={[styles.sheet, { backgroundColor: colors.surface }]} edges={['bottom']}>
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.content}
                        >
                            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />

                            <View style={styles.headerRow}>
                                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Main Wallet → Fund Wallet</CText>
                            </View>

                            <CText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                                This is a one-way transfer. Money moved to Cash cannot be moved back.
                            </CText>

                            <View style={styles.walletRow}>
                                <View style={[styles.walletMini, { borderColor: colors.border, backgroundColor: colors.background }]}>
                                    <CText style={[styles.walletMiniLabel, { color: colors.textSecondary }]}>Cash</CText>
                                    <CText style={[styles.walletMiniAmount, { color: colors.textPrimary }]}>₹{formatCurrency(cashBalance, 2)}</CText>
                                </View>
                                <View style={[styles.walletMini, { borderColor: colors.border, backgroundColor: colors.background }]}>
                                    <CText style={[styles.walletMiniLabel, { color: colors.textSecondary }]}>Earnings</CText>
                                    <CText style={[styles.walletMiniAmount, { color: colors.textPrimary }]}>₹{formatCurrency(earningsBalance, 2)}</CText>
                                </View>
                            </View>

                            <View style={styles.sectionHeaderRow}>
                                <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Amount to add to Cash</CText>
                            </View>
                            <CText style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                                Available to convert: ₹{formatCurrency(availableToConvert, 2)}
                            </CText>

                            <View style={styles.presetRow}>
                                {[25, 50, 75].map(value => (
                                    <TouchableOpacity
                                        key={value}
                                        onPress={() => handlePreset(value)}
                                        style={[
                                            styles.presetChip,
                                            { borderColor: colors.border, backgroundColor: colors.background },
                                            selectedPreset === value && { borderColor: colors.primary, backgroundColor: colors.surface },
                                        ]}
                                    >
                                        <CText
                                            style={[
                                                styles.presetText,
                                                { color: colors.textSecondary },
                                                selectedPreset === value && { color: colors.primary },
                                            ]}
                                        >
                                            {value}%
                                        </CText>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.amountRow}>
                                <TextInput
                                    value={amount}
                                    onChangeText={text => {
                                        setSelectedPreset(null);
                                        setAmount(sanitizeAmountInput(text));
                                    }}
                                    placeholder="e.g. 100"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="decimal-pad"
                                    style={[styles.amountInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
                                />
                                <TouchableOpacity onPress={handleMax} style={[styles.maxButton, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                                    <CText style={[styles.maxText, { color: colors.textPrimary }]}>Max</CText>
                                </TouchableOpacity>
                            </View>

                            <CText style={[styles.infoText, { color: colors.textSecondary }]}>
                                We'll debit Earnings and credit Cash by amount.
                            </CText>

                            <View style={[styles.summaryCard, { borderColor: colors.border, backgroundColor: colors.background }]}>
                                <View style={styles.summaryRow}>
                                    <CText style={[styles.summaryLabel, { color: colors.textPrimary }]}>Credit to Cash</CText>
                                    <CText style={[styles.summaryValue, { color: colors.textPrimary }]}>
                                        {amountNumber > 0 ? `₹${formatCurrency(amountNumber, 2)}` : '—'}
                                    </CText>
                                </View>
                                <View style={styles.summaryRow}>
                                    <CText style={[styles.summaryLabel, { color: colors.textPrimary }]}>GST ({gstPercent}%)</CText>
                                    <CText style={[styles.summaryValue, { color: colors.textPrimary }]}>
                                        {amountNumber > 0 ? `₹${formatCurrency(amountNumber, 2)}` : '—'}
                                    </CText>
                                </View>
                            </View>

                            <View style={[styles.noteBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                                <CText style={[styles.noteText, { color: colors.textSecondary }]}>
                                    Note: This is a one-way transaction. Transfers are final and cannot be reversed.
                                </CText>
                            </View>

                            <View style={styles.footerRow}>
                                <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, { borderColor: colors.border, backgroundColor: colors.background }]}>
                                    <CText style={[styles.cancelText, { color: colors.textPrimary }]}>Cancel</CText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleTransfer}
                                    style={[
                                        styles.transferBtn,
                                        { backgroundColor: colors.primary },
                                        (!isAmountValid || isSubmitting) && { backgroundColor: colors.textSecondary, opacity: 0.5 },
                                    ]}
                                    disabled={!isAmountValid || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color={colors.white} size="small" />
                                    ) : (
                                        <CText style={[styles.transferText, { color: colors.black }]}>Transfer</CText>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                showConfirm={true}
                confirmText="OK"
                onConfirm={alertConfig.onConfirm}
                onClose={() => setShowAlert(false)}
            />
        </Modal >
    </>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    keyboardWrap: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(10),
        maxHeight: '90%',
    },
    content: {
        paddingBottom: moderateScale(18),
    },
    dragHandle: {
        alignSelf: 'center',
        width: moderateScale(48),
        height: verticalScale(5),
        borderRadius: moderateScale(4),
        marginBottom: verticalScale(12),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(8),
    },
    headerTitle: {
        fontSize: moderateScale(19),
        fontWeight: '700',
    },
    headerSubtitle: {
        fontSize: moderateScale(12),
        lineHeight: moderateScale(16),
        marginBottom: verticalScale(12),
        textAlign: 'center',
    },
    walletRow: {
        flexDirection: 'row',
        gap: moderateScale(12),
        marginBottom: verticalScale(14),
    },
    walletMini: {
        flex: 1,
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        borderWidth: 1.3,
    },
    walletMiniLabel: {
        fontSize: moderateScale(12),
        marginBottom: verticalScale(4),
    },
    walletMiniAmount: {
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    sectionSubtitle: {
        fontSize: moderateScale(11),
        marginTop: verticalScale(2),
        marginBottom: verticalScale(10),
    },
    presetRow: {
        flexDirection: 'row',
        gap: moderateScale(10),
        marginBottom: verticalScale(10),
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        marginBottom: verticalScale(8),
    },
    presetChip: {
        flex: 1,
        borderRadius: moderateScale(10),
        borderWidth: 1,
        paddingVertical: moderateScale(8),
        alignItems: 'center',
    },
    presetText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
    amountInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        fontSize: moderateScale(14),
    },
    maxButton: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(16),
        borderRadius: moderateScale(10),
        borderWidth: 1,
    },
    maxText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
    helperText: {
        fontSize: moderateScale(11),
        marginBottom: verticalScale(10),
    },
    summaryCard: {
        borderWidth: 1,
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        marginBottom: verticalScale(10),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(6),
    },
    summaryLabel: {
        fontSize: moderateScale(12),
    },
    summaryValue: {
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
    noteBox: {
        borderWidth: 1,
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginBottom: verticalScale(12),
    },
    noteText: {
        fontSize: moderateScale(11),
        textAlign: 'center',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: moderateScale(10),
        paddingBottom: moderateScale(4),
    },
    cancelBtn: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(18),
        borderRadius: moderateScale(18),
        borderWidth: 1,
    },
    cancelText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
    transferBtn: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(18),
        borderRadius: moderateScale(18),
    },
    transferText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
});

export default EarnToCashModal;
