import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CInput from '@/components/common/CInput';
import CCard from '@/components/common/CCard';
import CustomAlert from '@/components/common/CustomAlert';
import WithdrawalModal from '@/components/common/WithdrawalModal';
import { useApp } from '@/context/AppContext';
import { walletAPI } from '@/api/services';

const { width } = Dimensions.get('window');

const BankDetailsScreen = ({ navigation }) => {
    const { saveBank, savedBanks, removeBank, totalBalance, refreshWallets } = useApp();
    const [viewMode, setViewMode] = useState(savedBanks && savedBanks.length > 0 ? 'list' : 'add'); // 'list' or 'add'

    // Withdrawal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [withdrawalLoading, setWithdrawalLoading] = useState(false);

    // Form State
    const [holderName, setHolderName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!holderName.trim()) newErrors.holderName = 'Holder name is required';
        if (!accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
        if (accountNumber !== confirmAccountNumber) newErrors.confirmAccountNumber = 'Account numbers do not match';
        if (!ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
        if (!bankName.trim()) newErrors.bankName = 'Bank name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const success = await saveBank({ holderName, accountNumber, ifscCode, bankName });
            if (success) {
                setLoading(false);
                setAlertMessage('Bank details saved successfully!');
                setShowAlert(true);
                // Clear Form
                setHolderName('');
                setAccountNumber('');
                setConfirmAccountNumber('');
                setIfscCode('');
                setBankName('');

                // Switch to list
                setTimeout(() => {
                    setShowAlert(false);
                    setViewMode('list');
                }, 1000);
            } else {
                setLoading(false);
                setAlertMessage('Failed to save details.');
                setShowAlert(true);
            }

        } catch (error) {
            console.error('Error saving bank details:', error);
            setLoading(false);
            setAlertMessage('Failed to save details. Please try again.');
            setShowAlert(true);
        }
    };

    const handleDelete = (index) => {
        removeBank(index);
        // If empty, layout handles it (or could force add mode)
    };

    const handleCardPress = (bank) => {
        setSelectedBank(bank);
        setModalVisible(true);
    };

    const handleWithdrawalSubmit = async (amount) => {
        setWithdrawalLoading(true);
        try {
            const withdrawalData = {
                type: 'bank',
                amount: amount,
                bank_details: selectedBank,
            };

            const response = await walletAPI.withdraw(withdrawalData);
            console.log('Withdrawal Response:', response);

            setModalVisible(false);
            setWithdrawalLoading(false);
            setAlertMessage('Withdrawal request submitted successfully!');
            setShowAlert(true);

            // Refresh balance
            refreshWallets();

        } catch (error) {
            console.error('Withdrawal Error:', error);
            setWithdrawalLoading(false);
            const msg = error.response?.data?.message || 'Withdrawal failed. Please try again.';
            // If it's a "real" error, we might want to keep the modal open or show an alert on top
            // For now, close modal and show alert
            setModalVisible(false);
            setAlertMessage(msg);
            setShowAlert(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.blobTop} />
            <View style={styles.blobBottom} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={moderateScale(28)} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <CText style={styles.headerTitle} numberOfLines={1}>{viewMode === 'list' ? 'Saved Accounts' : 'Add Bank'}</CText>
                    <View style={styles.headerPlaceholder} />
                </View>

                {viewMode === 'list' ? (
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {savedBanks.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.9}
                                onPress={() => handleCardPress(item)}
                            >
                                <CCard style={styles.savedCard}>
                                    <View style={styles.cardContent}>
                                        <View style={styles.iconContainer}>
                                            <MaterialCommunityIcons name="bank-outline" size={moderateScale(24)} color={colors.primary} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <CText style={styles.cardTitle}>{item.bankName}</CText>
                                            <CText style={styles.cardSubtitle}>**** {item.accountNumber.slice(-4)}</CText>
                                            <CText style={[styles.cardSubtitle, { fontSize: moderateScale(10), marginTop: 2 }]}>{item.holderName}</CText>
                                        </View>
                                        <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
                                            <MaterialCommunityIcons name="trash-can-outline" size={moderateScale(20)} color={colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                </CCard>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setViewMode('add')}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="plus" size={moderateScale(20)} color={colors.black} />
                            <CText style={styles.addButtonText}>Add New Account</CText>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                            >
                                <CCard style={styles.formCard}>
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Account Holder Name"
                                            value={holderName}
                                            onChangeText={setHolderName}
                                            autoCapitalize="words"
                                            leftIcon="account-outline"
                                        />
                                        {errors.holderName && <CText style={styles.errorText}>{errors.holderName}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Bank Name"
                                            value={bankName}
                                            onChangeText={setBankName}
                                            autoCapitalize="words"
                                            leftIcon="bank-outline"
                                        />
                                        {errors.bankName && <CText style={styles.errorText}>{errors.bankName}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Account Number"
                                            value={accountNumber}
                                            onChangeText={setAccountNumber}
                                            keyboardType="number-pad"
                                            leftIcon="numeric"
                                            secureTextEntry={true}
                                        />
                                        {errors.accountNumber && <CText style={styles.errorText}>{errors.accountNumber}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Confirm Account Number"
                                            value={confirmAccountNumber}
                                            onChangeText={setConfirmAccountNumber}
                                            keyboardType="number-pad"
                                            leftIcon="numeric"
                                        />
                                        {errors.confirmAccountNumber && <CText style={styles.errorText}>{errors.confirmAccountNumber}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="IFSC Code"
                                            value={ifscCode}
                                            onChangeText={(text) => setIfscCode(text.toUpperCase())}
                                            autoCapitalize="characters"
                                            leftIcon="code-tags"
                                            maxLength={11}
                                        />
                                        {errors.ifscCode && <CText style={styles.errorText}>{errors.ifscCode}</CText>}
                                    </View>

                                    <View style={styles.buttonRow}>
                                        {savedBanks.length > 0 && (
                                            <TouchableOpacity
                                                style={styles.cancelButton}
                                                onPress={() => setViewMode('list')}
                                            >
                                                <CText style={styles.cancelButtonText}>Cancel</CText>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={[styles.saveButton, loading && styles.disabledButton, { flex: savedBanks.length > 0 ? 1 : 0, width: savedBanks.length > 0 ? undefined : '100%' }]}
                                            onPress={handleSave}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color={colors.black} size="small" />
                                            ) : (
                                                <CText style={styles.saveButtonText}>Save Bank Details</CText>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </CCard>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                )}

                <WithdrawalModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={handleWithdrawalSubmit}
                    balance={totalBalance}
                    loading={withdrawalLoading}
                    accountDetails={selectedBank}
                    type="bank"
                />

                <CustomAlert
                    visible={showAlert}
                    title={viewMode === 'add' && !alertMessage.includes('Failed') ? "Success" : "Alert"}
                    message={alertMessage}
                    showConfirm={true}
                    confirmText="OK"
                    onClose={() => setShowAlert(false)}
                    onConfirm={() => setShowAlert(false)}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        position: 'relative',
    },
    safeArea: {
        flex: 1,
    },
    blobTop: {
        position: 'absolute',
        top: -width * 0.4,
        right: -width * 0.2,
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        backgroundColor: colors.primary,
        opacity: 0.08,
    },
    blobBottom: {
        position: 'absolute',
        bottom: -width * 0.3,
        left: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: colors.primary,
        opacity: 0.05,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        marginBottom: verticalScale(20),
        marginTop: verticalScale(10),
    },
    backButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    headerPlaceholder: {
        width: moderateScale(40),
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: verticalScale(20),
    },
    formCard: {
        paddingVertical: verticalScale(24),
        paddingHorizontal: moderateScale(20),
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputContainer: {
        marginBottom: verticalScale(8),
    },
    errorText: {
        fontSize: moderateScale(12),
        color: colors.error,
        marginTop: verticalScale(4),
        marginLeft: moderateScale(4),
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        marginTop: verticalScale(10),
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    disabledButton: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: colors.black,
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default BankDetailsScreen;
