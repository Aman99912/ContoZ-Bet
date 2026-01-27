import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CInput from '@/components/common/CInput';
import CCard from '@/components/common/CCard';

const LoginScreen = ({ navigation }) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleSendOtp = () => {
        if (mobile.length === 10) {
            setShowOtpModal(true);
        }
    };

    const handleVerifyOtp = () => {
        // Navigate to Home or complete login
        console.log('Verifying OTP:', otp.join(''));
        // navigation.replace('Home'); // Example navigation
    };

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Logic to focus next input could be added here
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.headerContainer}>
                            <CText style={styles.title}>Welcome Captain</CText>
                            <CText style={styles.subtitle}>Login to continue</CText>
                        </View>

                        <CCard style={styles.loginCard}>
                            <CInput
                                label="Mobile Number"
                                placeholder="Enter 10 digit number"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={mobile}
                                onChangeText={setMobile}
                            />

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSendOtp}
                                activeOpacity={0.8}
                            >
                                <CText style={styles.buttonText}>Send OTP</CText>
                            </TouchableOpacity>
                        </CCard>
                    </View>
                </TouchableWithoutFeedback>

                {/* OTP Modal */}
                <Modal
                    visible={showOtpModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowOtpModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowOtpModal(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <CCard style={styles.otpCard}>
                                        <CText style={styles.modalTitle}>Enter OTP</CText>
                                        <CText style={styles.modalSubtitle}>
                                            Enter the 4-digit code sent to +91 {mobile}
                                        </CText>

                                        <View style={styles.otpContainer}>
                                            {otp.map((digit, index) => (
                                                <CInput
                                                    key={index}
                                                    style={styles.otpInputWrapper}
                                                    inputStyle={styles.otpInput}
                                                    keyboardType="number-pad"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChangeText={(text) => handleOtpChange(text, index)}
                                                    textAlign="center"
                                                />
                                            ))}
                                        </View>

                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleVerifyOtp}
                                        >
                                            <CText style={styles.buttonText}>Verify & Login</CText>
                                        </TouchableOpacity>
                                    </CCard>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: moderateScale(24),
        justifyContent: 'center',
    },
    headerContainer: {
        marginBottom: verticalScale(32),
    },
    title: {
        fontSize: moderateScale(32),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
    },
    subtitle: {
        fontSize: moderateScale(16),
        color: colors.textSecondary,
    },
    loginCard: {
        backgroundColor: colors.surface,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        alignItems: 'center',
        marginTop: verticalScale(16),
    },
    buttonText: {
        color: colors.white,
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'transparent',
        padding: moderateScale(24),
        marginBottom: verticalScale(20),
    },
    otpCard: {
        backgroundColor: colors.surface,
    },
    modalTitle: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        marginBottom: verticalScale(24),
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: moderateScale(12),
        marginBottom: verticalScale(24),
    },
    otpInputWrapper: {
        flex: 1,
        marginBottom: 0, // Override default margin
    },
    otpInput: {
        textAlign: 'center',
        fontSize: moderateScale(24),
    }
});

export default LoginScreen;
