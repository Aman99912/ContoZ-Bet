import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { GameCard, BannerCard, GameTabSelector } from '@/Games';
import HomeHeader from './components/header';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, isLoggedIn, totalBalance } = useApp();
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Popular', 'New', '2 Player'];

    const games = [
        { title: '8 Ball Pool', entryFee: 50, icon: 'billiards' },
        { title: 'Fruit Chop', entryFee: 50, icon: 'fruit-cherries' },
        { title: 'Ludo', entryFee: 50, icon: 'dice-multiple' },
        { title: 'Carrom', entryFee: 50, icon: 'checkerboard' },
        { title: 'Chess', entryFee: 50, icon: 'chess-knight' },
        { title: 'Tic Tac Toe', entryFee: 50, icon: 'grid' },
    ];

    // Get wallet balance from AppContext
    const balance = totalBalance || 0;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <HomeHeader balance={balance} isLoggedIn={isLoggedIn} />
                <View style={styles.content}>
                    <BannerCard
                        title="Play Games &"
                        subtitle="Win Real Money"
                        onPress={() => console.log('Banner pressed')}
                    />

                    <GameTabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <View style={styles.gamesGrid}>
                        {games.map((game, index) => (
                            <GameCard
                                key={index}
                                title={game.title}
                                entryFee={game.entryFee}
                                icon={game.icon}
                                onPress={() => navigation.navigate('GameInit', { gameTitle: game.title, gameIcon: game.icon })}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.button}>
                        <CText style={styles.buttonText} numberOfLines={1}>View All Games</CText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: moderateScale(16),
    },
    gamesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: verticalScale(16),
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        alignItems: 'center',
        marginTop: verticalScale(24),
    },
    buttonText: {
        color: colors.black,
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});