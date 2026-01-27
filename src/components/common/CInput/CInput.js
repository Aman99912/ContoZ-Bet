import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '../CText/CText';

import { colors } from '@/core/theme/colors';

const CInput = forwardRef(({ label, value, onChangeText, placeholder, secureTextEntry, style, inputStyle, ...props }, ref) => {
    return (
        <View style={[styles.container, style]}>
            {label && <CText style={styles.label}>{label}</CText>}
            <TextInput
                ref={ref}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={secureTextEntry}
                allowFontScaling={false}
                style={[styles.input, inputStyle]}
                {...props}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: verticalScale(16),
    },
    label: {
        marginBottom: verticalScale(8),
        color: colors.textPrimary,
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        color: colors.textPrimary,
        fontSize: moderateScale(16),
    },
});

export default CInput;
