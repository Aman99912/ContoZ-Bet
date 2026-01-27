import React from 'react';
import { View, StyleSheet } from 'react-native';
import { moderateScale } from '@/core/utils/responsive';

import { colors } from '@/core/theme/colors';

const CCard = ({ children, style }) => {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: moderateScale(24),
        padding: moderateScale(24),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
});

export default CCard;
