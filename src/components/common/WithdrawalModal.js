import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';

// ... imports

const WithdrawalModal = ({
    visible,
    onClose,
    onSubmit,
    balance = 0,
    loading = false,
    minAmount = 100, // Fallback
    accountDetails,
    type, // 'bank' or 'upi'
}) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { config } = useApp(); // Get config from context

    // Extract dynamic config values
    const dynamicMin = config?.withdrawal?.min_withdrawal || minAmount;
    const dynamicMax = config?.withdrawal?.max_withdrawal || 10000000;
    const txCharge = config?.withdrawal?.tx_charge || 0;

    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (visible) {
            setAmount('');
            setError('');
            setIsChecked(false);
        }
    }, [visible]);

    const handleAmountChange = (text) => {
        setAmount(text);
        setError('');
    };

    const handleTermsPress = () => {
        onClose(); // Close modal to navigate
        navigation.navigate('TermsAndConditions');
    };

    const handleSubmit = () => {
        const numAmount = parseFloat(amount);

        if (!amount) {
            setError('Please enter an amount');
            return;
        }

        if (isNaN(numAmount)) {
            setError('Invalid amount');
            return;
        }

        if (numAmount < dynamicMin) {
            setError(`Minimum withdrawal amount is ₹${dynamicMin}`);
            return;
        }

        if (numAmount > dynamicMax) {
            setError(`Maximum withdrawal amount is ₹${dynamicMax}`);
            return;
        }

        // Logic check: does user need balance >= amount + charge? 
        // Typically withdrawal amount is deducted from wallet, and charge is either deducted additionally or part of it.
        // Assuming: User requests 100, we check if they have 100. Backend handles charge deduction.
        // Or if charge is extra: if (numAmount + txCharge > balance)...
        // Usually in betting apps: User enters 100. 100 is deducted. User receives 95 (if 5% charge).
        // Let's assume standard behavior: check purely against balance for now.

        if (numAmount > balance) {
            setError('Insufficient wallet balance');
            return;
        }

        if (!isChecked) {
            setError('Please agree to the Terms and Policy');
            return;
        }

        onSubmit(numAmount);
    };

    if (!visible) return null;

    const renderAccountDetails = () => {
        if (!accountDetails) return null;

        if (type === 'bank') {
            return (
                <View style={[styles.detailsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <CText style={[styles.detailLabel, { color: colors.textSecondary }]}>Transferring to</CText>
                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.inputBackground }]}>
                            <MaterialCommunityIcons name="bank" size={moderateScale(24)} color={colors.primary} />
                        </View>
                        <View style={styles.detailTextContent}>
                            <CText style={[styles.bankName, { color: colors.textPrimary }]}>{accountDetails.bankName}</CText>
                            <CText style={[styles.accountNumber, { color: colors.textSecondary }]}>**** {accountDetails.accountNumber.slice(-4)}</CText>
                            <CText style={[styles.holderName, { color: colors.textData }]}>{accountDetails.holderName}</CText>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={[styles.detailsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <CText style={[styles.detailLabel, { color: colors.textSecondary }]}>Transferring to</CText>
                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.inputBackground }]}>
                            <MaterialCommunityIcons name="qrcode-scan" size={moderateScale(24)} color={colors.primary} />
                        </View>
                        <View style={styles.detailTextContent}>
                            <CText style={[styles.bankName, { color: colors.textPrimary }]}>{accountDetails.name}</CText>
                            <CText style={[styles.accountNumber, { color: colors.textSecondary }]}>{accountDetails.upiId}</CText>
                        </View>
                    </View>
                </View>
            );
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <View style={styles.modalInner}>
                                    <View style={styles.header}>
                                        <CText style={[styles.title, { color: colors.textPrimary }]}>Confirm Withdrawal</CText>
                                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.surface }]}>
                                            <MaterialCommunityIcons name="close" size={moderateScale(24)} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                    </View>

                                    {renderAccountDetails()}

                                    <View style={[styles.balanceContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <View style={styles.balanceRow}>
                                            <MaterialCommunityIcons name="wallet-outline" size={moderateScale(20)} color={colors.textData} />
                                            <CText style={[styles.balanceLabel, { color: colors.textData }]}>Current Balance</CText>
                                        </View>
                                        <CText style={[styles.balanceValue, { color: colors.primary }]}>₹{balance.toFixed(2)}</CText>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CText style={[styles.inputLabel, { color: colors.textPrimary }]}>Withdrawal Amount</CText>
                                        <CInput
                                            placeholder="Enter Amount"
                                            value={amount}
                                            onChangeText={handleAmountChange}
                                            keyboardType="numeric"
                                            leftIcon="currency-inr"
                                            autoFocus={true}
                                            containerStyle={styles.amountInput}
                                            textStyle={styles.amountText}
                                        />
                                        {error ? <CText style={[styles.errorText, { color: colors.error }]}>{error}</CText> : null}
                                        <CText style={[styles.hintText, { color: colors.textSecondary }]}>
                                            Min: ₹{dynamicMin} {txCharge > 0 ? `| Charge: ${txCharge}%` : ''}
                                        </CText>
                                    </View>

                                    {/* Terms Checkbox */}
                                    <View style={styles.checkboxContainer}>
                                        <TouchableOpacity
                                            style={styles.checkbox}
                                            onPress={() => setIsChecked(!isChecked)}
                                            activeOpacity={0.8}
                                        >
                                            <MaterialCommunityIcons
                                                name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
                                                size={moderateScale(24)}
                                                color={isChecked ? colors.primary : colors.textSecondary}
                                            />
                                        </TouchableOpacity>
                                        <View style={styles.termsTextContainer}>
                                            <CText style={[styles.termsText, { color: colors.textSecondary }]}>I agree to the </CText>
                                            <TouchableOpacity onPress={handleTermsPress}>
                                                <CText style={[styles.termsLink, { color: colors.primary }]} numberOfLines={1}>Terms and Policy</CText>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.submitButton, { backgroundColor: colors.primary }, (loading || !isChecked) && styles.disabledButton]}
                                        onPress={handleSubmit}
                                        disabled={loading || !isChecked}
                                        activeOpacity={0.8}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={colors.black} size="small" />
                                        ) : (
                                            <View style={styles.btnContent}>
                                                <CText style={[styles.submitButtonText, { color: colors.black }]}>Proceed to Withdraw</CText>
                                                <MaterialCommunityIcons name="arrow-right" size={moderateScale(20)} color={colors.black} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.background,
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        borderWidth: 1,
        borderColor: colors.border,
        paddingBottom: verticalScale(30),
        minHeight: height * 0.65,
    },
    modalInner: {
        padding: moderateScale(24),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(24),
    },
    title: {
        fontSize: moderateScale(22),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    closeButton: {
        padding: moderateScale(8),
        backgroundColor: colors.surface,
        borderRadius: moderateScale(20),
    },
    detailsContainer: {
        backgroundColor: colors.surface,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: verticalScale(24),
        borderWidth: 1,
        borderColor: colors.border,
    },
    detailLabel: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        marginBottom: verticalScale(12),
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(12),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(16),
    },
    detailTextContent: {
        flex: 1,
    },
    bankName: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(2),
    },
    accountNumber: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        marginBottom: verticalScale(2),
    },
    holderName: {
        fontSize: moderateScale(12),
        color: colors.textData,
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
        backgroundColor: colors.surface,
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: verticalScale(24),
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    balanceLabel: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.textData,
    },
    balanceValue: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.primary,
    },
    inputContainer: {
        marginBottom: verticalScale(24),
    },
    inputLabel: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        marginBottom: verticalScale(12),
        fontWeight: '600',
    },
    amountInput: {
        height: verticalScale(60),
        borderRadius: moderateScale(14),
    },
    amountText: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: moderateScale(12),
        color: colors.error,
        marginTop: verticalScale(8),
        marginLeft: moderateScale(4),
    },
    hintText: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        marginTop: verticalScale(8),
        marginLeft: moderateScale(4),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(24),
        paddingHorizontal: moderateScale(4),
    },
    checkbox: {
        marginRight: moderateScale(12),
    },
    termsTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    termsText: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
    },
    termsLink: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(20),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    disabledButton: {
        opacity: 0.6,
        backgroundColor: '#444',
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    submitButtonText: {
        color: colors.black,
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default WithdrawalModal;
