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
import { authAPI } from '@/api/services';
import { useApp } from '@/context/AppContext';
import { Modal, FlatList } from 'react-native';
import countryCodes from './countycode.json';
import { userAPI } from '@/api/services';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { login } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState(''); // Removed
    const [sponsor, setSponsor] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [hasSponsor, setHasSponsor] = useState(false);
    const [registerBonusAmount, setRegisterBonusAmount] = useState(50);

    // Country Code State
    const [selectedCountry, setSelectedCountry] = useState(countryCodes.find(c => c.dial_code === '+91') || countryCodes[0]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCountries = countryCodes.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dial_code.includes(searchQuery)
    );

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

        // if (password !== confirmPassword) {
        //     newErrors.confirmPassword = 'Passwords do not match';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const formattedMobile = `${selectedCountry.dial_code} ${mobile.trim()}`;

            const response = await authAPI.register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                mobile: formattedMobile,
                password: password,
                sponsor: sponsor || '',
            });

            console.log('Registration successful:', response);

            // Store token and user data using AppContext
            await login(response.token, response.User);

            // Fetch project config to get register bonus amount
            try {
                const configResponse = await userAPI.getProjectConfig();
                if (configResponse?.register_bonus?.status === 1) {
                    setRegisterBonusAmount(configResponse.register_bonus.income || 50);
                }
            } catch (configError) {
                console.log('Error fetching project config:', configError);
            }

            // Check if sponsor code was used
            const usedSponsor = sponsor && sponsor.trim() !== '';
            setHasSponsor(usedSponsor);

            // Show success alert first
            setShowSuccessAlert(true);

        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
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
                                {/* Header Section with Icon */}
                                <View style={styles.headerContainer}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                                        <MaterialCommunityIcons
                                            name="shield-account-outline"
                                            size={moderateScale(32)}
                                            color={colors.primary}
                                        />
                                    </View>
                                    <CText style={[styles.welcomeText, { color: colors.textPrimary }]} numberOfLines={1}>Create Account</CText>
                                    <CText style={[styles.subtitleText, { color: colors.textSecondary }]} numberOfLines={1}>Join us and start your journey</CText>
                                </View>

                                {/* Register Card */}
                                <CCard style={[styles.registerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    {/* Name Input */}
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            // label="Full Name"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                            leftIcon="account-outline"
                                        />
                                        {errors.name && <CText style={[styles.errorText, { color: colors.error }]}>{errors.name}</CText>}
                                    </View>

                                    {/* Email Input */}
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            // label="Email Address"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            leftIcon="email-outline"
                                        />
                                        {errors.email && <CText style={[styles.errorText, { color: colors.error }]}>{errors.email}</CText>}
                                    </View>

                                    {/* Mobile Input */}
                                    <View style={styles.inputContainer}>
                                        <View style={styles.mobileInputRow}>
                                            <TouchableOpacity
                                                style={[styles.countryPickerButton, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                                                onPress={() => setShowCountryPicker(true)}
                                            >
                                                <CText style={[styles.countryDialCode, { color: colors.textPrimary }]}>{selectedCountry.dial_code}</CText>
                                                <MaterialCommunityIcons name="chevron-down" size={16} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                            <CInput
                                                style={styles.mobileInput}
                                                placeholder="Mobile number"
                                                value={mobile}
                                                onChangeText={setMobile}
                                                keyboardType="phone-pad"
                                                leftIcon="phone-outline"
                                                maxLength={10}
                                            />
                                        </View>
                                        {errors.mobile && <CText style={[styles.errorText, { color: colors.error }]}>{errors.mobile}</CText>}
                                    </View>

                                    {/* Password Input */}
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            // label="Password"
                                            placeholder="Create password"
                                            value={password}
                                            onChangeText={setPassword}
                                            showPasswordToggle={true}
                                            leftIcon="lock-outline"
                                        />
                                        {errors.password && <CText style={[styles.errorText, { color: colors.error }]}>{errors.password}</CText>}
                                    </View>

                                    {/* Sponsor Code Input */}
                                    <View style={styles.inputContainer}>
                                        <CInput
                                            // label="Sponsor Code (Optional)"
                                            placeholder="Enter sponsor code (Optional)"
                                            value={sponsor}
                                            onChangeText={setSponsor}
                                            autoCapitalize="none"
                                            leftIcon="account-star-outline"
                                        />
                                    </View>

                                    {/* Register Button */}
                                    <TouchableOpacity
                                        style={[styles.registerButton, { backgroundColor: colors.primary, shadowColor: colors.primary }, loading && styles.registerButtonDisabled]}
                                        onPress={handleRegister}
                                        disabled={loading}
                                        activeOpacity={0.8}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={colors.black} size="small" />
                                        ) : (
                                            <CText style={[styles.registerButtonText, { color: colors.black }]}>Sign Up</CText>
                                        )}
                                    </TouchableOpacity>
                                </CCard>

                                {/* Login Link */}
                                <View style={styles.loginContainer}>
                                    <CText style={[styles.loginText, { color: colors.textSecondary }]} numberOfLines={1}>Already have an account? </CText>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <CText style={[styles.loginLink, { color: colors.primary }]}>Login</CText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

                <CustomAlert
                    visible={showAlert}
                    title="Registration Error"
                    message={alertMessage}
                    showConfirm={false}
                    buttonText="OK"
                    onClose={() => setShowAlert(false)}
                />

                <CustomAlert
                    visible={showSuccessAlert}
                    title="Registration Successful"
                    message="Welcome to ContoZ-Bet! Your account has been created successfully."
                    showConfirm={false}
                    buttonText="OK"
                    onClose={() => {
                        setShowSuccessAlert(false);
                        // Navigate to MainApp with welcome bonus params
                        navigation.replace('MainApp', {
                            showWelcomeBonus: hasSponsor,
                            registerBonusAmount: registerBonusAmount
                        });
                    }}
                />

                {/* Country Picker Modal */}
                <Modal
                    visible={showCountryPicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowCountryPicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <View style={styles.modalHeader}>
                                <CText style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Country</CText>
                                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                    <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
                                </TouchableOpacity>
                            </View>

                            <CInput
                                placeholder="Search country or code"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                leftIcon="magnify"
                                style={styles.modalSearch}
                            />

                            <FlatList
                                data={filteredCountries}
                                keyExtractor={(item) => item.code + item.dial_code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.countryItem, { borderBottomColor: colors.border }]}
                                        onPress={() => {
                                            setSelectedCountry(item);
                                            setShowCountryPicker(false);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <CText style={[styles.countryName, { color: colors.textPrimary }]}>{item.name}</CText>
                                        <CText style={[styles.countryCodeText, { color: colors.primary }]}>{item.dial_code}</CText>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>
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
        right: -width * 0.2,
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        opacity: 0.08,
    },
    blobBottom: {
        position: 'absolute',
        bottom: -width * 0.3,
        left: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        opacity: 0.05,
        transform: [{ scaleX: 1.2 }],
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: moderateScale(20),
        paddingVertical: verticalScale(20),
    },
    contentWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    iconContainer: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(8),
        borderWidth: 1,
    },
    welcomeText: {
        fontSize: moderateScale(22),
        fontWeight: 'bold',
        marginBottom: verticalScale(4),
    },
    subtitleText: {
        fontSize: moderateScale(13),
    },
    registerCard: {
        width: '100%',
        paddingVertical: verticalScale(16),
        paddingHorizontal: moderateScale(20),
        borderWidth: 1,
    },
    inputContainer: {
        marginBottom: verticalScale(4),
    },
    errorText: {
        fontSize: moderateScale(12),
        marginTop: verticalScale(-12),
        marginBottom: verticalScale(8),
        marginLeft: moderateScale(4),
    },
    registerButton: {
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        marginTop: verticalScale(12),
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(16),
    },
    loginText: {
        fontSize: moderateScale(14),
    },
    loginLink: {
        fontSize: moderateScale(14),
        fontWeight: '700',
    },
    // Country Picker Styles
    mobileInputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(8),
    },
    countryPickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: verticalScale(54), // Matching CInput height roughly
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(12),
        borderWidth: 2,
        minWidth: moderateScale(80),
        marginTop: verticalScale(0),
    },
    countryDialCode: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        marginRight: moderateScale(4),
    },
    mobileInput: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '80%',
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        padding: moderateScale(20),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    modalTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
    },
    modalSearch: {
        marginBottom: verticalScale(10),
    },
    countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(16),
        borderBottomWidth: 1,
    },
    countryName: {
        fontSize: moderateScale(16),
        flex: 1,
    },
    countryCodeText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        marginLeft: moderateScale(10),
    },
});

export default RegisterScreen;
