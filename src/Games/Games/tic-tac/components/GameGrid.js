import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale } from '@/core/utils/responsive';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GameGrid = ({ board, onCellPress, winningLine = [] }) => {
    const renderCell = (index) => {
        const value = board[index];
        const isWinningCell = winningLine.includes(index);

        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.cell,
                    isWinningCell && { backgroundColor: value === 'X' ? '#FF4D6D40' : '#FFEB3B40', borderWidth: 2, borderColor: value === 'X' ? gamesColor.player1 : gamesColor.player2 }
                ]}
                onPress={() => onCellPress(index)}
                activeOpacity={0.7}
            >
                {value === 'X' && (
                    <MaterialCommunityIcons name="close" size={moderateScale(54)} color={gamesColor.player1} />
                )}
                {value === 'O' && (
                    <MaterialCommunityIcons name="circle-outline" size={moderateScale(46)} color={gamesColor.player2} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.gridContainer}>
            <View style={styles.gridInner}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => renderCell(index))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        padding: moderateScale(10),
        backgroundColor: gamesColor.gridBackground,
        borderRadius: moderateScale(25),
        marginTop: verticalScale(20),
        alignSelf: 'center',
    },
    gridInner: {
        width: moderateScale(260),
        height: moderateScale(260),
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(8),
    },
    cell: {
        width: moderateScale(81),
        height: moderateScale(81),
        backgroundColor: gamesColor.cellBackground,
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GameGrid;
