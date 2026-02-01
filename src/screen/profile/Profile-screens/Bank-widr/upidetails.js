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
import { walletAPI } from '@/api/services';

const { width } = Dimensions.get('window');

const UPIDetailsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { savedUPIs, removeUPI, totalBalance, refreshWallets, refreshPaymentDetails, wallets } = useApp();
    const [viewMode, setViewMode] = useState('list');

    // Calculate Usage Balance: Main Wallet (Winning Amount)
    const winningBalance = wallets.find(w => w.slug === 'main_wallet')?.value || 0;

    React.useEffect(() => {
        refreshPaymentDetails();
    }, []);

    // Withdrawal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUPI, setSelectedUPI] = useState(null);
    const [withdrawalLoading, setWithdrawalLoading] = useState(false);

    // Form State
    const [upiId, setUpiId] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!upiId.trim()) {
            newErrors.upiId = 'UPI ID is required';
        } else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
            newErrors.upiId = 'Invalid UPI ID format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const success = await saveUPI({ name, upiId });

            if (success) {
                setLoading(false);
                setAlertMessage('UPI details saved successfully!');
                setShowAlert(true);
                // Clear form
                setName('');
                setUpiId('');
                // Switch to list view after delay
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
            console.error('Error saving UPI details:', error);
            setLoading(false);
            setAlertMessage('Failed to save details. Please try again.');
            setShowAlert(true);
        }
    };

    const handleDelete = (index) => {
        removeUPI(index);
    };

    const handleCardPress = (upi) => {
        setSelectedUPI(upi);
        setModalVisible(true);
    };

    const handleWithdrawalSubmit = async (amount) => {
        setWithdrawalLoading(true);
        try {
            const withdrawalData = {
                amount: amount,
                paymentMethod: 'upi',
                account: selectedUPI.upiId, // upiId for UPI
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
                    <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>{viewMode === 'list' ? 'Saved UPIs' : 'Add UPI'}</CText>
                    <View style={styles.headerPlaceholder} />
                </View>

                {viewMode === 'list' ? (
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {savedUPIs.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.9}
                                onPress={() => handleCardPress(item)}
                                style={styles.cardWrapper}
                            >
                                <CCard style={[styles.premiumCard, { backgroundColor: colors.surface }]}>
                                    <View style={[styles.cardBgOverlay, { backgroundColor: colors.primary }]} />

                                    <View style={styles.cardHeader}>
                                        <View style={styles.iconContainer}>
                                            <MaterialCommunityIcons name="qrcode-scan" size={moderateScale(28)} color={colors.primary} />
                                        </View>
                                        <CText style={[styles.cardType, { color: colors.textSecondary }]}>UPI ID</CText>
                                    </View>

                                    <View style={styles.cardInfoContainer}>
                                        <CText style={[styles.premiumUPIId, { color: colors.textPrimary }]} numberOfLines={1}>
                                            {item.upiId}
                                        </CText>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <View style={styles.cardInfoItem}>
                                            <CText style={[styles.cardInfoLabel, { color: colors.textSecondary }]}>ACCOUNT HOLDER</CText>
                                            <CText style={[styles.cardInfoValue, { color: colors.textPrimary }]} numberOfLines={1}>
                                                {item.name?.toUpperCase()}
                                            </CText>
                                        </View>
                                        <View style={styles.verifiedBadge}>
                                            <MaterialCommunityIcons name="check-decagram" size={moderateScale(24)} color={colors.primary} />
                                        </View>
                                    </View>
                                </CCard>
                            </TouchableOpacity>
                        ))}

                        {savedUPIs.length === 0 && (
                            <TouchableOpacity
                                style={[styles.addButton, { backgroundColor: colors.primary }]}
                                onPress={() => setViewMode('add')}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="plus" size={moderateScale(20)} color={colors.black} />
                                <CText style={[styles.addButtonText, { color: colors.black }]}>Add New UPI</CText>
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
                                            placeholder="Full Name"
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                            leftIcon="account-outline"
                                        />
                                        {errors.name && <CText style={[styles.errorText, { color: colors.error }]}>{errors.name}</CText>}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <CInput
                                            placeholder="UPI ID (e.g. user@okybl)"
                                            value={upiId}
                                            onChangeText={setUpiId}
                                            autoCapitalize="none"
                                            leftIcon="qrcode-scan"
                                            keyboardType="email-address"
                                        />
                                        {errors.upiId && <CText style={[styles.errorText, { color: colors.error }]}>{errors.upiId}</CText>}
                                    </View>

                                    <View style={styles.buttonRow}>
                                        {savedUPIs.length > 0 && (
                                            <TouchableOpacity
                                                style={[styles.cancelButton, { backgroundColor: colors.inputBackground }]}
                                                onPress={() => setViewMode('list')}
                                            >
                                                <CText style={[styles.cancelButtonText, { color: colors.textPrimary }]}>Cancel</CText>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={[styles.saveButton, { backgroundColor: colors.primary }, loading && styles.disabledButton, { flex: savedUPIs.length > 0 ? 1 : 0, width: savedUPIs.length > 0 ? undefined : '100%' }]}
                                            onPress={handleSave}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color={colors.black} size="small" />
                                            ) : (
                                                <CText style={[styles.saveButtonText, { color: colors.black }]}>Save UPI Details</CText>
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
                    accountDetails={selectedUPI}
                    type="upi"
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
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(14),
        alignItems: 'center',
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
    // Premium Card Styles
    cardWrapper: {
        marginBottom: verticalScale(20),
        width: '100%',
    },
    premiumCard: {
        height: verticalScale(170),
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
        width: moderateScale(200),
        height: moderateScale(200),
        borderRadius: moderateScale(100),
        opacity: 0.08,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconContainer: {
        width: moderateScale(45),
        height: moderateScale(45),
        borderRadius: moderateScale(12),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardType: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        letterSpacing: 2,
    },
    cardInfoContainer: {
        marginVertical: verticalScale(15),
    },
    premiumUPIId: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        letterSpacing: 0.5,
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
    verifiedBadge: {
        opacity: 0.9,
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

export default UPIDetailsScreen;
