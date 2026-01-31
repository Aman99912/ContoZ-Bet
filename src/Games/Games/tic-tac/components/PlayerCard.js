import { View, StyleSheet } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PlayerCard = ({ name, symbol, isActive, isTurn }) => {
    return (
        <View style={styles.container}>
            <View style={[
                styles.card,
                isActive && styles.activeCard,
                {
                    backgroundColor: isActive ? '#241a5e' : gamesColor.cardBackground,
                    borderColor: isActive ? gamesColor.primary : gamesColor.cardBorder
                }
            ]}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatarSquare, { borderColor: isActive ? gamesColor.primary + '60' : '#4A36B6' }]}>
                        <View style={styles.avatarDepth} />
                        <View style={[styles.avatarSurface, { backgroundColor: isActive ? '#3D2A9E' : '#4A36B6' }]}>
                            <MaterialCommunityIcons
                                name="account"
                                size={moderateScale(32)}
                                color={isActive ? gamesColor.primary : "#FFF"}
                            />
                        </View>
                    </View>
                    <View style={[styles.symbolBadge, { backgroundColor: symbol === 'X' ? gamesColor.player1 : gamesColor.player2 }]}>
                        <MaterialCommunityIcons
                            name={symbol === 'X' ? "close" : "circle-outline"}
                            size={moderateScale(12)}
                            color="#000"
                        />
                    </View>
                </View>
                <CText style={[styles.name, isActive && { color: gamesColor.primary }]} numberOfLines={1}>{name}</CText>
            </View>
            {isActive && <View style={styles.activeIndicator} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: moderateScale(10),
    },
    card: {
        width: moderateScale(96),
        height: moderateScale(96),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: verticalScale(6),
    },
    avatarSquare: {
        width: moderateScale(54),
        height: moderateScale(54),
        borderRadius: moderateScale(14),
        backgroundColor: '#1A114B',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderWidth: 1.5,
    },
    avatarDepth: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '25%',
        backgroundColor: '#00000050',
    },
    avatarSurface: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#00000020',
    },
    symbolBadge: {
        position: 'absolute',
        top: -moderateScale(2),
        left: -moderateScale(2),
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(11),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: gamesColor.background,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    name: {
        fontSize: moderateScale(12),
        fontWeight: '900',
        color: gamesColor.textPrimary,
        marginTop: verticalScale(2),
        letterSpacing: 0.5,
    },
    activeCard: {
        shadowColor: gamesColor.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 15,
    },
    activeIndicator: {
        width: moderateScale(20),
        height: verticalScale(3),
        backgroundColor: gamesColor.primary,
        marginTop: verticalScale(6),
        borderRadius: moderateScale(2),
        shadowColor: gamesColor.primary,
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
});

export default PlayerCard;
