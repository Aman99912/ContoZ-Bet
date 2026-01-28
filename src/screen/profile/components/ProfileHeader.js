import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileHeader = ({ name = 'General User', onEditPress }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.avatarCircle}>
                <MaterialCommunityIcons name="account" size={moderateScale(50)} color={colors.textSecondary} />
            </View>
            <CText style={styles.name}> {name}</CText>
            <TouchableOpacity style={styles.editButton} onPress={onEditPress} activeOpacity={0.8}>
                <CText style={styles.editButtonText}>Edit Profile</CText>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        padding: moderateScale(24),
        margin: moderateScale(16),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    avatarCircle: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(12),
        borderWidth: 2,
        borderColor: colors.border,
    },
    name: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(16),
    },
    editButton: {
        backgroundColor: colors.surface,
        paddingHorizontal: moderateScale(32),
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(24),
        borderWidth: 2,
        borderColor: colors.border,
    },
    editButtonText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.textPrimary,
    },
});

export default ProfileHeader;
