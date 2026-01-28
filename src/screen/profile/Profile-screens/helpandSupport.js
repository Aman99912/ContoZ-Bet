import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

export default function HelpAndSupport() {
    const handleEmailPress = () => {
        Linking.openURL('mailto:support@contoz-bet.com');
    };

    const handleWhatsAppPress = () => {
        Linking.openURL('https://wa.me/1234567890');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <CText style={styles.title}>Help & Support</CText>
                    <CText style={styles.subtitle}>We're here to help you!</CText>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>Contact Us</CText>

                        <TouchableOpacity style={styles.contactCard} onPress={handleEmailPress} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="email-outline" size={moderateScale(32)} color={colors.primary} />
                            <View style={styles.contactInfo}>
                                <CText style={styles.contactTitle}>Email Support</CText>
                                <CText style={styles.contactText}>support@contoz-bet.com</CText>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactCard} onPress={handleWhatsAppPress} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="whatsapp" size={moderateScale(32)} color={colors.primary} />
                            <View style={styles.contactInfo}>
                                <CText style={styles.contactTitle}>WhatsApp Support</CText>
                                <CText style={styles.contactText}>+91 1234567890</CText>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>FAQs</CText>

                        <View style={styles.faqCard}>
                            <CText style={styles.faqQuestion}>How do I add money to my wallet?</CText>
                            <CText style={styles.faqAnswer}>Go to Wallet tab and tap on "Add Money" button.</CText>
                        </View>

                        <View style={styles.faqCard}>
                            <CText style={styles.faqQuestion}>How do I withdraw my earnings?</CText>
                            <CText style={styles.faqAnswer}>Transfer earnings to cash wallet, then use withdraw option.</CText>
                        </View>

                        <View style={styles.faqCard}>
                            <CText style={styles.faqQuestion}>How long does withdrawal take?</CText>
                            <CText style={styles.faqAnswer}>Withdrawals are processed within 24-48 hours.</CText>
                        </View>
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
    scroll: {
        flex: 1,
    },
    content: {
        padding: moderateScale(16),
    },
    title: {
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
    },
    subtitle: {
        fontSize: moderateScale(16),
        color: colors.textSecondary,
        marginBottom: verticalScale(24),
    },
    section: {
        marginBottom: verticalScale(24),
    },
    sectionTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(12),
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: colors.border,
    },
    contactInfo: {
        flex: 1,
        marginLeft: moderateScale(16),
    },
    contactTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    contactText: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
    },
    faqCard: {
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: colors.border,
    },
    faqQuestion: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
    },
    faqAnswer: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        lineHeight: moderateScale(20),
    },
});
