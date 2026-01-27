import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '../CText/CText';

const CInput = ({ label, value, onChangeText, placeholder, secureTextEntry, style, ...props }) => {
    return (
        <View style={[styles.container, style]}>
            {label && <CText style={styles.label}>{label}</CText>}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                secureTextEntry={secureTextEntry}
                allowFontScaling={false}
                style={styles.input}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: verticalScale(16),
    },
    label: {
        marginBottom: verticalScale(8),
        color: '#f8fafc',
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: moderateScale(12),
        padding: moderateScale(12),
        color: '#f8fafc',
        fontSize: moderateScale(16),
    },
});

export default CInput;
