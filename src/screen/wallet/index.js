import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale } from '@/core/utils/responsive';
import WalletTopHeader from './components/WalletTopHeader';
import WalletTabSelector from './components/WalletTabSelector';
import Transactions from './components/Transactions';
import AddMoneyModal from './components/AddMoneyModal';

export default function WalletScreen() {
    const [activeTab, setActiveTab] = useState('All');
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    // Example data
    const balance = 1032720;
    const cashBalance = 500000;
    const earningsBalance = 532720;

    const transactions = [
        { id: 1, type: 'topup', title: 'Wallet Top Up', description: 'Added to Cash Wallet', amount: 500, transaction_Id: 'TXN-001', createdAt: new Date().toISOString(), paymentStatus: 'success' },
        { id: 2, type: 'debit', title: '8 Ball Pool', description: 'Entry Fee', amount: 50, transaction_Id: 'TXN-002', createdAt: new Date().toISOString(), paymentStatus: 'success' },
        { id: 3, type: 'credit', title: 'Ludo Win', description: 'Prize Money', amount: 87.5, transaction_Id: 'TXN-003', createdAt: new Date().toISOString(), paymentStatus: 'success' },
        { id: 4, type: 'debit', title: 'Carrom', description: 'Entry Fee', amount: 50, transaction_Id: 'TXN-004', createdAt: new Date().toISOString(), paymentStatus: 'success' },
    ];

    const calculateGST = (baseAmount) => {
        const base = Number(baseAmount);
        const gst = (base * 18) / 100;
        const total = base + gst;
        return { base, gst, total };
    };

    const handleAddMoney = () => {
        setButtonLoading(true);
        setTimeout(() => {
            setButtonLoading(false);
            setShowAddMoneyModal(false);
            setAmount('');
            setSelectedPreset(null);
            console.log('Money added successfully');
        }, 2000);
    };

    const handleTransfer = () => {
        console.log('Transfer initiated');
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
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
        <SafeAreaView style={styles.container}>
            <WalletTopHeader
                balance={balance}
                cashBalance={cashBalance}
                earningsBalance={earningsBalance}
                onAddMoney={() => setShowAddMoneyModal(true)}
                onTransfer={handleTransfer}
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
                calculateGST={calculateGST}
                gstPercentage={18}
                onAddMoney={handleAddMoney}
                isAddDisabled={isAddDisabled}
                buttonLoading={buttonLoading}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});