import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GameWaiting = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const {
        gameTitle = '8 Ball Pool',
        gameIcon = 'billiards',
        entryFee = 50,
        prizePool = 90
    } = route.params || {};

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation for the VS badge
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Rotation for the searching indicator
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();

        // Auto-navigate to game after 3 seconds
        const timer = setTimeout(() => {
            if (gameTitle === 'Tic Tac Toe') {
                navigation.replace('TicTacToe', {
                    gameTitle,
                    entryFee,
                    prizePool
                });
            } else if (gameTitle === 'Carrom Board') {
                navigation.replace('CarromGame', {
                    gameTitle,
                    entryFee,
                    prizePool
                });
            }
            // Add other games here as they become real
        }, 3000);

        return () => clearTimeout(timer);
    }, [gameTitle, navigation]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="close" size={moderateScale(24)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Lobby Search</CText>
                <View style={styles.empty} />
            </View>

            <View style={styles.content}>
                {/* Game Type Badge */}
                <View style={[styles.gameBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <MaterialCommunityIcons name={gameIcon} size={moderateScale(20)} color={colors.primary} />
                    <CText style={[styles.gameBadgeText, { color: colors.textPrimary }]}>{gameTitle}</CText>
                </View>

                {/* Main VS Card */}
                <View style={[styles.matchCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.playerContainer}>
                        <View style={styles.avatarWrapper}>
                            <View style={[styles.avatarCircle, { backgroundColor: colors.inputBackground, borderColor: colors.primary }]}>
                                <MaterialCommunityIcons name="account" size={moderateScale(50)} color={colors.primary} />
                            </View>
                            <View style={[styles.statusIndicator, { borderColor: colors.surface, backgroundColor: colors.primary }]} />
                        </View>
                        <CText style={[styles.playerName, { color: colors.textPrimary }]}>You</CText>
                    </View>

                    <Animated.View style={[styles.vsContainer, { transform: [{ scale: pulseAnim }] }]}>
                        <View style={[styles.vsCircle, { borderColor: colors.surface }]}>
                            <CText style={styles.vsText}>VS</CText>
                        </View>
                    </Animated.View>

                    <View style={styles.playerContainer}>
                        <View style={styles.avatarWrapper}>
                            <View style={[styles.avatarCircle, styles.opponentCircle, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                                    <MaterialCommunityIcons name="loading" size={moderateScale(50)} color={colors.textSecondary} />
                                </Animated.View>
                            </View>
                        </View>
                        <CText style={[styles.opponentName, { color: colors.textSecondary }]}>Searching...</CText>
                    </View>
                </View>

                {/* Match Details */}
                <View style={styles.detailsContainer}>
                    <View style={[styles.detailRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.detailItem}>
                            <CText style={[styles.detailLabel, { color: colors.textSecondary }]}>ENTRY FEE</CText>
                            <CText style={[styles.detailValue, { color: colors.textPrimary }]}>₹{entryFee}</CText>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.detailItem}>
                            <CText style={[styles.detailLabel, { color: colors.textSecondary }]}>PRIZE POOL</CText>
                            <CText style={[styles.detailValue, styles.prizeText, { color: colors.primary }]}>₹{prizePool}</CText>
                        </View>
                    </View>
                </View>

                {/* Status Message */}
                <View style={styles.statusContainer}>
                    <CText style={[styles.statusText, { color: colors.textPrimary }]}>Finding a suitable opponent for you</CText>
                    <CText style={[styles.subStatusText, { color: colors.textSecondary }]}>Please do not close the app</CText>
                </View>

                {/* Demo Tools */}
                <View style={[styles.demoContainer]}>
                    <TouchableOpacity
                        style={[styles.demoButton, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}
                        onPress={() => {
                            if (gameTitle === 'Tic Tac Toe') {
                                navigation.replace('TicTacToe', { gameTitle, entryFee, prizePool });
                            } else if (gameTitle === 'Carrom Board') {
                                navigation.replace('CarromGame', { gameTitle, entryFee, prizePool });
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="fast-forward-outline" size={moderateScale(16)} color={colors.primary} />
                        <CText style={[styles.demoText, { color: colors.primary }]}>Demo: Skip Waiting</CText>
                    </TouchableOpacity>
                </View>
            </View>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
    },
    backButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    empty: {
        width: moderateScale(32),
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
    },
    gameBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        marginBottom: verticalScale(40),
    },
    gameBadgeText: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        marginLeft: moderateScale(8),
    },
    matchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: moderateScale(24),
        padding: moderateScale(24),
        borderWidth: 1.5,
        borderColor: '#D4AF37', // Golden border like the reference image
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    playerContainer: {
        alignItems: 'center',
        flex: 1,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: verticalScale(12),
    },
    avatarCircle: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    opponentCircle: {
        // borderColor: colors.border,
        // backgroundColor: colors.background,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: moderateScale(16),
        height: moderateScale(16),
        borderRadius: moderateScale(8),
        borderWidth: 2,
    },
    playerName: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    vsContainer: {
        paddingHorizontal: moderateScale(10),
    },
    vsCircle: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderRadius: moderateScale(23),
        backgroundColor: '#D4AF37', // Gold color for VS
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    vsText: {
        color: colors.black,
        fontSize: moderateScale(16),
        fontWeight: '900',
        fontStyle: 'italic',
    },
    opponentName: {
        fontSize: moderateScale(14),
        fontWeight: '400',
    },
    detailsContainer: {
        marginTop: verticalScale(40),
        width: '100%',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        borderWidth: 1,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: moderateScale(10),
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: verticalScale(4),
    },
    detailValue: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    prizeText: {
    },
    divider: {
        width: 1,
        height: verticalScale(30),
    },
    statusContainer: {
        marginTop: verticalScale(30),
        alignItems: 'center',
    },
    statusText: {
        fontSize: moderateScale(14),
        textAlign: 'center',
        marginBottom: verticalScale(4),
    },
    subStatusText: {
        fontSize: moderateScale(12),
        textAlign: 'center',
    },
    demoContainer: {
        marginTop: verticalScale(40),
        width: '100%',
        alignItems: 'center',
    },
    demoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(25),
        borderWidth: 1.5,
        borderStyle: 'dashed',
    },
    demoText: {
        fontSize: moderateScale(13),
        fontWeight: 'bold',
        marginLeft: moderateScale(8),
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(20),
        backgroundColor: colors.surface + '80',
        marginHorizontal: moderateScale(20),
        marginBottom: verticalScale(10),
        borderRadius: moderateScale(12),
    },
    tipText: {
        color: colors.textSecondary,
        fontSize: moderateScale(12),
        marginLeft: moderateScale(8),
    },
});

export default GameWaiting;
