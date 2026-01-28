import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

export default function PrivacyPolicy() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={styles.headerTitle}>Privacy Policy</CText>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <CText style={styles.lastUpdated}>Last updated: January 28, 2026</CText>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>1. Information We Collect</CText>
                        <CText style={styles.sectionText}>
                            We collect information you provide directly to us, including your name, email address, phone number, payment information, and gameplay data. We also collect device information and usage data to improve our services.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>2. How We Use Your Information</CText>
                        <CText style={styles.sectionText}>
                            We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>3. Information Sharing</CText>
                        <CText style={styles.sectionText}>
                            We do not sell your personal information. We may share your information with service providers who perform services on our behalf, such as payment processing and data analysis.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>4. Data Security</CText>
                        <CText style={styles.sectionText}>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>5. Payment Information</CText>
                        <CText style={styles.sectionText}>
                            All payment transactions are processed through secure payment gateways. We do not store your complete card details on our servers. Payment information is encrypted and handled in compliance with PCI-DSS standards.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>6. Cookies and Tracking</CText>
                        <CText style={styles.sectionText}>
                            We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve and analyze our service.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>7. Your Rights</CText>
                        <CText style={styles.sectionText}>
                            You have the right to access, update, or delete your personal information. You can also object to processing of your personal information and request data portability.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>8. Children's Privacy</CText>
                        <CText style={styles.sectionText}>
                            Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children under 18.
                        </CText>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>9. Changes to Privacy Policy</CText>
                        <CText style={styles.sectionText}>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </CText>
                    </View>

                    <View style={styles.contactBox}>
                        <CText style={styles.contactTitle}>Contact Us</CText>
                        <CText style={styles.contactText}>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </CText>
                        <CText style={styles.contactEmail}>privacy@contoz-bet.com</CText>
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
        marginBottom: verticalScale(4),
    },
    contactEmail: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '600',
    },
});
