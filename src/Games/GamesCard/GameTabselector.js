import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const GameTabSelector = ({ tabs, activeTab, onTabChange }) => {
    const { colors } = useTheme();
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.tab,
                        { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary },
                        activeTab === tab && [styles.activeTab, { backgroundColor: colors.primary, borderColor: colors.primary }]
                    ]}
                    onPress={() => onTabChange(tab)}
                    activeOpacity={0.7}
                >
                    <CText style={[
                        styles.tabText,
                        { color: colors.textSecondary },
                        activeTab === tab && [styles.activeTabText, { color: colors.black }]
                    ]}>
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
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
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
