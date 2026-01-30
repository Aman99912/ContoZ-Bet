import React, { forwardRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '../CText/CText';
import { useTheme, colors } from '@/core/theme/colors';

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
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <View style={[styles.container, style]}>
            {label && <CText style={[styles.label, { color: colors.textPrimary }]}>{label}</CText>}
            <View style={[
                styles.inputWrapper,
                { backgroundColor: colors.inputBackground, borderColor: colors.border },
                isFocused && { borderColor: colors.primary }
            ]}>
                {props.leftIcon && (
                    <MaterialCommunityIcons
                        name={props.leftIcon}
                        size={moderateScale(20)}
                        color={isFocused ? colors.primary : colors.textSecondary}
                        style={styles.leftIcon}
                    />
                )}
                {props.prefix && (
                    <CText style={[styles.prefix, { color: colors.textPrimary }]}>{props.prefix}</CText>
                )}
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
                        { color: colors.textPrimary },
                        showPasswordToggle && styles.inputWithIcon,
                        (props.leftIcon || props.prefix) && styles.inputWithLeftContent,
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
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    inputWrapper: {
        position: 'relative',
        borderWidth: 2,
        borderRadius: moderateScale(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: moderateScale(16),
        fontSize: moderateScale(16),
        outlineStyle: 'none',
    },
    inputWithIcon: {
        paddingRight: moderateScale(50),
    },
    inputWithLeftContent: {
        paddingLeft: moderateScale(8),
    },
    eyeButton: {
        position: 'absolute',
        right: moderateScale(14),
        padding: moderateScale(4),
    },
    leftIcon: {
        marginLeft: moderateScale(14),
    },
    prefix: {
        marginLeft: moderateScale(8),
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});

export default CInput;
