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

    const [transactions, setTransactions] = useState([
        { id: 1, type: 'topup', title: 'Wallet Top Up', description: 'Added to Cash Wallet', amount: 500, transaction_Id: 'TXN-001', createdAt: new Date().toISOString(), paymentStatus: 'success' },
        { id: 2, type: 'debit', title: '8 Ball Pool', description: 'Entry Fee', amount: 50, transaction_Id: 'TXN-002', createdAt: new Date().toISOString(), paymentStatus: 'success' },
        { id: 3, type: 'credit', title: 'Ludo Win', description: 'Prize Money', amount: 87.5, transaction_Id: 'TXN-003', createdAt: new Date().toISOString(), paymentStatus: 'success' },
        { id: 4, type: 'debit', title: 'Carrom', description: 'Entry Fee', amount: 50, transaction_Id: 'TXN-004', createdAt: new Date().toISOString(), paymentStatus: 'success' },
    ]);

    useEffect(() => {
        refreshWallets();
    }, []);

    const handleAddMoney = () => {
        const amountNum = Number(amount);
        if (!amountNum || amountNum <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        setButtonLoading(true);

        initiateRazorpayPayment({
            amount: amountNum, // Passing exact amount logic
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

                refreshWallets();
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
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshWallets();
        setRefreshing(false);
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
            />

            <Transactions
                transactions={transactions}
                loading={false}
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