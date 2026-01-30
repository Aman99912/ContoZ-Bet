import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import CustomAlert from '@/components/common/CustomAlert';
import InsufficientBalanceModal from '@/components/common/InsufficientBalanceModal';
import EarnToCashModal from '@/screen/wallet/components/EarnToCashModal';

const { width } = Dimensions.get('window');

const GameInit = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { wallets, totalBalance, isLoggedIn, user, refreshWallets } = useApp();
    const { gameTitle, gameIcon } = route.params || { gameTitle: 'Game', gameIcon: 'gamepad-variant' };

    // Extract wallet breakdowns
    const mainWallet = wallets.find(w => w.slug === 'main_wallet')?.value || 0;
    const fundWallet = wallets.find(w => w.slug === 'fund_wallet')?.value || 0;
    const incomeWallet = wallets.find(w => w.slug === 'level_income')?.value || 0;

    const cashBalance = mainWallet + fundWallet;
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
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={moderateScale(24)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={styles.headerTitle}>{gameTitle}</CText>
                <View style={styles.empty} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Game Info Card */}
                <View style={styles.gameInfoCard}>
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons name={gameIcon} size={moderateScale(60)} color={colors.primary} />
                    </View>
                    <View style={styles.gameTextInfo}>
                        <CText style={styles.gameName}>{gameTitle}</CText>
                        <CText style={styles.gameDescription} numberOfLines={2}>
                            Compete with players and win real money. Select your fee below!
                        </CText>
                    </View>
                </View>

                {/* How to Play / Rules Section */}
                <View style={styles.rulesSection}>
                    <CText style={styles.sectionTitle}>Rules & Guidelines</CText>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={styles.ruleText}>Players must join before the lobby timer expires.</CText>
                    </View>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={styles.ruleText}>Entry fee will be deducted once the game starts.</CText>
                    </View>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={styles.ruleText}>Winnings distributed instantly after verification.</CText>
                    </View>
                    <View style={styles.ruleItem}>
                        <MaterialCommunityIcons name="circle-medium" size={moderateScale(18)} color={colors.primary} />
                        <CText style={styles.ruleText}>Fair play is mandatory; cheating leads to a ban.</CText>
                    </View>
                </View>

                {/* Balance Info */}
                <View style={styles.balanceInfo}>
                    <CText style={styles.balanceLabel}>Your Balance</CText>
                    <CText style={styles.balanceAmount}>₹{totalBalance}</CText>
                </View>
            </ScrollView>

            {/* Bottom Join Section */}
            <View style={styles.bottomSection}>
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
                                selectedFee === fee && styles.selectedFeeChip
                            ]}
                            onPress={() => setSelectedFee(fee)}
                            activeOpacity={0.7}
                        >
                            <CText style={[
                                styles.feeText,
                                selectedFee === fee && styles.selectedFeeText
                            ]}>₹{fee}</CText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.summaryRow}>
                    <CText style={styles.summaryLabel}>Total Payable</CText>
                    <CText style={styles.summaryAmount}>₹{selectedFee}</CText>
                </View>
                <TouchableOpacity style={styles.joinButton} onPress={handleJoin} activeOpacity={0.9}>
                    <CText style={styles.joinButtonText} numberOfLines={1}>Join Game</CText>
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
                onClose={() => setShowBalanceModal(false)}
                requiredAmount={selectedFee}
                cashBalance={cashBalance}
                earningsBalance={earningsBalance}
                onAddMoney={() => navigation.navigate('MainApp', { screen: 'Wallet' })}
                onTransfer={() => {
                    setShowBalanceModal(false);
                    setTimeout(() => setShowTransferModal(true), 300);
                }}
            />

            <EarnToCashModal
                visible={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                cashBalance={cashBalance}
                earningsBalance={earningsBalance}
                availableToConvert={earningsBalance}
                onTransfer={refreshWallets}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    empty: {
        width: moderateScale(32),
    },
    scrollContent: {
        padding: moderateScale(16),
        paddingBottom: verticalScale(160),
    },
    gameInfoCard: {
        backgroundColor: colors.surface,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: verticalScale(16),
    },
    iconWrapper: {
        width: moderateScale(70),
        height: moderateScale(70),
        borderRadius: moderateScale(35),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    gameTextInfo: {
        flex: 1,
        marginLeft: moderateScale(16),
    },
    gameName: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(2),
    },
    gameDescription: {
        fontSize: moderateScale(11),
        color: colors.textSecondary,
        lineHeight: verticalScale(14),
    },
    rulesSection: {
        marginBottom: verticalScale(20),
        backgroundColor: colors.surface,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
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
        color: colors.textSecondary,
        lineHeight: verticalScale(18),
        marginLeft: moderateScale(4),
    },
    balanceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(12),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: colors.border,
    },
    balanceLabel: {
        fontSize: moderateScale(13),
        color: colors.textSecondary,
    },
    balanceAmount: {
        fontSize: moderateScale(15),
        fontWeight: 'bold',
        color: colors.primary,
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: colors.surface,
        padding: moderateScale(12),
        paddingTop: moderateScale(8),
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: colors.black,
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
        backgroundColor: colors.surface,
        borderRadius: moderateScale(18),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: moderateScale(8),
    },
    selectedFeeChip: {
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary,
        borderWidth: 2,
    },
    feeText: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
        color: colors.textSecondary,
    },
    selectedFeeText: {
        color: colors.primary,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    summaryLabel: {
        fontSize: moderateScale(13),
        color: colors.textSecondary,
    },
    summaryAmount: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    joinButton: {
        backgroundColor: colors.primary,
        height: verticalScale(50),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinButtonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.black,
    },
});

export default GameInit;
