import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { moderateScale } from '@/core/utils/responsive';
import { MaterialIcons } from '@expo/vector-icons';

const BackButton = ({ onPress, style }) => {
    useEffect(() => {
        const backAction = () => {
            if (onPress) {
                onPress();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [onPress]);

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <MaterialIcons name="chevron-left" size={moderateScale(32)} color="#38bdf8" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: moderateScale(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BackButton;
