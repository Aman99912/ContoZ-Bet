import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const GameTabSelector = ({ tabs, activeTab, onTabChange }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => onTabChange(tab)}
                    activeOpacity={0.7}
                >
                    <CText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                        {tab}
                    </CText>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: verticalScale(4),
        gap: moderateScale(8),
    },
    tab: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(8),
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeTab: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    tabText: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: colors.black,
    },
});

export default GameTabSelector;
