import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const VerificationWarning = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('EmailVerify')}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="alert-circle" size={moderateScale(24)} color={colors.error} />
            </View>
            <View style={styles.textContainer}>
                <CText style={[styles.title, { color: colors.textPrimary }]}>Verify Your Email</CText>
                <CText style={[styles.subtitle, { color: colors.textSecondary }]}>Click here to verify your profile</CText>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        margin: moderateScale(16),
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        borderWidth: 1.5,
        borderColor: colors.error,
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: moderateScale(12),
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
});

export default VerificationWarning;
