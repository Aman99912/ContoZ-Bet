import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, useTheme } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpAndSupport() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const handleEmailPress = () => {
        Linking.openURL('mailto:support@contoz-bet.com');
    };

    const handleWhatsAppPress = () => {
        Linking.openURL('https://wa.me/1234567890');
    };

    const handleCreateTicket = () => {
        // TODO: Navigate to Create Ticket screen
        console.log('Navigate to Create Ticket');
    };

    const handleTrackTicket = () => {
        // TODO: Navigate to Track Ticket screen
        console.log('Navigate to Track Ticket');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Support</CText>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <CText style={[styles.subtitle, { color: colors.textSecondary }]}>We're here to help you!</CText>

                    {/* Support Ticket Actions */}
                    <View style={styles.ticketActionsContainer}>
                        <TouchableOpacity
                            style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={handleCreateTicket}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                                <MaterialCommunityIcons name="ticket-plus-outline" size={moderateScale(28)} color={colors.primary} />
                            </View>
                            <CText style={[styles.ticketCardTitle, { color: colors.textPrimary }]}>Create Ticket</CText>
                            <CText style={[styles.ticketCardSubtitle, { color: colors.textSecondary }]}>Submit a new support request</CText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={handleTrackTicket}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                                <MaterialCommunityIcons name="ticket-outline" size={moderateScale(28)} color={colors.primary} />
                            </View>
                            <CText style={[styles.ticketCardTitle, { color: colors.textPrimary }]}>Track Ticket</CText>
                            <CText style={[styles.ticketCardSubtitle, { color: colors.textSecondary }]}>View your support tickets</CText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Us</CText>

                        <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleEmailPress} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="email-outline" size={moderateScale(32)} color={colors.primary} />
                            <View style={styles.contactInfo}>
                                <CText style={[styles.contactTitle, { color: colors.textPrimary }]}>Email Support</CText>
                                <CText style={[styles.contactText, { color: colors.textSecondary }]}>support@contoz-bet.com</CText>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handleWhatsAppPress} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="whatsapp" size={moderateScale(32)} color={colors.primary} />
                            <View style={styles.contactInfo}>
                                <CText style={[styles.contactTitle, { color: colors.textPrimary }]}>WhatsApp Support</CText>
                                <CText style={[styles.contactText, { color: colors.textSecondary }]}>+91 1234567890</CText>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>FAQs</CText>

                        <View style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <CText style={[styles.faqQuestion, { color: colors.textPrimary }]}>How do I add money to my wallet?</CText>
                            <CText style={[styles.faqAnswer, { color: colors.textSecondary }]}>Go to Wallet tab and tap on "Add Money" button.</CText>
                        </View>

                        <View style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <CText style={[styles.faqQuestion, { color: colors.textPrimary }]}>How do I withdraw my earnings?</CText>
                            <CText style={[styles.faqAnswer, { color: colors.textSecondary }]}>Transfer earnings to cash wallet, then use withdraw option.</CText>
                        </View>

                        <View style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <CText style={[styles.faqQuestion, { color: colors.textPrimary }]}>How long does withdrawal take?</CText>
                            <CText style={[styles.faqAnswer, { color: colors.textSecondary }]}>Withdrawals are processed within 24-48 hours.</CText>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
    },
    backButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
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
    subtitle: {
        fontSize: moderateScale(16),
        marginBottom: verticalScale(24),
    },
    ticketActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(24),
        gap: moderateScale(12),
    },
    ticketCard: {
        flex: 1,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: moderateScale(56),
        height: moderateScale(56),
        borderRadius: moderateScale(28),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    ticketCardTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        marginBottom: verticalScale(6),
    },
    ticketCardSubtitle: {
        fontSize: moderateScale(12),
        textAlign: 'center',
    },
    section: {
        marginBottom: verticalScale(24),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        marginBottom: verticalScale(12),
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
    },
    contactInfo: {
        flex: 1,
        marginLeft: moderateScale(16),
    },
    contactTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        marginBottom: 4,
    },
    contactText: {
        fontSize: moderateScale(14),
    },
    faqCard: {
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
    },
    faqQuestion: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        marginBottom: verticalScale(8),
    },
    faqAnswer: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
    },
});
