import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

export default function TermsAndConditions() {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Terms & Conditions</CText>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <CText style={[styles.lastUpdated, { color: colors.textSecondary }]}>Last updated: January 28, 2026</CText>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>1. Acceptance of Terms</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            By accessing and using Conto-Z Bet, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>2. Eligibility</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            You must be at least 18 years old to use this platform. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into this agreement.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>3. User Account</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>4. Fair Play Policy</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            All users must play fairly. Any form of cheating, hacking, or unfair advantage will result in immediate account suspension and forfeiture of winnings.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>5. Payments & Withdrawals</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            All transactions are processed securely. Withdrawal requests are processed within 24-48 hours. Minimum withdrawal amount is ₹100. GST and other applicable taxes will be deducted as per government regulations.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>6. Prohibited Activities</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            Users are prohibited from: using bots or automated systems, creating multiple accounts, engaging in money laundering, or any illegal activities on the platform.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>7. Limitation of Liability</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            Conto-Z Bet shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>8. Changes to Terms</CText>
                        <CText style={[styles.sectionText, { color: colors.textSecondary }]}>
                            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                        </CText>
                    </View>

                    <View style={[styles.contactBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <CText style={[styles.contactTitle, { color: colors.primary }]}>Questions?</CText>
                        <CText style={[styles.contactText, { color: colors.textSecondary }]}>
                            If you have any questions about these Terms & Conditions, please contact us at support@contoz-bet.com
                        </CText>
                    </View>
                </View>
            </ScrollView>
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
        padding: moderateScale(20),
    },
    lastUpdated: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        marginBottom: verticalScale(24),
        fontStyle: 'italic',
    },
    section: {
        marginBottom: verticalScale(24),
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
    },
    sectionText: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        lineHeight: moderateScale(22),
    },
    contactBox: {
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: verticalScale(16),
    },
    contactTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: verticalScale(8),
    },
    contactText: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        lineHeight: moderateScale(20),
    },
});
