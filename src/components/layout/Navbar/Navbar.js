import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CText from '@/components/common/CText';
import { moderateScale } from '@/core/utils/responsive';

import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.navbar}>
            <CText style={styles.brand}>Perception</CText>
            <View style={styles.navLinks}>
                <TouchableOpacity style={styles.navButton}>
                    <CText numberOfLines={1} adjustsFontSizeToFit style={styles.navText}>{t('home')}</CText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <CText numberOfLines={1} adjustsFontSizeToFit style={styles.navText}>{t('scan')}</CText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <CText numberOfLines={1} adjustsFontSizeToFit style={styles.navText}>{t('reports')}</CText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        height: moderateScale(60),
        backgroundColor: '#1e293b',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    brand: {
        color: '#38bdf8',
        fontSize: moderateScale(20),
        fontWeight: '800',
    },
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        paddingVertical: moderateScale(5),
        minWidth: moderateScale(65), // Fixed width to prevent shifting
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        color: '#94a3b8',
        fontSize: moderateScale(14),
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Navbar;
