import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import TransactionItem from './transactionitem';

const Transactions = ({
    transactions,
    loading,
    refreshing,
    isLoadingMore,
    hasMore,
    onRefresh,
    onLoadMore,
    onItemPress,
}) => {
    const { colors } = useTheme();

    const defaultRenderItem = ({ item }) => (
        <TransactionItem
            transaction={item}
            onPress={() => onItemPress && onItemPress(item)}
        />
    );

    return (
        <FlatList
            data={transactions}
            keyExtractor={(item, index) => {
                const id = item?.id || item?.attributes?.id;
                return id ? String(id) : String(index);
            }}
            renderItem={defaultRenderItem}
            ListFooterComponent={
                isLoadingMore ? (
                    <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                ) : !hasMore && transactions && transactions.length > 0 ? (
                    <CText style={[styles.noMoreTransactionsText, { color: colors.textSecondary }]}>No more transactions</CText>
                ) : null
            }
            ListEmptyComponent={
                !loading && !refreshing ? (
                    <View style={styles.noTransactionsContainer}>
                        <CText style={[styles.noTransactionsText, { color: colors.textSecondary }]}>No transactions found</CText>
                    </View>
                ) : null
            }
            onEndReachedThreshold={0.2}
            onEndReached={() => {
                // Only load more if not already loading and there's more data
                if (!isLoadingMore && hasMore && onLoadMore) {
                    onLoadMore();
                }
            }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingBottom: verticalScale(20) }}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    loadingMoreContainer: {
        paddingVertical: verticalScale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMoreTransactionsText: {
        textAlign: 'center',
        color: colors.textSecondary,
        paddingVertical: verticalScale(20),
        fontSize: moderateScale(14),
    },
    noTransactionsContainer: {
        padding: moderateScale(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(10),
    },
    noTransactionsText: { fontSize: moderateScale(16), color: colors.textSecondary },
});

export default Transactions;
