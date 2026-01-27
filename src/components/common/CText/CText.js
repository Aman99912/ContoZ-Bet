import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { moderateScale } from '@/core/utils/responsive';

import { colors } from '@/core/theme/colors';

const CText = ({ style, children, ...props }) => {
    // Flatten style to extract fontSize for lineHeight calculation
    const flattenedStyle = StyleSheet.flatten(style || {});
    const fontSize = flattenedStyle.fontSize || moderateScale(14);

    const defaultStyle = {
        lineHeight: fontSize * 1.3, // Provide space for Hindi matras
        textAlignVertical: 'center',
    };

    return (
        <RNText
            allowFontScaling={false}
            style={[styles.text, defaultStyle, style]}
            {...props}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        textAlign: 'left', // Ensure default left alignment
        writingDirection: 'ltr', // Force LTR for consistency
        includeFontPadding: false, // Prevent script-based vertical shifting on Android
    },
});

export default CText;
