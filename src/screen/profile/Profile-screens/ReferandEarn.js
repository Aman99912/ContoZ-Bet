import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReferAndEarn() {
    const navigation = useNavigation();
    const referralLink = 'https://contoz-bet.com/ref/USER123';
    const [copied, setCopied] = useState(false);

    // Dummy data for joined users
    const joinedUsers = [
        { id: 1, name: 'Rahul Kumar', joinedDate: '2024-01-15' },
        { id: 2, name: 'Priya Sharma', joinedDate: '2024-01-18' },
        { id: 3, name: 'Amit Singh', joinedDate: '2024-01-20' },
        { id: 4, name: 'Neha Gupta', joinedDate: '2024-01-22' },
        { id: 5, name: 'Vikas Verma', joinedDate: '2024-01-25' },
    ];

    const handleCopy = () => {
        Clipboard.setString(referralLink);
        setCopied(true);
        Alert.alert('Copied!', 'Referral link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={styles.headerTitle}>Refer & Earn</CText>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.subtitleContainer}>
                        <CText style={styles.subtitle}>Invite Friends & Earn Rewards!</CText>
                        <CText style={styles.rewardText}>Get ₹30 for Every Referral 🎁</CText>
                    </View>

                    {/* QR Code Section */}
                    <View style={styles.qrSection}>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={referralLink}
                                size={moderateScale(180)}
                                backgroundColor={colors.surface}
                                color={colors.textPrimary}
                            />
                        </View>
                        <CText style={styles.qrLabel}>Or</CText>
                    </View>

                    {/* Referral Link Section */}
                    <View style={styles.linkSection}>
                        {/* <CText style={styles.sectionTitle}>Share Your  Link</CText> */}
                        <View style={styles.linkContainer}>
                            <View style={styles.linkBox}>
                                <CText style={styles.linkText} numberOfLines={1}>{referralLink}</CText>
                            </View>
                            <TouchableOpacity style={styles.copyButton} onPress={handleCopy} activeOpacity={0.8}>
                                <MaterialCommunityIcons
                                    name={copied ? 'check' : 'content-copy'}
                                    size={moderateScale(20)}
                                    color={colors.black}
                                />
                                <CText style={styles.copyButtonText}>{copied ? 'Copied' : 'Copy'}</CText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Joined Users Section */}
                    <View style={styles.usersSection}>
                        <View style={styles.usersSectionHeader}>
                            <CText style={styles.sectionTitle} numberOfLines={1}>Joined Users</CText>
                            <View style={styles.countBadge}>
                                <CText style={styles.countText}>{joinedUsers.length}</CText>
                            </View>
                        </View>

                        {joinedUsers.map((user) => (
                            <View key={user.id} style={styles.userCard}>
                                <View style={styles.userAvatar}>
                                    <MaterialCommunityIcons name="account" size={moderateScale(24)} color={colors.primary} />
                                </View>
                                <View style={styles.userInfo}>
                                    <CText style={styles.userName}>{user.name}</CText>
                                    <CText style={styles.userDate}>Joined: {user.joinedDate}</CText>
                                </View>
                                <MaterialCommunityIcons name="check-circle" size={moderateScale(24)} color={colors.primary} />
                            </View>
                        ))}
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
    subtitleContainer: {
        marginBottom: verticalScale(24),
        alignItems: 'center',
    },
    subtitle: {
        fontSize: moderateScale(17),
        color: colors.textPrimary,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: verticalScale(8),
    },
    rewardText: {
        fontSize: moderateScale(15),
        color: colors.primary,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    qrSection: {
        alignItems: 'center',
        marginBottom: verticalScale(32),
    },
    qrContainer: {
        backgroundColor: colors.surface,
        padding: moderateScale(20),
        borderRadius: moderateScale(16),
        borderWidth: 2,
        borderColor: colors.border,
        marginBottom: verticalScale(16),
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    qrLabel: {
        fontSize: moderateScale(20),
        color: colors.textSecondary,
        fontWeight: '700',
    },
    linkSection: {
        marginBottom: verticalScale(32),
        marginTop: verticalScale(-20),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(16),
    },
    linkContainer: {
        flexDirection: 'row',
        gap: moderateScale(12),
    },
    linkBox: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    linkText: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
    },
    copyButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(12),
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    copyButtonText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.black,
    },
    usersSection: {
        marginBottom: verticalScale(24),
        marginTop: verticalScale(-10),
    },
    usersSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        gap: moderateScale(12),
    },
    countBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(3),
        borderRadius: moderateScale(12),
        top: verticalScale(-7),
    },
    countText: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        color: colors.black,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    userAvatar: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(14),
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    userDate: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
});
