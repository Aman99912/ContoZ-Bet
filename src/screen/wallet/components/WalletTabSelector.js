import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, Animated, Easing } from 'react-native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WalletTabSelector = ({ activeTab, setActiveTab, tabs = ['All'] }) => {
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const toggleDropdown = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);

        Animated.timing(rotateAnim, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
        }).start();
    };

    const handleSelect = (tab) => {
        setActiveTab(tab);
        toggleDropdown();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.filterSection}>
            <View style={styles.headerRow}>
                <CText style={[styles.title, { color: colors.textPrimary }]}>Transactions</CText>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={toggleDropdown}
                        style={[
                            styles.dropdownHeader,
                            { backgroundColor: colors.inputBackground, borderColor: colors.border },
                            isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderColor: colors.primary }
                        ]}
                    >
                        <CText style={[styles.selectedText, { color: colors.textPrimary }]}>{activeTab}</CText>
                        <Animated.View style={{ transform: [{ rotate }] }}>
                            <MaterialCommunityIcons name="chevron-down" size={moderateScale(20)} color={colors.textSecondary} />
                        </Animated.View>
                    </TouchableOpacity>

                    {isOpen && (
                        <View style={[styles.dropdownList, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                            {tabs.map((tab, index) => (
                                <TouchableOpacity
                                    key={tab}
                                    style={[
                                        styles.dropdownItem,
                                        activeTab === tab && { backgroundColor: colors.primary + '15' },
                                        index === tabs.length - 1 && styles.lastItem
                                    ]}
                                    onPress={() => handleSelect(tab)}
                                >
                                    <CText
                                        style={[
                                            styles.itemText,
                                            { color: colors.textSecondary },
                                            activeTab === tab && { color: colors.primary, fontWeight: '600' }
                                        ]}
                                    >
                                        {tab}
                                    </CText>
                                    {activeTab === tab && (
                                        <MaterialCommunityIcons name="check" size={moderateScale(16)} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterSection: {
        paddingHorizontal: moderateScale(16),
        marginBottom: verticalScale(16),
        zIndex: 100, // Important for dropdown overlap if needed
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '700',
    },
    dropdownContainer: {
        width: moderateScale(140),
        position: 'relative',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(12),
        borderWidth: 1,
    },
    selectedText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: moderateScale(12),
        borderBottomRightRadius: moderateScale(12),
        overflow: 'hidden',
        marginTop: -1, // overlap border
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
    },
    lastItem: {
        marginBottom: 0,
    },
    itemText: {
        fontSize: moderateScale(13),
    },
});

export default WalletTabSelector;
