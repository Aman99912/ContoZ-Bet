import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale, scale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CCard from '@/components/common/CCard';
import CInput from '@/components/common/CInput';

const LoginScreen = ({ navigation }) => {
    const [mobile, setMobile] = useState('');
    const [showPromocode, setShowPromocode] = useState(false);
    const [promocode, setPromocode] = useState('');
    const [isOtpModalVisible, setOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isSending, setIsSending] = useState(false);

    // Refs
    const otpRefs = useRef([]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isOtpModalVisible && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isOtpModalVisible, timer]);

    const handleContinue = () => {
        if (mobile.length === 10) {
            setIsSending(true);
            setTimeout(() => {
                setIsSending(false);
                setOtpModalVisible(true);
                setTimer(30);
            }, 1000);
        }
    };

    const handleVerifyOtp = () => {
        const otpValue = otp.join('');
        if (otpValue.length === 4) {
            console.log('Verifying OTP:', otpValue);
            setOtpModalVisible(false);
            navigation.replace('MainApp');
        }
    };

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="shield-lock" size={moderateScale(60)} color={colors.primary} />
                </View>
                <CText style={styles.header}>Welcome to</CText>
                <CText style={styles.headerTitle}>ContoZ</CText>

                {/* Form Section */}
                <View style={styles.formContent}>
                    <CText style={[styles.label, mobile.length > 0 && styles.labelActive]}>
                        Enter your phone number
                    </CText>

                    <View style={styles.phoneInputWrapper}>
                        <View style={styles.countryCode}>
                            <CText style={styles.flag}>🇮🇳</CText>
                            <CText style={styles.code}>+91</CText>
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="phone-pad"
                            maxLength={10}
                            placeholder="Mobile Number"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    {showPromocode ? (
                        <View style={styles.promoContainer}>
                            <TextInput
                                style={styles.promoInput}
                                placeholder="Enter referral code (8 digits)"
                                placeholderTextColor={colors.textSecondary}
                                value={promocode}
                                onChangeText={(t) => setPromocode(t.toUpperCase().slice(0, 8))}
                                maxLength={8}
                            />
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setShowPromocode(true)}>
                            <CText style={styles.addPromoText}>+ Add Promocode (optional)</CText>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.btn, (!mobile || isSending) && styles.btnDisabled]}
                        onPress={handleContinue}
                        disabled={!mobile || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator color={colors.black} />
                        ) : (
                            <View style={styles.btnContent}>
                                <MaterialCommunityIcons name="security" size={30} color={colors.textPrimary} style={{ marginRight: 8 }} />
                                <CText style={styles.btnText} numberOfLines={1}>Continue Securely</CText>
                            </View>
                        )}
                    </TouchableOpacity>

                    <CText style={styles.termsText}>
                        By continuing, I accept the <CText style={styles.link}>Terms & Conditions</CText>
                    </CText>
                </View>
            </ScrollView>

            {/* OTP Modal */}
            <Modal
                visible={isOtpModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setOtpModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setOtpModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <CCard style={styles.otpCard}>
                                    <CText style={styles.modalTitle}>Enter Verification Code</CText>
                                    <CText style={styles.modalSubtitle}>Sent to +91 {mobile}</CText>

                                    <View style={styles.otpRow}>
                                        {otp.map((d, i) => (
                                            <TextInput
                                                key={i}
                                                ref={r => otpRefs.current[i] = r}
                                                style={[
                                                    styles.otpBox,
                                                    d ? styles.otpBoxFilled : styles.otpBoxEmpty
                                                ]}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                value={d}
                                                onChangeText={v => handleOtpChange(v, i)}
                                                onKeyPress={e => handleOtpKeyPress(e, i)}
                                                autoFocus={i === 0}
                                            />
                                        ))}
                                    </View>

                                    <TouchableOpacity
                                        style={styles.verifyBtn}
                                        onPress={handleVerifyOtp}
                                    >
                                        <CText style={styles.verifyBtnText}>VERIFY & LOGIN</CText>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setTimer(30)}
                                        disabled={timer > 0}
                                        style={{ marginTop: 16 }}
                                    >
                                        <CText style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
                                            Resend OTP {timer > 0 ? `(${timer}s)` : ''}
                                        </CText>
                                    </TouchableOpacity>
                                </CCard>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    logoContainer: { alignItems: 'center', marginTop: verticalScale(40), marginBottom: 16 },
    header: { fontSize: moderateScale(22), textAlign: 'center', color: colors.textSecondary },
    headerTitle: { fontSize: moderateScale(32), textAlign: 'center', fontWeight: 'bold', color: colors.textPrimary, marginBottom: 40 },

    formContent: { width: '100%', alignItems: 'center' },
    label: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, alignSelf: 'flex-start' },
    labelActive: { color: colors.primary },

    phoneInputWrapper: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        height: verticalScale(56),
        alignItems: 'center',
        marginBottom: 24,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: colors.border,
        height: '100%'
    },
    flag: { fontSize: 20, marginRight: 8 },
    code: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 18,
        color: colors.textPrimary,
        height: '100%',
    },

    promoContainer: {
        width: '100%',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        height: verticalScale(50),
        marginBottom: 24,
        paddingHorizontal: 12
    },
    promoInput: { flex: 1, fontSize: 16, color: colors.textPrimary, height: '100%' },
    addPromoText: { color: colors.primary, marginBottom: 24, fontWeight: '600' },

    btn: {
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: moderateScale(8),
        minHeight: verticalScale(56),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    btnDisabled: { opacity: 0.6 },
    btnContent: { flexDirection: 'row', alignItems: 'center' },
    btnText: { color: colors.white, fontSize: 22, fontWeight: 'bold', paddingVertical: moderateScale(15) }, // Dark text on primary green

    termsText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', top: moderateScale(120) },
    link: { color: colors.primary, textDecorationLine: 'underline' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
    modalContent: { alignItems: 'center' },
    otpCard: { width: '100%', alignItems: 'center', padding: 24, backgroundColor: colors.surface, borderRadius: 16 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8 },
    modalSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },

    otpRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 24, gap: 10 },
    otpBox: {
        flex: 1,
        height: verticalScale(54),
        borderWidth: 1,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        color: colors.textPrimary,
        backgroundColor: colors.inputBackground
    },
    otpBoxEmpty: { borderColor: colors.border },
    otpBoxFilled: { borderColor: colors.primary, backgroundColor: '#132e25' }, // Slight green tint

    verifyBtn: {
        width: '100%',
        backgroundColor: colors.primary,
        minHeight: verticalScale(56),
        borderRadius: moderateScale(8),
        justifyContent: 'center',
        alignItems: 'center'
    },
    verifyBtnText: { color: colors.white, fontWeight: 'bold', fontSize: 22 },
    resendText: { color: colors.primary, fontWeight: '600' },
    resendDisabled: { color: colors.textSecondary }
});

export default LoginScreen;
