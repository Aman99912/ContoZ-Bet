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
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CInput from '@/components/common/CInput';
import CCard from '@/components/common/CCard';
import CustomAlert from '@/components/common/CustomAlert';
import WithdrawalModal from '@/components/common/WithdrawalModal';
import { useApp } from '@/context/AppContext';
import { walletAPI, userAPI } from '@/api/services';

const { width } = Dimensions.get('window');

const BankDetailsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { saveBank, savedBanks, removeBank, totalBalance, refreshWallets, refreshPaymentDetails, wallets } = useApp();
    const [viewMode, setViewMode] = useState('list'); // Default to list because we load from API

    // Calculate Usage Balance: Main Wallet (Winning Amount)
    const winningBalance = wallets.find(w => w.slug === 'main_wallet')?.value || 0;

    // Refresh on mount to ensure fresh data
    React.useEffect(() => {
        refreshPaymentDetails();
    }, []);

    // Effect to switch to add mode if no banks (optional, user preferred just listing what's there and handling add manually if needed)
    // But importantly, if we have banks, we force list mode initially.

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
    const [branch, setBranch] = useState('');
    const [accountType, setAccountType] = useState('saving'); // Default to saving
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
        if (!branch.trim()) newErrors.branch = 'Branch name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                bankName: bankName.trim(),
                accountNumber: Number(accountNumber), // Ensure number if expected as number
                ifsc: ifscCode.trim().toUpperCase(),
                holder: holderName.trim(),
                ac_type: accountType,
                branch: branch.trim()
            };

            const response = await userAPI.addBankDetails(payload);
            console.log('Add Bank Response:', response);

            setLoading(false);
            setAlertMessage('Bank details saved successfully!');
            setShowAlert(true);

            // Clear Form
            setHolderName('');
            setAccountNumber('');
            setConfirmAccountNumber('');
            setIfscCode('');
            setBankName('');
            setBranch('');
            setAccountType('saving');

            // Switch to list (and refresh list if we had an API for getBanks, but for now assuming savedBanks context might need update if it was real)
            // Ideally we should call a fetchBanks() here.
            // Since User only asked for add-bank-details, I'll assume list refresh logic is handled or we just switch back.

            // Refresh data
            await refreshPaymentDetails();

            setTimeout(() => {
                setShowAlert(false);
                setViewMode('list');
            }, 1000);

        } catch (error) {
            console.error('Error saving bank details:', error);
            setLoading(false);
            const msg = error.response?.data?.message || 'Failed to save details. Please try again.';
            setAlertMessage(msg);
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.blobTop, { backgroundColor: colors.primary }]} />
            <View style={[styles.blobBottom, { backgroundColor: colors.primary }]} />

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
                    <CText style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>{viewMode === 'list' ? 'Saved Accounts' : 'Add Bank'}</CText>
                    <View style={styles.headerPlaceholder} />
                </View>

                {viewMode === 'list' ? (
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {savedBanks.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.9}
                                onPress={() => handleCardPress(item)}
                                style={styles.cardWrapper}
                            >
                                <CCard style={[styles.premiumCard, { backgroundColor: colors.surface }]}>
                                    <View style={[styles.cardBgOverlay, { backgroundColor: colors.primary }]} />

                                    <View style={styles.cardHeader}>
                                        <View style={styles.chipContainer}>
                                            <View style={[styles.cardChip, { backgroundColor: colors.primary + '40' }]} />
                                            <View style={styles.contactlessIcon}>
                                                <MaterialCommunityIcons name="wifi" size={moderateScale(16)} color={colors.textSecondary} style={{ transform: [{ rotate: '90deg' }] }} />
                                            </View>
                                        </View>
                                        <CText style={[styles.cardBankName, { color: colors.textPrimary }]} numberOfLines={1}>
                                            {item.bankName?.toUpperCase()}
                                        </CText>
                                    </View>

                                    <View style={styles.cardNumberContainer}>
                                        <CText style={[styles.premiumCardNumber, { color: colors.textPrimary }]}>
                                            {`****  ****  ****  ${item.accountNumber.slice(-4)}`}
                                        </CText>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <View style={styles.cardInfoItem}>
                                            <CText style={[styles.cardInfoLabel, { color: colors.textSecondary }]}>CARD HOLDER</CText>
                                            <CText style={[styles.cardInfoValue, { color: colors.textPrimary }]} numberOfLines={1}>
                                                {item.holderName?.toUpperCase()}
                                            </CText>
                                        </View>
                                        <View style={styles.cardTypeIcon}>
                                            <MaterialCommunityIcons name="credit-card-chip-outline" size={moderateScale(32)} color={colors.primary} />
                                        </View>
                                    </View>
                                </CCard>
                            </TouchableOpacity>
                        ))}

                        {savedBanks.length === 0 && (
                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: colors.primary }]}
                                onPress={() => setViewMode('add')}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="plus" size={moderateScale(20)} color={colors.black} />
                                <CText style={[styles.addButtonText, { color: colors.black }]}>Add New Account</CText>
                            </TouchableOpacity>
                        )}
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
                                <CCard style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Account Holder Name"
                                            value={holderName}
                                            onChangeText={setHolderName}
                                            autoCapitalize="words"
                                            leftIcon="account-outline"
                                        />
                                        {errors.holderName && <CText style={[styles.errorText, { color: colors.error }]}>{errors.holderName}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Bank Name"
                                            value={bankName}
                                            onChangeText={setBankName}
                                            autoCapitalize="words"
                                            leftIcon="bank-outline"
                                        />
                                        {errors.bankName && <CText style={[styles.errorText, { color: colors.error }]}>{errors.bankName}</CText>}
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
                                        {errors.accountNumber && <CText style={[styles.errorText, { color: colors.error }]}>{errors.accountNumber}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Confirm Account Number"
                                            value={confirmAccountNumber}
                                            onChangeText={setConfirmAccountNumber}
                                            keyboardType="number-pad"
                                            leftIcon="numeric"
                                        />
                                        {errors.confirmAccountNumber && <CText style={[styles.errorText, { color: colors.error }]}>{errors.confirmAccountNumber}</CText>}
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
                                        {errors.ifscCode && <CText style={[styles.errorText, { color: colors.error }]}>{errors.ifscCode}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="Branch Name"
                                            value={branch}
                                            onChangeText={setBranch}
                                            autoCapitalize="words"
                                            leftIcon="source-branch"
                                        />
                                        {errors.branch && <CText style={[styles.errorText, { color: colors.error }]}>{errors.branch}</CText>}
                                    </View>

                                    {/* Account Type Selection */}
                                    <View style={styles.inputContainer}>
                                        <CText style={[styles.label, { color: colors.textSecondary }]}>Account Type</CText>
                                        <View style={styles.typeContainer}>
                                            {['saving', 'current', 'salary'].map((type) => (
                                                <TouchableOpacity
                                                    key={type}
                                                    style={[
                                                        styles.typeChip,
                                                        { borderColor: colors.border, backgroundColor: colors.inputBackground },
                                                        accountType === type && { borderColor: colors.primary, backgroundColor: colors.primary + '20' }
                                                    ]}
                                                    onPress={() => setAccountType(type)}
                                                >
                                                    <CText style={[
                                                        styles.typeText,
                                                        { color: colors.textSecondary },
                                                        accountType === type && { color: colors.primary, fontWeight: 'bold' }
                                                    ]}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </CText>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.buttonRow}>
                                        {savedBanks.length > 0 && (
                                            <TouchableOpacity
                                                style={[styles.cancelButton, { backgroundColor: colors.inputBackground }]}
                                                onPress={() => setViewMode('list')}
                                            >
                                                <CText style={[styles.cancelButtonText, { color: colors.textPrimary }]}>Cancel</CText>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={[styles.saveButton, { backgroundColor: colors.primary }, loading && styles.disabledButton, { flex: savedBanks.length > 0 ? 1 : 0, width: savedBanks.length > 0 ? undefined : '100%' }]}
                                            onPress={handleSave}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color={colors.black} size="small" />
                                            ) : (
                                                <CText style={[styles.saveButtonText, { color: colors.black }]}>Save Bank Details</CText>
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
                    balance={winningBalance}
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
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    label: {
        fontSize: moderateScale(12),
        marginBottom: verticalScale(8),
        marginLeft: moderateScale(4),
    },
    typeContainer: {
        flexDirection: 'row',
        gap: moderateScale(10),
    },
    typeChip: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(20),
        borderWidth: 1,
    },
    typeText: {
        fontSize: moderateScale(12),
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(10),
        gap: moderateScale(12),
    },
    cancelButton: {
        flex: 1,
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    cancelButtonText: {
        color: colors.textPrimary,
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    // Premium Card Styles
    cardWrapper: {
        marginBottom: verticalScale(20),
        width: '100%',
    },
    premiumCard: {
        height: verticalScale(190),
        borderRadius: moderateScale(20),
        padding: moderateScale(24),
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'space-between',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
    },
    cardBgOverlay: {
        position: 'absolute',
        top: -verticalScale(60),
        right: -moderateScale(60),
        width: moderateScale(220),
        height: moderateScale(220),
        borderRadius: moderateScale(110),
        opacity: 0.08,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
    },
    cardChip: {
        width: moderateScale(45),
        height: moderateScale(32),
        borderRadius: moderateScale(6),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    contactlessIcon: {
        opacity: 0.6,
    },
    cardBankName: {
        fontSize: moderateScale(16),
        fontWeight: '800',
        letterSpacing: 1.5,
        flex: 1,
        textAlign: 'right',
        marginLeft: moderateScale(15),
    },
    cardNumberContainer: {
        marginVertical: verticalScale(25),
        alignItems: 'center',
    },
    premiumCardNumber: {
        fontSize: moderateScale(22),
        fontWeight: 'bold',
        letterSpacing: 4,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardInfoItem: {
        flex: 1,
    },
    cardInfoLabel: {
        fontSize: moderateScale(8),
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 6,
        opacity: 0.7,
    },
    cardInfoValue: {
        fontSize: moderateScale(15),
        fontWeight: '800',
        letterSpacing: 1,
    },
    cardTypeIcon: {
        opacity: 0.8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(16),
        marginTop: verticalScale(10),
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    addButtonText: {
        marginLeft: moderateScale(8),
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
});

export default BankDetailsScreen;
