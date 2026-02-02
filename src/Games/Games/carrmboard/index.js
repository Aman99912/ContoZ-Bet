import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    BackHandler,
    Vibration,
    Dimensions,
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

    // Initial Coin positions (Center formation)
    const [coins, setCoins] = useState(() => {
        const { width } = Dimensions.get('window');
        // Matches CarromBoard.js layout logic
        const BOARD_SIZE = width - moderateScale(24);
        const PADDING = moderateScale(20);
        const SURFACE_SIZE = BOARD_SIZE - PADDING * 2;
        const center = SURFACE_SIZE / 2;

        // Adjust for Board component internal padding/margins if needed.
        // CarromBoard Surface is relative to Frame. Coins are rendered absolute in Surface.
        // Frame padding is 20. Surface is inside Frame. 
        // So (0,0) of Surface is Top-Left of playable area. Center is Surface/2.

        const coinRadius = moderateScale(12); // Half of width (24)

        const hexRadius = moderateScale(26); // Distance for first ring
        const hexRadius2 = moderateScale(52); // Distance for second ring

        // Exact coin definitions
        const fixedCoins = [
            { id: 0, color: 'queen', x: 0, y: 0 },
            // Inner Circle (6)
            { id: 1, color: 'white', x: hexRadius, y: 0 },
            { id: 2, color: 'black', x: hexRadius * 0.5, y: hexRadius * 0.866 },
            { id: 3, color: 'white', x: -hexRadius * 0.5, y: hexRadius * 0.866 },
            { id: 4, color: 'black', x: -hexRadius, y: 0 },
            { id: 5, color: 'white', x: -hexRadius * 0.5, y: -hexRadius * 0.866 },
            { id: 6, color: 'black', x: hexRadius * 0.5, y: -hexRadius * 0.866 },
            // Outer Circle (12)
            { id: 7, color: 'white', x: hexRadius * 2, y: 0 },
            { id: 8, color: 'black', x: hexRadius * 1.5, y: hexRadius * 0.866 },
            { id: 9, color: 'white', x: hexRadius * 1, y: hexRadius * 1.732 },
            { id: 10, color: 'black', x: 0, y: hexRadius * 2 },
            { id: 11, color: 'white', x: -hexRadius * 1, y: hexRadius * 1.732 },
            { id: 12, color: 'black', x: -hexRadius * 1.5, y: hexRadius * 0.866 },
            { id: 13, color: 'white', x: -hexRadius * 2, y: 0 },
            { id: 14, color: 'black', x: -hexRadius * 1.5, y: -hexRadius * 0.866 },
            { id: 15, color: 'white', x: -hexRadius * 1, y: -hexRadius * 1.732 },
            { id: 16, color: 'black', x: 0, y: -hexRadius * 2 },
            { id: 17, color: 'white', x: hexRadius * 1, y: -hexRadius * 1.732 },
            { id: 18, color: 'black', x: hexRadius * 1.5, y: -hexRadius * 0.866 },
        ];

        return fixedCoins.map(c => ({
            ...c,
            x: center + c.x - coinRadius,
            y: center + c.y - coinRadius,
            potted: false
        }));
    });

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
