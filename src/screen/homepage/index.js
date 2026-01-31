import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { GameCard, BannerCard, GameTabSelector } from '@/Games';
import HomeHeader from './components/header';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { user, isLoggedIn, totalBalance } = useApp();
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Popular', 'New', '2 Player'];

    const games = [
        { title: 'Tic Tac Toe', entryFee: 50, image: require('@/images/Cardimage/tic-tac-toe.png') },
    ];

    // Get wallet balance from AppContext
    const balance = totalBalance || 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <HomeHeader balance={balance} isLoggedIn={isLoggedIn} />
                <View style={styles.content}>
                    <BannerCard
                        title="Play Games &"
                        subtitle="Win Real Money"
                        image={require('@/images/Cardimage/carm.png')}
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
                                image={game.image}
                                icon={game.icon}
                                onPress={() => navigation.navigate('GameInit', { gameTitle: game.title, gameIcon: game.icon, gameImage: game.image })}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
                        <CText style={[styles.buttonText, { color: colors.black }]} numberOfLines={1}>View All Games</CText>
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