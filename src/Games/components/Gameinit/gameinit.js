import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import CustomAlert from '@/components/common/CustomAlert';
import InsufficientBalanceModal from '@/components/common/InsufficientBalanceModal';
import EarnToCashModal from '@/screen/wallet/components/EarnToCashModal';

const { width } = Dimensions.get('window');

const GameInit = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { wallets, totalBalance, isLoggedIn, user, refreshWallets } = useApp();
    const { gameTitle, gameIcon } = route.params || { gameTitle: 'Game', gameIcon: 'gamepad-variant' };
    const insets = useSafeAreaInsets();

    // Extract wallet breakdowns
    const mainWallet = wallets.find(w => w.slug === 'main_wallet')?.value || 0;
    const fundWallet = wallets.find(w => w.slug === 'fund_wallet')?.value || 0;
    const incomeWallet = wallets.find(w => w.slug === 'level_income')?.value || 0;

    // Restricted: Games only played from Fund Wallet
    const cashBalance = fundWallet;
    const earningsBalance = incomeWallet;

    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const [selectedFee, setSelectedFee] = useState(50);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        confirmText: '',
        onConfirm: () => { }
    });

    const entryFees = [10, 50, 100, 200, 500, 1000];

    const handleJoin = () => {
        if (!isLoggedIn) {
            setAlertConfig({
                title: 'Login Required',
                message: 'Please login to play games',
                confirmText: 'Login',
                onConfirm: () => navigation.navigate('Login')
            });
            setShowAlert(true);
            return;
        }

        if (user?.isverified !== 1) {
            setAlertConfig({
                title: 'Verification Required',
                message: 'Please verify your email to play games',
                confirmText: 'Verify',
                onConfirm: () => navigation.navigate('EmailVerify')
            });
            setShowAlert(true);
            return;
        }

        if (cashBalance < selectedFee) {
            setShowBalanceModal(true);
            return;
        }

        // Handle join logic here (API call, etc.)
        console.log(`Joining ${gameTitle} with fee ₹${selectedFee}`);

        // Navigate to Waiting Screen
        navigation.navigate('GameWaiting', {
            gameTitle,
            gameIcon,
            entryFee: selectedFee,
            prizePool: selectedFee * 1.8 // Example calculation
        });
    };

    const [isTesting, setIsTesting] = useState(false);

    const handleDemoBalance = () => {
        setIsTesting(true);
        setShowBalanceModal(true);
    };

    const handleDemoWaiting = () => {
        navigation.navigate('GameWaiting', {
            gameTitle,
            gameIcon,
            entryFee: selectedFee,
            prizePool: selectedFee * 1.8
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={moderateScale(24)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>{gameTitle}</CText>
                <View style={styles.empty} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Game Info Card */}
                <View style={[styles.gameInfoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.iconWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.primary }]}>
                        <MaterialCommunityIcons name={gameIcon} size={moderateScale(60)} color={colors.primary} />
                    </View>
                    <View style={styles.gameTextInfo}>
                        <CText style={[styles.gameName, { color: colors.textPrimary }]}>{gameTitle}</CText>
                        <CText style={[styles.gameDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                            Compete with players and win real money. Select your fee below!
                        </CText>
                    </View>
                </View>

                {/* How to Play / Rules Section */}
                <View style={[styles.rulesSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <CText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Rules & Guidelines</CText>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={[styles.ruleText, { color: colors.textSecondary }]}>Players must join before the lobby timer expires.</CText>
                    </View>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={[styles.ruleText, { color: colors.textSecondary }]}>Entry fee will be deducted once the game starts.</CText>
                    </View>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={[styles.ruleText, { color: colors.textSecondary }]}>Winnings distributed instantly after verification.</CText>
                    </View>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={[styles.ruleText, { color: colors.textSecondary }]}>Fair play is mandatory; cheating leads to a ban.</CText>
                    </View>
                </View>

                {/* Balance Info */}
                <View style={[styles.balanceInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <CText style={[styles.balanceLabel, { color: colors.textSecondary }]}>Deposit Balance</CText>
                    <CText style={[styles.balanceAmount, { color: colors.primary }]}>₹{cashBalance}</CText>
                </View>
            </ScrollView>

            {/* Bottom Join Section */}
            <View style={[styles.bottomSection, {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, moderateScale(12))
            }]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.feeSelectorScroll}
                    contentContainerStyle={{ paddingRight: moderateScale(20) }}
                >
                    {entryFees.map((fee) => (
                        <TouchableOpacity
                            key={fee}
                            style={[
                                styles.feeChip,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                                selectedFee === fee && { backgroundColor: colors.primary + '20', borderColor: colors.primary, borderWidth: 2 }
                            ]}
                            onPress={() => setSelectedFee(fee)}
                            activeOpacity={0.7}
                        >
                            <CText style={[
                                styles.feeText,
                                { color: colors.textSecondary },
                                selectedFee === fee && { color: colors.primary }
                            ]}>₹{fee}</CText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Demo Tools */}
                <View style={styles.demoRow}>
                    <TouchableOpacity style={[
                        styles.demoButton,
                        { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                    ]} onPress={handleDemoBalance} activeOpacity={0.7}>
                        <MaterialCommunityIcons name="wallet-outline" size={moderateScale(14)} color={colors.primary} />
                        <CText style={[styles.demoText, { color: colors.primary }]}>Demo: Balance</CText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        styles.demoButton,
                        { backgroundColor: colors.primary + '15', borderColor: colors.primary }
                    ]} onPress={handleDemoWaiting} activeOpacity={0.7}>
                        <MaterialCommunityIcons name="play-outline" size={moderateScale(14)} color={colors.primary} />
                        <CText style={[styles.demoText, { color: colors.primary }]}>Demo: Waiting</CText>
                    </TouchableOpacity>
                </View>

                <View style={styles.summaryRow}>
                    <CText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Payable</CText>
                    <CText style={[styles.summaryAmount, { color: colors.textPrimary }]}>₹{selectedFee}</CText>
                </View>
                <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary }]} onPress={handleJoin} activeOpacity={0.9}>
                    <CText style={[styles.joinButtonText, { color: colors.black }]} numberOfLines={1}>Join Game</CText>
                </TouchableOpacity>
            </View>

            <CustomAlert
                visible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                showConfirm={true}
                confirmText={alertConfig.confirmText}
                cancelText="Cancel"
                onConfirm={alertConfig.onConfirm}
                onClose={() => setShowAlert(false)}
            />

            <InsufficientBalanceModal
                visible={showBalanceModal}
                onClose={() => {
                    setShowBalanceModal(false);
                    setIsTesting(false);
                }}
                requiredAmount={selectedFee}
                cashBalance={isTesting ? 0 : cashBalance}
                earningsBalance={isTesting ? 100 : earningsBalance}
                onAddMoney={() => navigation.navigate('MainApp', { screen: 'Wallet' })}
                onTransfer={() => {
                    setShowBalanceModal(false);
                    setTimeout(() => setShowTransferModal(true), 300);
                }}
            />

            <EarnToCashModal
                visible={showTransferModal}
                onClose={() => {
                    setShowTransferModal(false);
                    setIsTesting(false);
                }}
                cashBalance={isTesting ? 0 : cashBalance}
                earningsBalance={isTesting ? 100 : earningsBalance}
                availableToConvert={isTesting ? 100 : earningsBalance}
                onTransfer={refreshWallets}
            />
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
        borderBottomWidth: 1,
    },
    backButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
    },
    empty: {
        width: moderateScale(32),
    },
    scrollContent: {
        padding: moderateScale(16),
        paddingBottom: verticalScale(160),
    },
    gameInfoCard: {
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: verticalScale(16),
    },
    iconWrapper: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(35),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    gameTextInfo: {
        flex: 1,
        marginLeft: moderateScale(16),
    },
    gameName: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        marginBottom: verticalScale(2),
    },
    gameDescription: {
        fontSize: moderateScale(11),
        lineHeight: verticalScale(14),
    },
    rulesSection: {
        marginBottom: verticalScale(20),
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        marginBottom: verticalScale(12),
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: verticalScale(8),
    },
    ruleText: {
        flex: 1,
        fontSize: moderateScale(13),
        lineHeight: verticalScale(18),
        marginLeft: moderateScale(4),
    },
    balanceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        borderWidth: 1,
    },
    balanceLabel: {
        fontSize: moderateScale(13),
    },
    balanceAmount: {
        fontSize: moderateScale(15),
        fontWeight: 'bold',
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: moderateScale(12),
        paddingTop: moderateScale(8),
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    feeSelectorScroll: {
        marginBottom: verticalScale(12),
    },
    feeChip: {
        paddingHorizontal: moderateScale(12),
        height: verticalScale(36),
        borderRadius: moderateScale(18),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginRight: moderateScale(8),
    },
    feeText: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    demoRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: moderateScale(10),
        marginBottom: verticalScale(14),
    },
    demoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(12),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    demoText: {
        fontSize: moderateScale(11),
        fontWeight: 'bold',
        marginLeft: moderateScale(4),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    summaryLabel: {
        fontSize: moderateScale(13),
    },
    summaryAmount: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    joinButton: {
        height: verticalScale(40),
        bottom: verticalScale(8),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});

export default GameInit;
