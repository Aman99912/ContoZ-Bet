import React from 'react';
import { View, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '../CText/CText';
import BackButton from '../BackButton/BackButton';

const Header = ({ title, showBack, onBackPress, rightComponent }) => {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                {showBack && <BackButton onPress={onBackPress} />}
            </View>
            <View style={styles.center}>
                <CText style={styles.title}>{title}</CText>
            </View>
            <View style={styles.right}>
                {rightComponent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        backgroundColor: '#0f172a',
    },
    left: {
        flex: 1,
        alignItems: 'flex-start',
    },
    center: {
        flex: 2,
        alignItems: 'center',
    },
    right: {
        flex: 1,
        alignItems: 'flex-end',
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#f8fafc',
    },
});

export default Header;
