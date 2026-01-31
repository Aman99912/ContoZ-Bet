import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Vibration,
} from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import GameHeader from './components/GameHeader';
import PlayerCard from './components/PlayerCard';
import GameGrid from './components/GameGrid';
import CText from '@/components/common/CText';
import CustomAlert from '@/components/common/CustomAlert';
import GameStatus from './components/GameStatus';
import { SafeAreaView } from 'react-native-safe-area-context';

const TicTacToe = ({ navigation, route }) => {
    const {
        entryFee = 50,
        prizePool = 90
    } = route.params || {};

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    // Win patterns
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const checkWinner = useCallback((currentBoard) => {
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { winner: currentBoard[a], line: lines[i] };
            }
        }
        if (!currentBoard.includes(null)) {
            return { winner: 'Draw', line: [] };
        }
        return null;
    }, []);

    const handleCellPress = (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
            Vibration.vibrate(100);

            setTimeout(() => {
                setAlertConfig({
                    title: result.winner === 'Draw' ? "It's a Draw!" : `Player ${result.winner} Wins!`,
                    message: "Would you like to play again?",
                    confirmText: "New Game",
                    cancelText: "Quit",
                    onConfirm: resetGame,
                    onCancel: () => navigation.goBack()
                });
                setShowAlert(true);
            }, 500);
        } else {
            setIsXNext(!isXNext);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningLine([]);
        setShowAlert(false);
    };

    // Handle Hardware Back Press
    useEffect(() => {
        const backAction = () => {
            if (!winner && board.some(cell => cell !== null)) {
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
    }, [winner, board, navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <GameHeader entryFee={entryFee} />

                <GameStatus winner={winner} isXNext={isXNext} prizePool={prizePool} />

                <View style={styles.playersRow}>
                    <PlayerCard
                        name="PLAYER X"
                        symbol="X"
                        isActive={isXNext}
                        isTurn={isXNext && !winner}
                    />
                    <PlayerCard
                        name="PLAYER O"
                        symbol="O"
                        isActive={!isXNext}
                        isTurn={!isXNext && !winner}
                    />
                </View>

                <GameGrid board={board} onCellPress={handleCellPress} winningLine={winningLine} />

                {winner && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                        <CText style={styles.resetText}>NEW GAME</CText>
                    </TouchableOpacity>
                )}
            </View>

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
    resetButton: {
        marginTop: verticalScale(20),
        backgroundColor: gamesColor.accent,
        paddingHorizontal: moderateScale(30),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(25),
        alignSelf: 'center',
        elevation: 5,
    },
    resetText: {
        color: '#FFF',
        fontSize: moderateScale(16),
        fontWeight: '900',
    },
});

export default TicTacToe;
