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
import { authAPI } from '@/api/services';
import { useApp } from '@/context/AppContext';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
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
        <View style={styles.container}>
            {/* Background Blobs */}
            <View style={styles.blobTop} />
            <View style={styles.blobBottom} />

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
                                    <View style={styles.iconContainer}>
                                        <MaterialCommunityIcons
                                            name="shield-lock-outline"
                                            size={moderateScale(59)} // Reduced size
                                            color={colors.primary}
                                        />
                                    </View>
                                    <CText style={styles.welcomeText}>Welcome Back</CText>
                                    <CText style={styles.subtitleText}>Sign in to continue</CText>
                                </View>

                                {/* Login Card */}
                                <CCard style={styles.loginCard}>
                                    {/* Username Input */}
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            // label="Username" // Removed label
                                            placeholder="Enter your username"
                                            value={username}
                                            onChangeText={setUsername}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            leftIcon="account-outline"
                                        />
                                        {errors.username && <CText style={styles.errorText}>{errors.username}</CText>}
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
                                        {errors.password && <CText style={styles.errorText}>{errors.password}</CText>}
                                    </View>

                                    {/* Forgot Password */}
                                    <TouchableOpacity style={styles.forgotPassword}>
                                        <CText style={styles.forgotPasswordText}>Forgot Password?</CText>
                                    </TouchableOpacity>

                                    {/* Login Button */}
                                    <TouchableOpacity
                                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                                        onPress={handleLogin}
                                        disabled={loading}
                                        activeOpacity={0.8}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={colors.black} size="small" />
                                        ) : (
                                            <CText style={styles.loginButtonText}>Login</CText>
                                        )}
                                    </TouchableOpacity>
                                </CCard>

                                {/* Register Link */}
                                <View style={styles.registerContainer}>
                                    <CText style={styles.registerText}>Don't have an account? </CText>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <CText style={styles.registerLink}>Create Account</CText>
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
        backgroundColor: colors.background,
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
        backgroundColor: colors.primary,
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
        backgroundColor: colors.primary,
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
        backgroundColor: 'rgba(44, 182, 125, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(8), // Reduced from 16
        borderWidth: 1,
        borderColor: 'rgba(44, 182, 125, 0.2)',
    },
    welcomeText: {
        fontSize: moderateScale(30), // Reduced from 28
        fontWeight: 'bold',
        // right: moderateScale(-20),
        color: colors.textPrimary,
        marginBottom: verticalScale(4), // Reduced from 8
    },
    subtitleText: {
        fontSize: moderateScale(16), // Reduced from 16
        color: colors.textSecondary,
    },
    loginCard: {
        width: '100%',
        paddingVertical: verticalScale(16), // Reduced from 30
        paddingHorizontal: moderateScale(20), // Reduced from 24
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
    },
    inputContainer: {
        marginBottom: verticalScale(4), // Reduced from 8
    },
    errorText: {
        fontSize: moderateScale(12),
        color: colors.error,
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
        color: colors.primary,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(12), // Reduced from 16
        borderRadius: moderateScale(14),
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: colors.black,
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
        color: colors.textSecondary,
    },
    registerLink: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '700',
    },
});

export default LoginScreen;

