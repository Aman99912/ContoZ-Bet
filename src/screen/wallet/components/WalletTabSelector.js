import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const WalletTabSelector = ({ activeTab, setActiveTab, tabs = ['All', 'Cash', 'Earnings'] }) => {
    const { colors } = useTheme();
    return (
        <View style={styles.filterSection}>
            <View style={styles.filterHeaderRow}>
                <CText style={[styles.transactionsTitle, { color: colors.textPrimary }]}>Transactions</CText>
                <View style={[styles.filterContainer, { backgroundColor: colors.inputBackground }]}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.filterTab,
                                activeTab === tab && [styles.filterTabActive, { backgroundColor: colors.surface }]
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <CText style={[
                                styles.filterTabText,
                                { color: colors.textSecondary },
                                activeTab === tab && [styles.filterTabTextActive, { color: colors.textPrimary }]
                            ]}>{tab}</CText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterSection: {
        paddingHorizontal: moderateScale(16),
        marginBottom: verticalScale(12),
    },
    filterHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    transactionsTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: colors.inputBackground,
        borderRadius: moderateScale(12),
        padding: moderateScale(4),
    },
    filterTab: {
        paddingVertical: moderateScale(6),
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(8),
    },
    filterTabActive: {
        backgroundColor: colors.surface,
    },
    filterTabText: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        fontWeight: '500',
    },
    filterTabTextActive: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
});

export default WalletTabSelector;
