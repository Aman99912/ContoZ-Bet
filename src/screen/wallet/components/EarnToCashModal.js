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
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import api from '@/api';

const formatCurrency = (value, decimals = 2) =>
    Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

// Truncation helper to ensure we don't exceed balance
const truncateToTwoDecimals = (num) => Math.floor(Number(num || 0) * 100) / 100;

const EarnToCashModal = ({
    visible,
    onClose,
    cashBalance = 0,
    earningsBalance = 0,
    availableToConvert = 0,
    onTransfer,
}) => {
    const [amount, setAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [gstPercent, setGstPercent] = useState(18);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => setShowAlert(false)
    });

    useEffect(() => {
        if (!visible) return;
        console.log('[EarnToCashModal] Balances:', {
            cashBalance,
            earningsBalance,
            availableToConvert,
            gstPercent,
        });
    }, [visible, cashBalance, earningsBalance, availableToConvert, gstPercent]);

    useEffect(() => {
        if (!visible) return;
        const loadGst = async () => {
            try {
                const res = await api.get('/api/gst');
                const igst = res?.data?.data?.IGST;
                if (typeof igst === 'number') {
                    setGstPercent(igst);
                }
            } catch (err) {
                // Keep default GST if request fails
                console.log('[EarnToCashModal] GST fetch failed, using default 18%');
            }
        };
        loadGst();
    }, [visible]);

    useEffect(() => {
        if (!visible) {
            setAmount('');
            setSelectedPreset(null);
        }
    }, [visible]);

    const amountNumber = useMemo(() => Number(amount || 0), [amount]);
    const gstAmount = useMemo(
        () => amountNumber * (gstPercent / 100),
        [amountNumber, gstPercent],
    );
    const debitTotal = useMemo(() => amountNumber + gstAmount, [amountNumber, gstAmount]);
    const maxAmount = useMemo(() => {
        const rawMax = availableToConvert / (1 + gstPercent / 100);
        // Use a tiny buffer to handle floating point precision in reverse calculation
        return Math.max(truncateToTwoDecimals(rawMax - 0.0001), 0);
    }, [availableToConvert, gstPercent]);

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
        amountNumber >= 10 &&
        amountNumber <= 100000 &&
        amountNumber > 0 &&
        amountNumber <= maxAmount + 0.001 &&
        debitTotal <= availableToConvert + 0.001;

    const handleTransfer = async () => {
        if (isSubmitting) return;
        const amountValue = Number(amount || 0);
        if (!Number.isFinite(amountValue) || amountValue <= 0) {
            setAlertConfig({
                title: 'Invalid Amount',
                message: 'Please enter a valid amount to transfer.',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
            return;
        }
        if (amountValue < 10 || amountValue > 100000) {
            setAlertConfig({
                title: 'Invalid Amount',
                message: 'Amount must be between ₹10 and ₹100,000.',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
            return;
        }
        if (amountValue > maxAmount + 0.001 || debitTotal > availableToConvert + 0.001) {
            setAlertConfig({
                title: 'Insufficient Balance',
                message: 'Your Earnings Wallet balance is not enough for this transfer including GST.',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
            return;
        }

        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
            setAlertConfig({
                title: 'Unauthorized',
                message: 'Please log in again to continue.',
                onConfirm: () => {
                    setShowAlert(false);
                    onClose();
                    // Optional: navigate to login
                }
            });
            setShowAlert(true);
            return;
        }

        console.log('[EarnToCashModal] Starting transfer', {
            amount: amountValue,
            gstPercent,
            debitTotal,
        });

        setIsSubmitting(true);
        try {
            const res = await api.post(
                '/api/wallet-transfer/earnings-to-cash',
                { amount: amountValue },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            console.log('[EarnToCashModal] Transfer success', res?.data);
            setAlertConfig({
                title: 'Success',
                message: 'Transfer completed successfully!',
                onConfirm: () => {
                    setShowAlert(false);
                    onClose();
                }
            });
            setShowAlert(true);
            setAmount('');
            setSelectedPreset(null);
            onTransfer?.(res?.data);
        } catch (err) {
            console.log('[EarnToCashModal] Transfer failed', {
                status: err?.response?.status,
                message: err?.response?.data?.message || err?.message,
            });
            const apiMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error?.message ||
                err?.message;
            const title = err?.response?.status === 400 ? 'Transfer Failed' : 'Error';
            setAlertConfig({
                title: title,
                message: apiMessage || 'Unable to complete transfer.',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                    <SafeAreaView style={styles.sheet} edges={['bottom']}>
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.content}
                        >
                            <View style={styles.dragHandle} />

                            <View style={styles.headerRow}>
                                <CText style={styles.headerTitle}>Earnings → Cash</CText>
                            </View>

                            <CText style={styles.headerSubtitle}>
                                This is a one-way transfer. Money moved to Cash cannot be moved back.
                            </CText>

                            <View style={styles.walletRow}>
                                <View style={styles.walletMini}>
                                    <CText style={styles.walletMiniLabel}>Cash</CText>
                                    <CText style={styles.walletMiniAmount}>₹{formatCurrency(cashBalance, 2)}</CText>
                                </View>
                                <View style={styles.walletMini}>
                                    <CText style={styles.walletMiniLabel}>Earnings</CText>
                                    <CText style={styles.walletMiniAmount}>₹{formatCurrency(earningsBalance, 2)}</CText>
                                </View>
                            </View>

                            <View style={styles.sectionHeaderRow}>
                                <CText style={styles.sectionTitle}>Amount to add to Cash</CText>
                            </View>
                            <CText style={styles.sectionSubtitle}>
                                Available to convert: ₹{formatCurrency(availableToConvert, 2)}
                            </CText>

                            <View style={styles.presetRow}>
                                {[25, 50, 75].map(value => (
                                    <TouchableOpacity
                                        key={value}
                                        onPress={() => handlePreset(value)}
                                        style={[
                                            styles.presetChip,
                                            selectedPreset === value && styles.presetChipActive,
                                        ]}
                                    >
                                        <CText
                                            style={[
                                                styles.presetText,
                                                selectedPreset === value && styles.presetTextActive,
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
                                    style={styles.amountInput}
                                />
                                <TouchableOpacity onPress={handleMax} style={styles.maxButton}>
                                    <CText style={styles.maxText}>Max</CText>
                                </TouchableOpacity>
                            </View>

                            <CText style={styles.helperText}>
                                We'll debit Earnings by amount + GST and credit Cash by amount.
                            </CText>

                            <View style={styles.summaryCard}>
                                <View style={styles.summaryRow}>
                                    <CText style={styles.summaryLabel}>Credit to Cash</CText>
                                    <CText style={styles.summaryValue}>
                                        {amountNumber > 0 ? `₹${formatCurrency(amountNumber, 2)}` : '—'}
                                    </CText>
                                </View>
                                <View style={styles.summaryRow}>
                                    <CText style={styles.summaryLabel}>GST ({gstPercent}%)</CText>
                                    <CText style={styles.summaryValue}>
                                        {amountNumber > 0 ? `₹${formatCurrency(gstAmount, 2)}` : '—'}
                                    </CText>
                                </View>
                                <View style={styles.summaryRow}>
                                    <CText style={styles.summaryLabel}>Debit from Earnings</CText>
                                    <CText style={styles.summaryValue}>
                                        {amountNumber > 0 ? `₹${formatCurrency(debitTotal, 2)}` : '—'}
                                    </CText>
                                </View>
                            </View>

                            <View style={styles.noteBox}>
                                <CText style={styles.noteText}>
                                    Note: This is a one-way transaction. Transfers are final and cannot be reversed.
                                </CText>
                            </View>

                            <View style={styles.footerRow}>
                                <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                                    <CText style={styles.cancelText}>Cancel</CText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleTransfer}
                                    style={[
                                        styles.transferBtn,
                                        (!isAmountValid || isSubmitting) && styles.transferBtnDisabled,
                                    ]}
                                    disabled={!isAmountValid || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <CText style={styles.transferText}>Transfer</CText>
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
        </Modal>
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
        backgroundColor: colors.surface,
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
        backgroundColor: colors.border,
        marginBottom: verticalScale(12),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(8),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
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
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    walletMiniLabel: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        marginBottom: verticalScale(4),
    },
    walletMiniAmount: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: colors.textPrimary,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.textPrimary,
    },
    sectionSubtitle: {
        fontSize: moderateScale(11),
        color: colors.textSecondary,
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
        borderColor: colors.border,
        paddingVertical: moderateScale(8),
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    presetChipActive: {
        borderColor: colors.primary,
        backgroundColor: colors.surface,
    },
    presetText: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        fontWeight: '600',
    },
    presetTextActive: {
        color: colors.primary,
    },
    amountInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        backgroundColor: colors.background,
    },
    maxButton: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(16),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    maxText: {
        fontSize: moderateScale(12),
        color: colors.textPrimary,
        fontWeight: '600',
    },
    helperText: {
        fontSize: moderateScale(11),
        color: colors.textSecondary,
        marginBottom: verticalScale(10),
    },
    summaryCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        backgroundColor: colors.background,
        marginBottom: verticalScale(10),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(6),
    },
    summaryLabel: {
        fontSize: moderateScale(12),
        color: colors.textPrimary,
    },
    summaryValue: {
        fontSize: moderateScale(12),
        color: colors.textPrimary,
        fontWeight: '600',
    },
    noteBox: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        backgroundColor: colors.surface,
        marginBottom: verticalScale(12),
    },
    noteText: {
        fontSize: moderateScale(11),
        color: colors.textSecondary,
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
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    cancelText: {
        fontSize: moderateScale(13),
        color: colors.textPrimary,
        fontWeight: '600',
    },
    transferBtn: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(18),
        borderRadius: moderateScale(18),
        backgroundColor: colors.primary,
    },
    transferBtnDisabled: {
        backgroundColor: colors.textSecondary,
        opacity: 0.5,
    },
    transferText: {
        fontSize: moderateScale(13),
        color: colors.black,
        fontWeight: '600',
    },
});

export default EarnToCashModal;
