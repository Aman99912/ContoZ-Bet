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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CInput from '@/components/common/CInput';
import { authAPI } from '@/api/services';
import { useApp } from '@/context/AppContext';

const LoginScreen = ({ navigation }) => {
    const { login } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
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
                        {/* Logo Section */}
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons
                                name="shield-lock"
                                size={moderateScale(80)}
                                color={colors.primary}
                            />
                        </View>

                        {/* Welcome Text */}
                        <View style={styles.welcomeContainer}>
                            <CText style={styles.welcomeText}>Welcome Back</CText>
                            <CText style={styles.subtitleText}>Login to your account</CText>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Username Input */}
                            <View style={styles.inputContainer}>
                                {/* <CText style={styles.label}>Username or Email</CText> */}
                                <CInput
                                    placeholder="Enter username or email"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {errors.username && <CText style={styles.errorText}>{errors.username}</CText>}
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                {/* <CText style={styles.label}>Password</CText> */}
                                <CInput
                                    placeholder="Enter password"
                                    value={password}
                                    onChangeText={setPassword}
                                    showPasswordToggle={true}
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

                            {/* Register Link */}
                            <View style={styles.registerContainer}>
                                <CText style={styles.registerText}>Don't have an account? </CText>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <CText style={styles.registerLink}>Sign Up</CText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: verticalScale(40),
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: verticalScale(60),
        marginBottom: verticalScale(20),
    },
    welcomeContainer: {
        paddingHorizontal: moderateScale(20),
        marginBottom: verticalScale(40),
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: moderateScale(32),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
    },
    subtitleText: {
        fontSize: moderateScale(16),
        color: colors.textSecondary,
    },
    formContainer: {
        paddingHorizontal: moderateScale(20),
    },
    inputContainer: {
        marginBottom: verticalScale(20),
    },
    label: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: moderateScale(50),
    },
    eyeIcon: {
        position: 'absolute',
        right: moderateScale(16),
        top: '50%',
        transform: [{ translateY: -moderateScale(11) }],
    },
    errorText: {
        fontSize: moderateScale(12),
        color: colors.error,
        marginTop: verticalScale(4),
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: verticalScale(24),
    },
    forgotPasswordText: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: colors.black,
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(24),
    },
    registerText: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
    },
    registerLink: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '600',
    },
});

export default LoginScreen;
