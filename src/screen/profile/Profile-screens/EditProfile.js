import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import CustomAlert from '@/components/common/CustomAlert';
import api from '@/api';

export default function EditProfile() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { user, updateUser } = useApp();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => setShowAlert(false)
    });
    const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setMobile(user.mobile || '');
        }
    }, [user]);

    const handleSendOTP = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/send-otp', {
                username: user?.username,
                action: 'profile_update',
            });
            if (res.data.status === 200) {
                setAlertConfig({
                    title: 'Success',
                    message: 'OTP sent successfully!',
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
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.current?.focus();
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.current?.focus();
        }
    };

    const handleUpdateProfile = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setAlertConfig({
                title: 'Invalid OTP',
                message: 'Please enter the 6-digit OTP',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
            return;
        }

        setIsLoading(true);
        try {
            const payload = { otp: otpCode, action: 'profile_update' };
            if (name !== user?.name) payload.name = name;
            if (email !== user?.email) payload.email = email;
            if (mobile !== user?.mobile) payload.mobile = mobile;

            const res = await api.post('/update-profile', payload);
            if (res.data.status === 200) {
                await updateUser({ name, email, mobile });
                setAlertConfig({
                    title: 'Success',
                    message: 'Profile updated successfully!',
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
                message: error?.response?.data?.message || 'Failed to update profile',
                onConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                        <MaterialCommunityIcons name="close" size={moderateScale(28)} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Profile</CText>
                    <View style={styles.headerButton} />
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: verticalScale(40) }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <CText style={[styles.label, { color: colors.textPrimary }]}>Full Name</CText>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                                editable={!otpSent}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <CText style={[styles.label, { color: colors.textPrimary }]}>Email</CText>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!otpSent}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <CText style={[styles.label, { color: colors.textPrimary }]}>Mobile</CText>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
                                placeholder="Enter your mobile"
                                placeholderTextColor={colors.textSecondary}
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                                editable={!otpSent}
                            />
                        </View>

                        {!otpSent ? (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.primary }, isLoading && { opacity: 0.6 }]}
                                onPress={handleSendOTP}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.black} size="small" />
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="send" size={moderateScale(20)} color={colors.black} />
                                        <CText style={[styles.buttonText, { color: colors.black }]}>Send OTP to Update</CText>
                                    </>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <>
                                <View style={styles.otpSection}>
                                    <CText style={[styles.otpTitle, { color: colors.textPrimary }]}>Enter OTP</CText>
                                    <CText style={[styles.otpSubtitle, { color: colors.textSecondary }]}>6-digit code sent to verify changes</CText>
                                    <View style={styles.otpContainer}>
                                        {otp.map((digit, index) => (
                                            <TextInput
                                                key={index}
                                                ref={otpRefs.current[index]}
                                                style={[styles.otpBox, {
                                                    borderColor: colors.border,
                                                    color: colors.textPrimary,
                                                    backgroundColor: colors.surface
                                                }]}
                                                value={digit}
                                                onChangeText={(value) => handleOtpChange(value, index)}
                                                onKeyPress={(e) => handleKeyPress(e, index)}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                selectTextOnFocus
                                            />
                                        ))}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: colors.primary }, isLoading && { opacity: 0.6 }]}
                                    onPress={handleUpdateProfile}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color={colors.black} size="small" />
                                    ) : (
                                        <CText style={[styles.buttonText, { color: colors.black }]}>Update Profile</CText>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSendOTP} style={styles.resendButton}>
                                    <CText style={[styles.resendText, { color: colors.primary }]}>Resend OTP</CText>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </ScrollView>
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
        </SafeAreaView>
    );
}

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
    headerButton: {
        padding: moderateScale(8),
        width: moderateScale(44),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    inputContainer: {
        paddingHorizontal: moderateScale(20),
        paddingTop: verticalScale(24),
    },
    inputWrapper: {
        marginBottom: verticalScale(20),
    },
    label: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: moderateScale(12),
        padding: moderateScale(14),
        fontSize: moderateScale(16),
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    otpSection: {
        marginTop: verticalScale(24),
        marginBottom: verticalScale(24),
    },
    otpTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: verticalScale(8),
    },
    otpSubtitle: {
        fontSize: moderateScale(13),
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: verticalScale(20),
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    otpBox: {
        width: moderateScale(45),
        height: moderateScale(50),
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: moderateScale(10),
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.textPrimary,
        backgroundColor: colors.surface,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(14),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
        marginTop: verticalScale(8),
    },
    buttonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.black,
    },
    resendButton: {
        paddingVertical: moderateScale(12),
        alignItems: 'center',
        marginTop: verticalScale(12),
    },
    resendText: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '500',
    },
});
