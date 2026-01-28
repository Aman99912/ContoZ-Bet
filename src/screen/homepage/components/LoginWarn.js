import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const LoginWarn = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
        >
            <CText style={styles.loginText}>Login</CText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: moderateScale(24),
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(24),
        borderWidth: 2,
        borderColor: colors.primary,
    },
    loginText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.black,
    },
});

export default LoginWarn;
