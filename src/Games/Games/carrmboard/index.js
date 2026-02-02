import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    BackHandler,
    Vibration,
} from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import InGameHeader from '@/Games/components/inGame/InGameHeader';
import InGamePlayerCard from '@/Games/components/inGame/InGamePlayerCard';
import InGameStatus from '@/Games/components/inGame/InGameStatus';
import WinCelebration from '@/Games/components/inGame/winCelebration';
import CustomAlert from '@/components/common/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import CarromBoard from './components/CarromBoard';

const CarromGame = ({ navigation, route }) => {
    const {
        entryFee = 50,
        prizePool = 90
    } = route.params || {};

    const [currentPlayer, setCurrentPlayer] = useState('white'); // 'white' or 'black'
    const [winner, setWinner] = useState(null);
    const [whiteScore, setWhiteScore] = useState(0);
    const [blackScore, setBlackScore] = useState(0);

    // Initial dummy coin positions
    const [coins, setCoins] = useState(
        Array(9).fill(null).map((_, i) => ({
            id: i,
            color: i === 4 ? 'queen' : (i % 2 === 0 ? 'white' : 'black'),
            x: 140 + (Math.random() * 40 - 20), // rough center cluster
            y: 140 + (Math.random() * 40 - 20),
            potted: false
        }))
    );

    // Alert states
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    // Celebration state
    const [showCelebration, setShowCelebration] = useState(false);

    const handleStrike = (strikeData) => {
        if (winner) return;

        // Simulate game logic
        // 1. Move striker
        // 2. Hit coins (random simulation for now)
        // 3. Pot detection

        // Randomly pot a coin for demo purposes
        const chance = Math.random();

        if (chance > 0.7) {
            // Pot a coin
            const unpotted = coins.filter(c => !c.potted);
            if (unpotted.length > 0) {
                const target = unpotted[Math.floor(Math.random() * unpotted.length)];

                // Update coins
                const newCoins = coins.map(c =>
                    c.id === target.id ? { ...c, potted: true } : c
                );
                setCoins(newCoins);

                // Update Score
                if (target.color === 'white') setWhiteScore(s => s + 10);
                else if (target.color === 'black') setBlackScore(s => s + 10);
                else if (target.color === 'queen') {
                    if (currentPlayer === 'white') setWhiteScore(s => s + 50);
                    else setBlackScore(s => s + 50);
                }

                Vibration.vibrate(50);

                // Don't switch turn if potted (Carrom rule)
                return;
            }
        }

        // Switch turn if nothing potted
        setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
    };

    // Check Winner
    useEffect(() => {
        const remainingCoins = coins.filter(c => !c.potted);
        if (remainingCoins.length === 0) {
            // Game Over
            if (whiteScore > blackScore) setWinner('white');
            else if (blackScore > whiteScore) setWinner('black');
            else setWinner('draw');

            setShowCelebration(true);
        }
    }, [coins, whiteScore, blackScore]);

    const resetGame = () => {
        setWhiteScore(0);
        setBlackScore(0);
        setCurrentPlayer('white');
        setWinner(null);
        setShowCelebration(false);
        setCoins(coins.map(c => ({ ...c, potted: false }))); // Reset pots
    };

    // Handle Hardware Back Press
    useEffect(() => {
        const backAction = () => {
            if (!winner && (whiteScore > 0 || blackScore > 0)) {
                setAlertConfig({
                    title: "Exit Game?",
                    message: "Game is in progress. Are you sure you want to quit?",
                    confirmText: "Yes, Exit",
                    cancelText: "Stay",
                    onConfirm: () => navigation.goBack(),
                    onCancel: () => setShowAlert(false)
                });
                setShowAlert(true);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [winner, whiteScore, blackScore, navigation]);


    const isWin = (winner === 'white' && currentPlayer === 'white') || (winner === 'black' && currentPlayer === 'black'); // Simplified logic for demo

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <InGameHeader entryFee={entryFee} />

                <InGameStatus winner={winner} isXNext={currentPlayer === 'white'} prizePool={prizePool} />

                <View style={styles.playersRow}>
                    <InGamePlayerCard
                        name="PLAYER 1"
                        symbol="W"
                        isActive={currentPlayer === 'white'}
                        isTurn={currentPlayer === 'white' && !winner}
                    />
                    <InGamePlayerCard
                        name="PLAYER 2"
                        symbol="B"
                        isActive={currentPlayer === 'black'}
                        isTurn={currentPlayer === 'black' && !winner}
                    />
                </View>

                <CarromBoard
                    coins={coins}
                    striker={{}}
                    onStrike={handleStrike}
                    currentPlayer={currentPlayer}
                />

            </View>

            {/* Back Press Alert */}
            <CustomAlert
                visible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText}
                cancelText={alertConfig.cancelText}
                onConfirm={alertConfig.onConfirm}
                onCancel={alertConfig.onCancel}
                showCancel={true}
                onClose={() => setShowAlert(false)}
            />

            {/* Win/Loss Celebration */}
            <WinCelebration
                visible={showCelebration}
                amount={prizePool}
                isWinner={true} // For demo, always show winner view
                onNewGame={resetGame}
                onQuit={() => navigation.goBack()}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gamesColor.background,
    },
    content: {
        flex: 1,
        paddingBottom: verticalScale(20),
    },
    playersRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
});

export default CarromGame;
