import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

export default function MyGames() {
    const navigation = useNavigation();

    const games = [
        { id: 1, name: '8 Ball Pool', played: 15, won: 8, earnings: 450 },
        { id: 2, name: 'Ludo', played: 23, won: 12, earnings: 680 },
        { id: 3, name: 'Carrom', played: 10, won: 6, earnings: 320 },
        { id: 4, name: 'Chess', played: 8, won: 5, earnings: 250 },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={styles.headerTitle}>My Games</CText>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <CText style={styles.statValue}>56</CText>
                            <CText style={styles.statLabel}>Total Games</CText>
                        </View>
                        <View style={styles.statCard}>
                            <CText style={styles.statValue}>31</CText>
                            <CText style={styles.statLabel}>Games Won</CText>
                        </View>
                        <View style={styles.statCard}>
                            <CText style={styles.statValue}>55%</CText>
                            <CText style={styles.statLabel}>Win Rate</CText>
                        </View>
                    </View>

                    <CText style={styles.sectionTitle}>Game History</CText>
                    {games.map((game) => (
                        <View key={game.id} style={styles.gameCard}>
                            <View style={styles.gameIcon}>
                                <MaterialCommunityIcons name="gamepad-variant" size={moderateScale(28)} color={colors.primary} />
                            </View>
                            <View style={styles.gameInfo}>
                                <CText style={styles.gameName}>{game.name}</CText>
                                <CText style={styles.gameStats}>
                                    Played: {game.played} | Won: {game.won}
                                </CText>
                            </View>
                            <View style={styles.earningsBox}>
                                <CText style={styles.earningsAmount}>₹{game.earnings}</CText>
                                <CText style={styles.earningsLabel}>Earned</CText>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    headerPlaceholder: {
        width: moderateScale(36),
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: moderateScale(16),
    },
    statsContainer: {
        flexDirection: 'row',
        gap: moderateScale(12),
        marginBottom: verticalScale(24),
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(16),
    },
    gameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    gameIcon: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(25),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(12),
    },
    gameInfo: {
        flex: 1,
    },
    gameName: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    gameStats: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
    earningsBox: {
        alignItems: 'flex-end',
    },
    earningsAmount: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 2,
    },
    earningsLabel: {
        fontSize: moderateScale(11),
        color: colors.textSecondary,
    },
});
