import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileHeader = ({ name = 'User', username = '', onEditPress }) => {
    const { colors, theme, toggleTheme } = useTheme();

    // Get first letter of name for avatar
    const getInitial = () => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                <CText style={[styles.avatarLetter, { color: colors.black }]}>{getInitial()}</CText>
            </View>

            <View style={styles.infoContainer}>
                <CText style={[styles.name, { color: colors.textPrimary }]}>{name}</CText>
                {username && <CText style={[styles.username, { color: colors.textSecondary }]}>@{username}</CText>}
                <TouchableOpacity
                    style={[styles.editButton, { borderColor: colors.primary, backgroundColor: colors.background }]}
                    onPress={onEditPress}
                    activeOpacity={0.8}
                >
                    <CText style={[styles.editButtonText, { color: colors.primary }]}>Edit Profile</CText>
                </TouchableOpacity>
            </View>

            {/* Theme Toggle */}
            <TouchableOpacity
                onPress={toggleTheme}
                style={styles.themeToggle}
            >
                <MaterialCommunityIcons
                    name={theme === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
                    size={moderateScale(24)}
                    color={theme === 'dark' ? '#FFD700' : colors.textPrimary}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        padding: moderateScale(20),
        margin: moderateScale(16),
        borderRadius: moderateScale(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarCircle: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(35),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarLetter: {
        fontSize: moderateScale(28),
        fontWeight: 'bold',
        color: colors.black,
    },
    infoContainer: {
        flex: 1,
        marginLeft: moderateScale(16),
        justifyContent: 'center',
    },
    name: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(2),
    },
    username: {
        fontSize: moderateScale(13),
        color: colors.textSecondary,
        marginBottom: verticalScale(8),
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(20),
        borderWidth: 1.5,
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    editButtonText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: colors.primary,
        marginLeft: moderateScale(6),
    },
    themeToggle: {
        padding: moderateScale(8),
        marginLeft: moderateScale(8),
    },
});

export default ProfileHeader;
