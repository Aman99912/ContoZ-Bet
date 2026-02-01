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
import { authAPI, userAPI } from '@/api/services';
import { useApp } from '@/context/AppContext';
import NotificationService from '@/services/notificationService';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { login } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username or email is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login({
                username: username.trim(),
                password: password,
            });

            console.log('Login successful:', response);

            // Store token and user data using AppContext
            await login(response.token, response.user);

            // FCM Token Logic
            try {
                const permissionGranted = await NotificationService.requestUserPermission();
                if (permissionGranted) {
                    const fcmToken = await NotificationService.getFCMToken();
                    if (fcmToken) {
                        console.log('Syncing FCM Token:', fcmToken);
                        // Attempt to update profile with token
                        await userAPI.updateProfile({ fcm_token: fcmToken });
                    }
                }
            } catch (fcmError) {
                console.log('FCM Sync Error:', fcmError);
                // Don't block login if FCM fails
            }

            // Navigate to main app
            navigation.replace('MainApp');

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setAlertMessage(errorMessage);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background Blobs */}
            <View style={[styles.blobTop, { backgroundColor: colors.primary }]} />
            <View style={[styles.blobBottom, { backgroundColor: colors.primary }]} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
                                {/* Header Section */}
                                <View style={styles.headerContainer}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                                        <MaterialCommunityIcons
                                            name="shield-lock-outline"
                                            size={moderateScale(59)} // Reduced size
                                            color={colors.primary}
                                        />
                                    </View>
                                    <CText style={[styles.welcomeText, { color: colors.textPrimary }]} numberOfLines={1}>Welcome Back</CText>
                                    <CText style={[styles.subtitleText, { color: colors.textSecondary }]} numberOfLines={1}>Sign in to continue</CText>
                                </View>

                                {/* Login Card */}
                                <CCard style={[styles.loginCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    {/* Username Input */}
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            // label="Username" // Removed label
                                            placeholder="Enter your username"
                                            value={username}
                                            onChangeText={setUsername}
                                            autoCapitalize="characters"
                                            autoCorrect={false}
                                            leftIcon="account-outline"
                                        />
                                        {errors.username && <CText style={[styles.errorText, { color: colors.error }]}>{errors.username}</CText>}
                                    </View>

                                    {/* Password Input */}
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            // label="Password" // Removed label
                                            placeholder="Enter your password"
                                            value={password}
                                            onChangeText={setPassword}
                                            showPasswordToggle={true}
                                            leftIcon="lock-outline"
                                        />
                                        {errors.password && <CText style={[styles.errorText, { color: colors.error }]}>{errors.password}</CText>}
                                    </View>

                                    {/* Forgot Password */}
                                    <TouchableOpacity
                                        style={styles.forgotPassword}
                                        onPress={() => navigation.navigate('ForgotPassword')}
                                    >
                                        <CText style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</CText>
                                    </TouchableOpacity>

                                    {/* Login Button */}
                                    <TouchableOpacity
                                        style={[styles.loginButton, { backgroundColor: colors.primary, shadowColor: colors.primary }, loading && styles.loginButtonDisabled]}
                                        onPress={handleLogin}
                                        disabled={loading}
                                        activeOpacity={0.8}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={colors.black} size="small" />
                                        ) : (
                                            <CText style={[styles.loginButtonText, { color: colors.black }]}>Login</CText>
                                        )}
                                    </TouchableOpacity>
                                </CCard>

                                {/* Register Link */}
                                <View style={styles.registerContainer}>
                                    <CText style={[styles.registerText, { color: colors.textSecondary }]}>Don't have an account? </CText>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <CText style={[styles.registerLink, { color: colors.primary }]}>Create Account</CText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

                <CustomAlert
                    visible={showAlert}
                    title="Login Error"
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
        position: 'relative',
    },
    safeArea: {
        flex: 1,
    },
    blobTop: {
        position: 'absolute',
        top: -width * 0.4,
        left: -width * 0.2, // Changed to left for Login screen variation if desired, or keep right. Login had left originally.
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        opacity: 0.08,
        transform: [{ scaleX: 1.2 }],
    },
    blobBottom: {
        position: 'absolute',
        bottom: -width * 0.3,
        right: -width * 0.2, // Changed to right for Login screen variation
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
        paddingVertical: verticalScale(20), // Added compact padding
    },
    contentWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(16), // Reduced from 30
    },
    iconContainer: {
        width: moderateScale(80), // Reduced from 80
        height: moderateScale(80), // Reduced from 80
        borderRadius: moderateScale(70),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(8), // Reduced from 16
        borderWidth: 1,
    },
    welcomeText: {
        fontSize: moderateScale(30), // Reduced from 28
        fontWeight: 'bold',
        // right: moderateScale(-20),
        marginBottom: verticalScale(4), // Reduced from 8
    },
    subtitleText: {
        fontSize: moderateScale(16), // Reduced from 16
    },
    loginCard: {
        width: '100%',
        paddingVertical: verticalScale(16), // Reduced from 30
        paddingHorizontal: moderateScale(20), // Reduced from 24
        borderWidth: 1,
    },
    inputContainer: {
        marginBottom: verticalScale(4), // Reduced from 8
    },
    errorText: {
        fontSize: moderateScale(12),
        marginTop: verticalScale(-12),
        marginBottom: verticalScale(8),
        marginLeft: moderateScale(4),
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: verticalScale(16), // Reduced from 24
        marginTop: verticalScale(2), // Reduced from 4
    },
    forgotPasswordText: {
        fontSize: moderateScale(13), // Slightly smaller
        fontWeight: '600',
    },
    loginButton: {
        paddingVertical: moderateScale(12), // Reduced from 16
        borderRadius: moderateScale(14),
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(16), // Reduced from 30
    },
    registerText: {
        fontSize: moderateScale(14),
    },
    registerLink: {
        fontSize: moderateScale(14),
        fontWeight: '700',
    },
});

export default LoginScreen;

