import React, { forwardRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '../CText/CText';
import { colors } from '@/core/theme/colors';

const CInput = forwardRef(({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    style,
    inputStyle,
    showPasswordToggle = false, // New prop to show eye button
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <View style={[styles.container, style]}>
            {label && <CText style={styles.label}>{label}</CText>}
            <View style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused
            ]}>
                <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
                    allowFontScaling={false}
                    style={[
                        styles.input,
                        showPasswordToggle && styles.inputWithIcon,
                        inputStyle
                    ]}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
                {showPasswordToggle && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.eyeButton}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={moderateScale(22)}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
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
    inputWrapper: {
        position: 'relative',
        backgroundColor: colors.inputBackground,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: moderateScale(12),
        flexDirection: 'row',
        alignItems: 'center',
        transition: 'border-color 0.1s',
    },
    inputWrapperFocused: {
        borderColor: colors.primary,
    },
    input: {
        flex: 1,
        padding: moderateScale(20),
        color: colors.textPrimary,
        fontSize: moderateScale(16),
        outlineStyle: 'none',
    },
    inputWithIcon: {
        paddingRight: moderateScale(50),
    },
    eyeButton: {
        position: 'absolute',
        right: moderateScale(14),
        padding: moderateScale(4),
    },
});

export default CInput;
