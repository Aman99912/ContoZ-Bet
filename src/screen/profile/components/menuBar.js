import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const MenuBar = ({
    onReferPress,
    onMyGamesPress,
    onNotificationsPress,
    onTermsPress,
    onPrivacyPress,
    onHelpPress,
    onLogoutPress
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {/* Rewards Section */}
            <CText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Rewards</CText>
            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]}
                onPress={onReferPress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="gift-outline" size={moderateScale(24)} color={colors.primary} />
                <CText style={[styles.menuButtonText, { color: colors.textPrimary }]}>Refer & Earn</CText>
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <CText style={[styles.badgeText, { color: colors.black }]}>₹30</CText>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Activity Section */}
            <CText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Activity</CText>
            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]}
                onPress={onMyGamesPress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="gamepad-variant-outline" size={moderateScale(24)} color={colors.textPrimary} />
                <CText style={[styles.menuButtonText, { color: colors.textPrimary }]}>My Games</CText>
                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]}
                onPress={onNotificationsPress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="bell-outline" size={moderateScale(24)} color={colors.textPrimary} />
                <CText style={[styles.menuButtonText, { color: colors.textPrimary }]}>Notifications</CText>
                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Legal Section */}
            <CText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Legal</CText>
            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]}
                onPress={onTermsPress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="file-document-outline" size={moderateScale(24)} color={colors.textPrimary} />
                <CText style={[styles.menuButtonText, { color: colors.textPrimary }]}>Terms & Conditions</CText>
                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]}
                onPress={onPrivacyPress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="shield-lock-outline" size={moderateScale(24)} color={colors.textPrimary} />
                <CText style={[styles.menuButtonText, { color: colors.textPrimary }]}>Privacy Policy</CText>
                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Support Section */}
            <CText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support</CText>
            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]}
                onPress={onHelpPress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="help-circle-outline" size={moderateScale(24)} color={colors.textPrimary} />
                <CText style={[styles.menuButtonText, { color: colors.textPrimary }]}>Help & Support</CText>
                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.error, shadowColor: colors.error }]}
                onPress={onLogoutPress}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="logout" size={moderateScale(24)} color={colors.error} />
                <CText style={[styles.logoutButtonText, { color: colors.error }]}>Logout</CText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: moderateScale(16),
        paddingBottom: verticalScale(24),
    },
    sectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: verticalScale(12),
        marginBottom: verticalScale(12),
        marginLeft: moderateScale(4),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuButtonText: {
        flex: 1,
        fontSize: moderateScale(16),
        color: colors.textPrimary,
        marginLeft: moderateScale(12),
        fontWeight: '500',
    },
    badge: {
        backgroundColor: colors.primary,
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(12),
        marginRight: moderateScale(8),
    },
    badgeText: {
        fontSize: moderateScale(12),
        fontWeight: 'bold',
        color: colors.black,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginTop: verticalScale(24),
        borderWidth: 2,
        borderColor: colors.error,
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    logoutButtonText: {
        fontSize: moderateScale(16),
        color: colors.error,
        marginLeft: moderateScale(12),
        fontWeight: 'bold',
    },
});

export default MenuBar;
