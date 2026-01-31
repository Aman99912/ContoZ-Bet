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
import { useTheme } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CInput from '@/components/common/CInput';
import CCard from '@/components/common/CCard';
import CustomAlert from '@/components/common/CustomAlert';
import { authAPI } from '@/api/services';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify & Reset
    const [method, setMethod] = useState('username'); // 'username' or 'email'
    const [inputValue, setInputValue] = useState(''); // Stores username/email
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Alert State
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error'); // 'success' or 'error'

    const validateStep1 = () => {
        const newErrors = {};
        if (!inputValue.trim()) {
            newErrors.input = `Please enter your ${method}`;
        } else {
            if (method === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(inputValue)) {
                    newErrors.input = 'Invalid email format';
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!otp.trim()) newErrors.otp = 'OTP is required';
        if (!newPassword) newErrors.newPassword = 'New Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        if (!validateStep1()) return;

        setLoading(true);
        try {
            const payload = {
                action: 'forgot_password',
                [method]: method === 'username' ? inputValue.trim().toUpperCase() : inputValue.trim(),
            };

            const response = await authAPI.sendOtp(payload);
            console.log('Send OTP Response:', response);

            setAlertTitle('Success');
            setAlertMessage(response?.message || 'OTP sent successfully');
            setAlertType('success');
            setShowAlert(true);

            // Move to next step implies user closes alert, handled in alert close

        } catch (error) {
            console.error('Send OTP Error:', error);
            setAlertTitle('Error');
            setAlertMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!validateStep2()) return;

        setLoading(true);
        try {
            const payload = {
                otp: otp.trim(),
                action: 'forgot_password',
                newPassword: newPassword,
                [method]: method === 'username' ? inputValue.trim().toUpperCase() : inputValue.trim(),
            };

            const response = await authAPI.forgotPassword(payload);
            console.log('Reset Password Response:', response);

            setAlertTitle('Success');
            setAlertMessage(response?.message || 'Password reset successful.');
            setAlertType('success');
            setShowAlert(true);

        } catch (error) {
            console.error('Reset Password Error:', error);
            setAlertTitle('Error');
            setAlertMessage(error.response?.data?.message || 'Failed to reset password.');
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        if (alertType === 'success') {
            if (step === 1) {
                setStep(2);
            } else {
                // Return to Login after successful reset
                navigation.goBack();
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background Blobs (Reused style) */}
            <View style={[styles.blobTop, { backgroundColor: colors.primary }]} />
            <View style={[styles.blobBottom, { backgroundColor: colors.primary }]} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.contentWrapper}>
                                <View style={styles.headerContainer}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                                        <MaterialCommunityIcons
                                            name="lock-reset"
                                            size={moderateScale(50)}
                                            color={colors.primary}
                                        />
                                    </View>
                                    <CText style={[styles.welcomeText, { color: colors.textPrimary }]}>Forgot Password</CText>
                                    <CText style={[styles.subtitleText, { color: colors.textSecondary }]}>
                                        {step === 1 ? 'Enter your details to receive OTP' : 'Enter OTP and new password'}
                                    </CText>
                                </View>

                                <CCard style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>

                                    {step === 1 && (
                                        <>
                                            {/* Method Selection */}
                                            <View style={styles.tabContainer}>
                                                <TouchableOpacity
                                                    style={[styles.tab, method === 'username' && { backgroundColor: colors.primary }]}
                                                    onPress={() => { setMethod('username'); setErrors({}); }}
                                                >
                                                    <CText style={[styles.tabText, method === 'username' ? { color: colors.black } : { color: colors.textSecondary }]}>Username</CText>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.tab, method === 'email' && { backgroundColor: colors.primary }]}
                                                    onPress={() => { setMethod('email'); setErrors({}); }}
                                                >
                                                    <CText style={[styles.tabText, method === 'email' ? { color: colors.black } : { color: colors.textSecondary }]}>Email</CText>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <CInput
                                                    placeholder={method === 'username' ? "Enter your username" : "Enter your email"}
                                                    value={inputValue}
                                                    onChangeText={setInputValue}
                                                    autoCapitalize={method === 'username' ? "characters" : "none"}
                                                    leftIcon={method === 'username' ? "account-outline" : "email-outline"}
                                                />
                                                {errors.input && <CText style={[styles.errorText, { color: colors.error }]}>{errors.input}</CText>}
                                            </View>

                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: colors.primary, shadowColor: colors.primary }, loading && styles.disabledButton]}
                                                onPress={handleSendOtp}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator color={colors.black} size="small" />
                                                ) : (
                                                    <CText style={[styles.buttonText, { color: colors.black }]}>Send OTP</CText>
                                                )}
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <View style={styles.inputContainer}>
                                                <CInput
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChangeText={setOtp}
                                                    keyboardType="number-pad"
                                                    leftIcon="message-processing-outline"
                                                />
                                                {errors.otp && <CText style={[styles.errorText, { color: colors.error }]}>{errors.otp}</CText>}
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <CInput
                                                    placeholder="New Password"
                                                    value={newPassword}
                                                    onChangeText={setNewPassword}
                                                    showPasswordToggle={true}
                                                    leftIcon="lock-outline"
                                                />
                                                {errors.newPassword && <CText style={[styles.errorText, { color: colors.error }]}>{errors.newPassword}</CText>}
                                            </View>

                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: colors.primary, shadowColor: colors.primary }, loading && styles.disabledButton]}
                                                onPress={handleResetPassword}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <ActivityIndicator color={colors.black} size="small" />
                                                ) : (
                                                    <CText style={[styles.buttonText, { color: colors.black }]}>Reset Password</CText>
                                                )}
                                            </TouchableOpacity>
                                        </>
                                    )}

                                </CCard>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

                <CustomAlert
                    visible={showAlert}
                    title={alertTitle}
                    message={alertMessage}
                    showConfirm={true}
                    confirmText="OK"
                    onClose={handleAlertClose}
                    onConfirm={handleAlertClose}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    safeArea: {
        flex: 1,
    },
    backButton: {
        padding: moderateScale(16),
        position: 'absolute',
        top: verticalScale(10), // Adjust for safe area
        zIndex: 10,
        marginLeft: moderateScale(4),
    },
    blobTop: {
        position: 'absolute',
        top: -width * 0.4,
        right: -width * 0.2,
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        opacity: 0.08,
        transform: [{ scaleX: 1.2 }],
    },
    blobBottom: {
        position: 'absolute',
        bottom: -width * 0.3,
        left: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        opacity: 0.05,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: moderateScale(20),
    },
    contentWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    iconContainer: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(35),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        borderWidth: 1,
    },
    welcomeText: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        marginBottom: verticalScale(4),
    },
    subtitleText: {
        fontSize: moderateScale(14),
    },
    card: {
        width: '100%',
        paddingVertical: verticalScale(20),
        paddingHorizontal: moderateScale(20),
        borderWidth: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: verticalScale(20),
        backgroundColor: 'rgba(0,0,0,0.05)', // Slight background for tab track
        borderRadius: moderateScale(8),
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: verticalScale(8),
        alignItems: 'center',
        borderRadius: moderateScale(6),
    },
    tabText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: verticalScale(6),
    },
    errorText: {
        fontSize: moderateScale(12),
        marginTop: verticalScale(-10),
        marginBottom: verticalScale(8),
        marginLeft: moderateScale(4),
    },
    actionButton: {
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        marginTop: verticalScale(10),
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default ForgotPasswordScreen;
