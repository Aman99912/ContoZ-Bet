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

const RegisterScreen = ({ navigation }) => {
    const { login } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sponsor, setSponsor] = useState('contoz');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (mobile.replace(/\D/g, '').length !== 10) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const formattedMobile = mobile.startsWith('+91') ? mobile : `+91 ${mobile}`;

            const response = await authAPI.register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                mobile: formattedMobile,
                password: password,
                sponsor: sponsor || 'contoz',
            });

            console.log('Registration successful:', response);

            // Store token and user data using AppContext
            await login(response.token, response.User);

            // Navigate to main app
            navigation.replace('MainApp');

        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
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
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                            </TouchableOpacity>
                            <CText style={styles.headerTitle}>Create Account</CText>
                            <View style={styles.headerPlaceholder} />
                        </View>

                        {/* Welcome Text */}
                        <View style={styles.welcomeContainer}>
                            <CText style={styles.welcomeText}>Join Conto-Z</CText>
                            <CText style={styles.subtitleText}>Create your account to get started</CText>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Name Input */}
                            <View style={styles.inputContainer}>

                                <CInput
                                    placeholder="Enter your name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                                {errors.name && <CText style={styles.errorText}>{errors.name}</CText>}
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <CInput
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {errors.email && <CText style={styles.errorText}>{errors.email}</CText>}
                            </View>

                            {/* Mobile Input */}
                            <View style={styles.inputContainer}>
                                <CInput
                                    placeholder="Enter 10 digit mobile number"
                                    value={mobile}
                                    onChangeText={setMobile}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                                {errors.mobile && <CText style={styles.errorText}>{errors.mobile}</CText>}
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <CInput
                                    placeholder="Enter password"
                                    value={password}
                                    onChangeText={setPassword}
                                    showPasswordToggle={true}
                                />
                                {errors.password && <CText style={styles.errorText}>{errors.password}</CText>}
                            </View>



                            {/* Sponsor Code Input (Optional) */}
                            <View style={styles.inputContainer}>
                                <CInput
                                    placeholder="Enter sponsor code (Optional)"
                                    value={sponsor}
                                    onChangeText={setSponsor}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Register Button */}
                            <TouchableOpacity
                                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                                onPress={handleRegister}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <ActivityIndicator color={colors.black} size="small" />
                                ) : (
                                    <CText style={styles.registerButtonText}>Create Account</CText>
                                )}
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View style={styles.loginContainer}>
                                <CText style={styles.loginText}>Already have an account? </CText>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <CText style={styles.loginLink}>Login</CText>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
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
    welcomeContainer: {
        paddingHorizontal: moderateScale(20),
        marginTop: verticalScale(20),
        marginBottom: verticalScale(32),
    },
    welcomeText: {
        fontSize: moderateScale(28),
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
        marginBottom: verticalScale(5),
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
    registerButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        marginTop: verticalScale(12),
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        color: colors.black,
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(24),
    },
    loginText: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
    },
    loginLink: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '600',
    },
});

export default RegisterScreen;
