import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale } from '@/core/utils/responsive';
import WalletTopHeader from './components/WalletTopHeader';
import WalletTabSelector from './components/WalletTabSelector';
import Transactions from './components/Transactions';
import AddMoneyModal from './components/AddMoneyModal';
import api from '@/api';
import { initiateRazorpayPayment } from '@/features/payments/Razorpay';
import { useApp } from '@/context/AppContext';



import PaymentSuccessModal from '@/components/common/PaymentSuccessModal';
import { Audio } from 'expo-av';

export default function WalletScreen() {
    const { colors } = useTheme();
    const { wallets, totalBalance, refreshWallets, user } = useApp();
    const [activeTab, setActiveTab] = useState('All');
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    // Success/Failure Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('success');
    const [paymentMessage, setPaymentMessage] = useState('');
    const [paymentTitle, setPaymentTitle] = useState('');
    const [txnId, setTxnId] = useState('');

    // const [buttonLoading, setButtonLoading] = useState(false);

    // MAPPING: 
    // cashBalance = Fund Wallet (Deposit)
    // earningsBalance = Main Wallet (Winnings)

    // Find wallets from context safely
    const fundWalletObj = wallets.find(w => w.slug === 'fund_wallet');
    const mainWalletObj = wallets.find(w => w.slug === 'main_wallet');

    const cashBalance = fundWalletObj ? fundWalletObj.value : 0;
    const earningsBalance = mainWalletObj ? mainWalletObj.value : 0;

    // Filter Tabs Configuration
    const FILTER_TABS = [
        { label: 'All', value: '' },
        { label: 'Recharge', value: 'recharge' },
        { label: 'Withdrawal', value: 'withdrawal' },
        { label: 'Conversion', value: 'fund_convert' },
        { label: 'Income', value: 'level_income' },
    ];

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refreshWallets();
    }, []);

    const playWalletSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('@/sound/wallet.mp3')
            );
            await sound.playAsync();
        } catch (error) {
            console.log("Error playing sound:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [activeTab]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const { walletAPI } = require('@/api/services');

            const selectedTabObj = FILTER_TABS.find(t => t.label === activeTab);
            const sourceParam = selectedTabObj ? selectedTabObj.value : '';

            console.log('Fetching transactions for source:', sourceParam);
            const res = await walletAPI.getPaymentTransactions(sourceParam);

            // Handle potential response unwrapping by interceptors
            const dataList = res?.data?.data || res?.data || [];

            if (Array.isArray(dataList)) {
                const mappedData = dataList.map(item => {
                    let type = item.debit_credit;
                    if (item.source === 'recharge' && item.debit_credit === 'credit') {
                        type = 'topup';
                    } else if (item.source === 'recharge' && item.debit_credit === 'debit') {
                        type = 'debit';
                    }

                    let title = 'Transaction';
                    switch (item.source) {
                        case 'recharge': title = 'Wallet Top Up'; break;
                        case 'fund_convert': title = 'Wallet Conversion'; break;
                        case 'withdrawal': title = 'Withdrawal'; break;
                        case 'level_income': title = 'Level Income'; break;
                        default: title = item.source || 'Transaction';
                    }

                    return {
                        id: item._id,
                        transaction_Id: item.tx_Id,
                        amount: item.amount,
                        type: type,
                        title: title,
                        description: item.wallet_type === 'main_wallet' ? 'Earnings Wallet' : 'Cash Wallet',
                        paymentStatus: item.status === 1 ? 'success' : (item.status === 2 ? 'failure' : 'pending'),
                        createdAt: item.createdAt,
                        raw: item
                    };
                });
                setTransactions(mappedData);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            refreshWallets(),
            fetchTransactions()
        ]);
        setRefreshing(false);
    };

    const handleAddMoney = () => {
        const amountNum = Number(amount);
        if (!amountNum || amountNum <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        setButtonLoading(true);

        initiateRazorpayPayment({
            amount: amountNum,
            prefill: {
                name: user?.name || 'User',
                contact: user?.mobile || '9999999999',
                email: user?.email || 'user@example.com'
            },
            onSuccess: (data) => {
                console.log('Recharge Successful:', data);
                setButtonLoading(false);
                setShowAddMoneyModal(false);
                setAmount('');
                setSelectedPreset(null);

                // Show Success Modal
                setPaymentStatus('success');
                setPaymentTitle('Payment Successful');
                setPaymentMessage('Your wallet has been updated successfully.');
                setTxnId(data.razorpay_payment_id || '');
                setShowPaymentModal(true);
                playWalletSound();

                refreshWallets();
                fetchTransactions();
            },
            onError: (error) => {
                console.log('Recharge Failed:', error);
                setButtonLoading(false);

                // Show Failure Modal
                setPaymentStatus('failure');
                setPaymentTitle('Payment Failed');
                setPaymentMessage(error.message || 'Unable to process payment');
                setTxnId('');
                setShowPaymentModal(true);
            }
        });
    };

    const handleTransfer = () => {
        console.log('Transfer initiated');
        // If this opens a modal, it should be here. 
        // Based on EarnToCashModal usage in other files, it seems handled by WalletTopHeader onTransfer prop which might open something?
        // Wait, where is EarnToCashModal used? 
        // I see it in open documents. It's likely used in WalletScreen but I don't see it imported/rendered in the current file view!
        // Ah, checked lines 1-189, EarnToCashModal is NOT imported/rendered in WalletScreen.js currently.
        // It should probably be added if the user expects "Earn to Cash" to work from here.
        // But for now I'll just restore the function placeholder as it was requested "wapis kro sahi" implying restore previous state.
    };

    const handleLoadMore = () => {
        if (!isLoadingMore) {
            setIsLoadingMore(true);
            setTimeout(() => setIsLoadingMore(false), 1000);
        }
    };

    const handleItemPress = (item) => {
        console.log('Transaction pressed:', item);
    };

    const isAddDisabled = !amount || Number(amount) <= 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <WalletTopHeader
                balance={totalBalance}
                cashBalance={cashBalance}
                earningsBalance={earningsBalance}
                onAddMoney={() => setShowAddMoneyModal(true)}
                onTransfer={handleTransfer}
                onRefresh={handleRefresh}
            />

            <WalletTabSelector
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={FILTER_TABS.map(t => t.label)}
            />

            <Transactions
                transactions={transactions}
                loading={loading}
                refreshing={refreshing}
                isLoadingMore={isLoadingMore}
                hasMore={false}
                onRefresh={handleRefresh}
                onLoadMore={handleLoadMore}
                onItemPress={handleItemPress}
            />

            <AddMoneyModal
                visible={showAddMoneyModal}
                onClose={() => {
                    setShowAddMoneyModal(false);
                    setAmount('');
                    setSelectedPreset(null);
                }}
                amount={amount}
                setAmount={setAmount}
                selectedPreset={selectedPreset}
                setSelectedPreset={setSelectedPreset}
                onAddMoney={handleAddMoney}
                isAddDisabled={isAddDisabled}
                buttonLoading={buttonLoading}
            />

            <PaymentSuccessModal
                visible={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                status={paymentStatus}
                title={paymentTitle}
                message={paymentMessage}
                transactionId={txnId}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: verticalScale(-20),
        backgroundColor: colors.background,
    },
});