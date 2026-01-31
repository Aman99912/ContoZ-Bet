import { View, StyleSheet } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PlayerCard = ({ name, symbol, image, isActive, isTurn }) => {
    return (
        <View style={styles.container}>
            <View style={[
                styles.card,
                isActive && styles.activeCard,
                {
                    backgroundColor: isActive ? '#3D2A9E' : gamesColor.cardBackground,
                    borderColor: isActive ? gamesColor.player1 + '80' : gamesColor.cardBorder
                }
            ]}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarSquare}>
                        {/* 3D Depth Layer */}
                        <View style={styles.avatarDepth} />
                        <View style={styles.avatarSurface}>
                            <MaterialCommunityIcons
                                name="account"
                                size={moderateScale(32)}
                                color="#FFF"
                            />
                        </View>
                    </View>
                    <View style={[styles.symbolBadge, { backgroundColor: symbol === 'X' ? gamesColor.player1 : gamesColor.player2 }]}>
                        <MaterialCommunityIcons
                            name={symbol === 'X' ? "close" : "circle-outline"}
                            size={moderateScale(12)}
                            color="#FFF"
                        />
                    </View>
                </View>
                <CText style={styles.name} numberOfLines={1}>{name}</CText>
                <CText style={[styles.symbolText, { color: symbol === 'X' ? gamesColor.player1 : gamesColor.player2 }]}>
                    {symbol}
                </CText>
            </View>
            <View style={styles.turnIndicatorContainer}>
                {isTurn && (
                    <CText style={styles.turnIndicator}>YOUR TURN</CText>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: moderateScale(10),
    },
    card: {
        width: moderateScale(100),
        paddingVertical: verticalScale(10),
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(15),
        alignItems: 'center',
        borderWidth: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: verticalScale(8),
    },
    avatarSquare: {
        width: moderateScale(54),
        height: moderateScale(54),
        borderRadius: moderateScale(12),
        backgroundColor: '#2A1B7A', // Darker base for 3D effect
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#4A36B6',
    },
    avatarDepth: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '20%',
        backgroundColor: '#00000040',
    },
    avatarSurface: {
        width: '100%',
        height: '100%',
        backgroundColor: '#4A36B6',
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: '#00000030',
    },
    symbolBadge: {
        position: 'absolute',
        bottom: -moderateScale(4),
        right: -moderateScale(4),
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: gamesColor.background,
        elevation: 4,
    },
    name: {
        fontSize: moderateScale(14),
        fontWeight: '800',
        color: gamesColor.textPrimary,
        marginBottom: verticalScale(4),
    },
    symbolText: {
        fontSize: moderateScale(20),
        fontWeight: '900',
    },
    turnIndicatorContainer: {
        height: verticalScale(20),
        marginTop: verticalScale(8),
    },
    turnIndicator: {
        fontSize: moderateScale(12),
        fontWeight: '900',
        color: gamesColor.textPrimary,
        letterSpacing: 1,
    },
    activeCard: {
        shadowColor: gamesColor.player1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
});

export default PlayerCard;
