import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { useApp } from '@/context/AppContext';
import api from '@/api';
import CustomAlert from '@/components/common/CustomAlert';

const EmailVerify = () => {
    const navigation = useNavigation();
    const { user, updateVerificationStatus } = useApp();
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => setShowAlert(false)
    });
    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleSendOTP = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/api/send-otp', {
                email: user?.email,
            });

            if (response.data.status === 200) {
                setAlertConfig({
                    title: 'Success',
                    message: 'OTP sent to your email!',
                    onConfirm: () => setShowAlert(false)
                });
                setShowAlert(true);
                setOtpSent(true);
            }
        } catch (error) {
            setAlertConfig({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to send OTP',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== 4) {
            setAlertConfig({
                title: 'Invalid OTP',
                message: 'Please enter the 4-digit OTP',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/api/verify-otp', {
                email: user?.email,
                otp: otpCode,
            });

            if (response.data.status === 200) {
                await updateVerificationStatus(true);
                setAlertConfig({
                    title: 'Success',
                    message: 'Email verified successfully!',
                    onConfirm: () => {
                        setShowAlert(false);
                        navigation.goBack();
                    }
                });
                setShowAlert(true);
            }
        } catch (error) {
            setAlertConfig({
                title: 'Error',
                message: error?.response?.data?.message || 'Invalid OTP',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={styles.headerTitle}>Email Verification</CText>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="email-check" size={moderateScale(48)} color={colors.primary} />
                    </View>

                    <CText style={styles.title}>Verify Your Email</CText>
                    <CText style={styles.subtitle}>
                        {otpSent
                            ? 'Enter the 4-digit OTP sent to your email'
                            : 'We will send a verification code to your email address'
                        }
                    </CText>

                    {/* Email Display */}
                    <View style={styles.emailContainer}>
                        <MaterialCommunityIcons name="email-outline" size={moderateScale(20)} color={colors.textSecondary} />
                        <CText style={styles.emailText}>{user?.email}</CText>
                    </View>

                    {!otpSent ? (
                        /* Send OTP Button */
                        <TouchableOpacity
                            style={[styles.sendButton, isLoading && styles.buttonDisabled]}
                            onPress={handleSendOTP}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.black} size="small" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="send" size={moderateScale(20)} color={colors.black} />
                                    <CText style={styles.sendButtonText}>Send OTP</CText>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <>
                            {/* OTP Input Boxes */}
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={otpRefs[index]}
                                        style={styles.otpBox}
                                        value={digit}
                                        onChangeText={(value) => handleOtpChange(value, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>

                            {/* Verify Button */}
                            <TouchableOpacity
                                style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
                                onPress={handleVerifyOTP}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <CText style={styles.verifyButtonText}>Verify OTP</CText>
                                )}
                            </TouchableOpacity>

                            {/* Resend OTP */}
                            <TouchableOpacity onPress={handleSendOTP} style={styles.resendButton}>
                                <CText style={styles.resendText}>Didn't receive code? Resend</CText>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>

            <CustomAlert
                visible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                showConfirm={true}
                confirmText="OK"
                onConfirm={alertConfig.onConfirm}
                onClose={() => setShowAlert(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    headerPlaceholder: {
        width: moderateScale(36),
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: moderateScale(24),
        alignItems: 'center',
    },
    iconCircle: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(24),
        borderWidth: 2,
        borderColor: colors.primary,
    },
    title: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: verticalScale(32),
        lineHeight: moderateScale(20),
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: verticalScale(24),
        width: '100%',
    },
    emailText: {
        fontSize: moderateScale(15),
        color: colors.textPrimary,
        marginLeft: moderateScale(12),
        fontWeight: '500',
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(32),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
        width: '100%',
    },
    sendButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.black,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: moderateScale(12),
        marginBottom: verticalScale(24),
        width: '100%',
    },
    otpBox: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: moderateScale(12),
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.textPrimary,
        backgroundColor: colors.surface,
    },
    verifyButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(32),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: verticalScale(16),
    },
    verifyButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.black,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    resendButton: {
        paddingVertical: moderateScale(8),
    },
    resendText: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '500',
    },
});

export default EmailVerify;
