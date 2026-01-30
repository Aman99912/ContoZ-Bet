import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const TransactionItem = ({ transaction, onPress, downloadingInvoiceMap = {} }) => {
    const { colors } = useTheme();
    const tx = transaction?.attributes || transaction;

    const isCredit = tx?.type === 'credit' || tx?.type === 'topup';
    const isTopup = tx?.type === 'topup';
    const hasInvoice = tx?.hasInvoice || false;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime())
                ? 'Invalid date'
                : date.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <View style={[styles.transactionCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={styles.avatarContainer}>
                {isTopup ? (
                    <MaterialCommunityIcons
                        name="wallet-plus-outline"
                        size={moderateScale(36)}
                        color={colors.primary}
                    />
                ) : (
                    <MaterialCommunityIcons
                        name="gamepad-variant"
                        size={moderateScale(36)}
                        color={colors.primary}
                    />
                )}
            </View>

            <View style={styles.transactionInfo}>
                <CText style={[styles.titleText, { color: colors.textPrimary }]}>
                    {isTopup ? 'Wallet Top Up' : tx?.title || 'Game Transaction'}
                </CText>
                <CText style={[styles.labelText, { color: colors.textSecondary }]}>{tx?.description || 'Transaction'}</CText>
                <CText style={[styles.labelText, { fontSize: moderateScale(10), marginTop: 2, color: colors.textSecondary }]}>
                    {tx?.transaction_Id || 'TXN-ID'}
                </CText>
            </View>

            {hasInvoice && (
                <View style={styles.invoiceDownloadContainer}>
                    <TouchableOpacity
                        style={[styles.invoiceDownloadButton, { borderColor: colors.primary }]}
                        onPress={() => onPress && onPress(tx)}
                        disabled={!!downloadingInvoiceMap[tx.id]}
                    >
                        {downloadingInvoiceMap[tx.id] ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <MaterialCommunityIcons
                                name="download"
                                size={moderateScale(18)}
                                color={colors.primary}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.amountContainer}>
                <View style={styles.amountWithIcon}>
                    <CText style={[styles.amountText, isCredit ? { color: colors.primary } : { color: colors.error }]}>
                        {isCredit ? '+' : '-'}₹{Number(tx?.amount || 0).toFixed(2)}
                    </CText>
                    {tx?.paymentStatus && (
                        <CText
                            style={[
                                styles.paymentStatusText,
                                tx.paymentStatus === 'success'
                                    ? { color: colors.primary }
                                    : tx.paymentStatus === 'failure'
                                        ? { color: colors.error }
                                        : { color: colors.pending },
                            ]}
                        >
                            {tx.paymentStatus.toUpperCase()}
                        </CText>
                    )}
                    <CText style={[styles.dateText, { textAlign: 'right', marginTop: verticalScale(8), color: colors.textSecondary }]}>
                        {formatDate(tx?.createdAt)}
                    </CText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    transactionCard: {
        flexDirection: 'row',
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'flex-start',
    },
    avatarContainer: {
        marginRight: moderateScale(12),
        marginTop: verticalScale(4),
    },
    transactionInfo: { flex: 1 },
    titleText: { fontSize: moderateScale(14), color: colors.textPrimary, fontWeight: '600' },
    dateText: {
        fontSize: moderateScale(9),
        color: colors.textSecondary,
        marginTop: verticalScale(2),
    },
    labelText: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        marginTop: verticalScale(2),
    },
    invoiceDownloadContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: moderateScale(8),
        marginTop: verticalScale(2),
    },
    invoiceDownloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: moderateScale(4),
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(11),
        borderWidth: 1,
        borderColor: colors.primary,
    },
    amountContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        minWidth: moderateScale(80),
    },
    amountWithIcon: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    amountText: { fontSize: moderateScale(16), fontWeight: 'bold' },
    green: { color: colors.primary },
    red: { color: colors.error },
    paymentStatusText: {
        fontSize: moderateScale(8),
        fontWeight: '500',
        textTransform: 'uppercase',
        marginTop: verticalScale(3),
    },
    paymentStatusSuccess: { color: colors.primary },
    paymentStatusFailure: { color: colors.error },
    paymentStatusPending: { color: colors.pending },
});

export default TransactionItem;
