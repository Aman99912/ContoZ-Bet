import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CustomAlert from '@/components/common/CustomAlert';
import { useApp } from '@/context/AppContext';

const BannerCard = ({ title, subtitle, image, onPress }) => {
    const navigation = useNavigation();
    const { user, isLoggedIn } = useApp();
    const handlePress = () => {
        onPress?.();
    };

    return (
        <TouchableOpacity style={styles.banner} onPress={handlePress} activeOpacity={0.9}>
            {image && <Image source={image} style={styles.bgImage} />}
            <View style={styles.overlay}>
                <CText style={styles.title}>{title}</CText>
                {subtitle && <CText style={styles.subtitle}>{subtitle}</CText>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    banner: {
        height: verticalScale(140),
        borderRadius: moderateScale(16),
        overflow: 'hidden',
        marginBottom: verticalScale(16),
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    bgImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
    },
    title: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '600',
    },
});

export default BannerCard;
