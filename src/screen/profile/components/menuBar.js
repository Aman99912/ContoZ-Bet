import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const MenuBar = ({ onHelpPress, onLogoutPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuButton} onPress={onHelpPress} activeOpacity={0.8}>
                <MaterialCommunityIcons name="help-circle-outline" size={moderateScale(24)} color={colors.textPrimary} />
                <CText style={styles.menuButtonText}>Help and Support</CText>
                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress} activeOpacity={0.8}>
                <MaterialCommunityIcons name="logout" size={moderateScale(24)} color={colors.error} />
                <CText style={styles.logoutButtonText}>Logout</CText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: moderateScale(16),
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
    },
    menuButtonText: {
        flex: 1,
        fontSize: moderateScale(16),
        color: colors.textPrimary,
        marginLeft: moderateScale(12),
        fontWeight: '500',
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
    },
    logoutButtonText: {
        fontSize: moderateScale(16),
        color: colors.error,
        marginLeft: moderateScale(12),
        fontWeight: 'bold',
    },
});

export default MenuBar;
