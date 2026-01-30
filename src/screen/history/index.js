import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import { GameTabSelector } from '@/Games';
import HistoryItem from './components/historyItem';
import HistoryHeader from './components/historyHeader';

import { useApp } from '@/context/AppContext';

export default function HistoryScreen() {
    const { totalBalance } = useApp();
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Won', 'Lost', '2 Player'];

    const historyData = [
        { game: '8 Ball Pool', entryFee: 50, result: 'WON', amount: 37.5, date: 'Apr 24, 2024, 10:36 AM', icon: 'billiards' },
        { game: 'Fruit Chop', entryFee: 50, result: 'WON', amount: 37.5, date: 'Apr 24, 2024, 10:32 AM', icon: 'fruit-cherries' },
        { game: 'Ludo', entryFee: 50, result: 'LOST', amount: 50, date: 'Apr 24, 2024, 10:33 AM', icon: 'dice-multiple' },
        { game: 'Carrom', entryFee: 50, result: 'WON', amount: 37.5, date: 'Apr 24, 2024, 10:32 AM', icon: 'checkerboard' },
        { game: '8 Ball Pool', entryFee: 50, result: 'WON', amount: 37.5, date: 'Apr 24, 2024, 10:35 AM', icon: 'billiards' },
        { game: 'Ludo', entryFee: 50, result: 'LOST', amount: 50, date: 'Apr 24, 2024, 10:33 AM', icon: 'dice-multiple' },
        { game: 'Carrom', entryFee: 50, result: 'WON', amount: 37.5, date: 'Apr 24, 2024, 10:32 AM', icon: 'checkerboard' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <HistoryHeader balance={totalBalance || 0} />
            <View style={styles.tabWrapper}>
                <GameTabSelector
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </View>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {historyData.map((item, index) => (
                    <HistoryItem
                        key={index}
                        game={item.game}
                        entryFee={item.entryFee}
                        result={item.result}
                        amount={item.amount}
                        date={item.date}
                        icon={item.icon}
                        onPress={() => console.log(`${item.game} history pressed`)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    tabWrapper: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
    },
    scroll: {
        flex: 1,
        paddingHorizontal: moderateScale(16),
        marginTop: verticalScale(8),
    },
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
});