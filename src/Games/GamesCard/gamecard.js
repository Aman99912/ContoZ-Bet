import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - moderateScale(48)) / 2; // 2 cards per row with padding

const GameCard = ({ title, entryFee, prize, image, onPress, icon }) => {
    return (
        <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={onPress} activeOpacity={0.8}>
            {image ? (
                <Image source={image} style={styles.image} />
            ) : (
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={icon || 'gamepad-variant'} size={60} color={colors.primary} />
                </View>
            )}

            <View style={styles.footer}>
                <CText style={styles.entryFee}>Entry Fee: ₹{entryFee}</CText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: moderateScale(16),
        overflow: 'hidden',
        marginBottom: verticalScale(16),
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: '100%',
        height: verticalScale(120),
        resizeMode: 'cover',
    },
    iconContainer: {
        width: '100%',
        height: verticalScale(120),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
    },
    footer: {
        backgroundColor: colors.primary,
        padding: moderateScale(15),
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    entryFee: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default GameCard;

