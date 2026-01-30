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

const UPIDetailsScreen = ({ navigation }) => {
    const { saveUPI, savedUPIs, removeUPI, totalBalance, refreshWallets } = useApp();
    const [viewMode, setViewMode] = useState(savedUPIs && savedUPIs.length > 0 ? 'list' : 'add');

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
                type: 'upi',
                amount: amount,
                upi_details: selectedUPI,
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
                    <CText style={styles.headerTitle}>{viewMode === 'list' ? 'Saved UPIs' : 'Add UPI'}</CText>
                    <View style={styles.headerPlaceholder} />
                </View>

                {viewMode === 'list' ? (
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {savedUPIs.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.9}
                                onPress={() => handleCardPress(item)}
                            >
                                <CCard style={styles.savedCard}>
                                    <View style={styles.cardContent}>
                                        <View style={styles.iconContainer}>
                                            <MaterialCommunityIcons name="qrcode-scan" size={moderateScale(24)} color={colors.primary} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <CText style={styles.cardTitle}>{item.name}</CText>
                                            <CText style={styles.cardSubtitle}>{item.upiId}</CText>
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
                            <CText style={styles.addButtonText}>Add New UPI</CText>
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
                                            placeholder="Full Name"
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                            leftIcon="account-outline"
                                        />
                                        {errors.name && <CText style={styles.errorText}>{errors.name}</CText>}
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
                                        {errors.upiId && <CText style={styles.errorText}>{errors.upiId}</CText>}
                                    </View>

                                    <View style={styles.buttonRow}>
                                        {savedUPIs.length > 0 && (
                                            <TouchableOpacity
                                                style={styles.cancelButton}
                                                onPress={() => setViewMode('list')}
                                            >
                                                <CText style={styles.cancelButtonText}>Cancel</CText>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={[styles.saveButton, loading && styles.disabledButton, { flex: savedUPIs.length > 0 ? 1 : 0, width: savedUPIs.length > 0 ? undefined : '100%' }]}
                                            onPress={handleSave}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color={colors.black} size="small" />
                                            ) : (
                                                <CText style={styles.saveButtonText}>Save UPI Details</CText>
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
    // List Styles
    savedCard: {
        marginBottom: verticalScale(12),
        padding: moderateScale(16),
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(44, 182, 125, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(12),
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(2),
    },
    cardSubtitle: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
    deleteButton: {
        padding: moderateScale(8),
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(12),
        marginTop: verticalScale(12),
    },
    addButtonText: {
        marginLeft: moderateScale(8),
        color: colors.black,
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
});

export default UPIDetailsScreen;
