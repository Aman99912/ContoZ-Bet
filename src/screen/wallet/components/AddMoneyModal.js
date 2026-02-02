import React from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

import { useApp } from '@/context/AppContext';


const AddMoneyModal = ({
    visible,
    onClose,
    amount,
    setAmount,
    selectedPreset,
    setSelectedPreset,
    presetAmounts = [100, 500, 750, 1000, 1500],
    calculateGST,
    gstPercentage = 18,
    onAddMoney,
    buttonLoading,
}) => {
    const { colors } = useTheme();
    const { config } = useApp();

    const minInvestment = config?.investment?.minimum_investment || 50;
    const isAddDisabled = !amount || Number(amount) < minInvestment;

    if (!visible) return null;

    return (
        <>

            <Modal visible={visible} presentationStyle="fullScreen" onRequestClose={onClose}>
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                onClose();
                            }}
                            style={styles.modalCloseBtn}
                        >
                            <MaterialCommunityIcons name="close" size={moderateScale(24)} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <CText style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Money to Cash Wallet</CText>
                        <View style={styles.modalPlaceholder} />
                    </View>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            style={styles.modalContent}
                            contentContainerStyle={styles.modalContentContainer}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(12) }}>
                                <CText style={[styles.modalInputLabel, { color: colors.textPrimary, marginBottom: 0 }]}>Enter Amount</CText>
                                <CText style={{ fontSize: moderateScale(12), color: colors.textSecondary }}>Min: ₹{minInvestment}</CText>
                            </View>
                            <TextInput
                                style={[styles.modalInput, { backgroundColor: colors.inputBackground, color: colors.textPrimary, borderColor: colors.border }]}
                                placeholder="₹0.00"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={(t) => {
                                    const sanitized = t
                                        .replace(/[^\d.]/g, '')
                                        .replace(/^(\d*\.\d{0,2}).*$/, '$1');
                                    const cleaned =
                                        sanitized.startsWith('0') && !sanitized.startsWith('0.')
                                            ? String(parseInt(sanitized || '0', 10))
                                            : sanitized;
                                    setAmount(cleaned);
                                    const n = Number(cleaned);
                                    setSelectedPreset(
                                        Number.isFinite(n) &&
                                            presetAmounts.includes(n) &&
                                            !cleaned.includes('.')
                                            ? n
                                            : null
                                    );
                                }}
                            />

                            <CText style={[styles.modalQuickLabel, { color: colors.textPrimary }]}>Quick Select</CText>
                            <View style={styles.modalQuickContainer}>
                                {presetAmounts.map((val) => {
                                    const selected = selectedPreset === val;
                                    return (
                                        <TouchableOpacity
                                            key={val}
                                            style={[
                                                styles.modalQuickBtn,
                                                { backgroundColor: colors.inputBackground, borderColor: colors.border },
                                                selected && [styles.modalQuickBtnSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
                                            ]}
                                            onPress={() => {
                                                if (selected) {
                                                    setSelectedPreset(null);
                                                    setAmount('');
                                                } else {
                                                    setSelectedPreset(val);
                                                    setAmount(String(val));
                                                }
                                            }}
                                            activeOpacity={0.8}
                                        >
                                            <CText
                                                style={[
                                                    styles.modalQuickBtnText,
                                                    { color: colors.textSecondary },
                                                    selected && [styles.modalQuickBtnTextSelected, { color: colors.black }],
                                                ]}
                                            >
                                                ₹{val.toLocaleString('en-IN')}
                                            </CText>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {(amount || selectedPreset) &&
                                (() => {
                                    const baseAmount = Number(amount) || selectedPreset || 0;
                                    if (baseAmount <= 0) return null;

                                    return (
                                        <View style={[styles.gstBreakdownContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                                            <View style={styles.gstBreakdownRow}>
                                                <CText style={[styles.gstBreakdownLabel, { color: colors.textSecondary }]}>Recharge Amount</CText>
                                                <CText style={[styles.gstBreakdownValue, { color: colors.textPrimary }]}>₹{baseAmount.toFixed(2)}</CText>
                                            </View>
                                            <CText style={[styles.gstInfoText, { color: colors.textSecondary }]}>
                                                ₹{baseAmount.toFixed(2)} will be added to your wallet
                                            </CText>
                                        </View>
                                    );
                                })()}

                            <TouchableOpacity
                                style={[
                                    styles.modalAddBtn,
                                    { backgroundColor: colors.primary },
                                    (isAddDisabled || buttonLoading) && styles.modalAddBtnDisabled,
                                ]}
                                onPress={() => onAddMoney()}
                                disabled={isAddDisabled || buttonLoading}
                            >
                                {buttonLoading ? (
                                    <ActivityIndicator color={colors.black} size="small" />
                                ) : (
                                    <CText style={[styles.modalAddBtnText, { color: colors.black }]} numberOfLines={1}>Add Money</CText>
                                )}
                            </TouchableOpacity>

                            <View style={{ height: verticalScale(300) }} />
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: colors.background, paddingTop: verticalScale(22) },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(15),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingTop: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(15),
    },
    modalCloseBtn: { padding: moderateScale(8) },
    modalTitle: { fontSize: moderateScale(16), fontWeight: '600', color: colors.textPrimary },
    modalPlaceholder: { width: moderateScale(40) },
    modalContent: { flex: 1 },
    modalContentContainer: {
        padding: moderateScale(20),
        paddingBottom: verticalScale(40),
    },
    modalInputLabel: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: verticalScale(12),
    },
    modalInput: {
        fontSize: moderateScale(24),
        fontWeight: '500',
        backgroundColor: colors.inputBackground,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(24),
        textAlign: 'center',
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalQuickLabel: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: verticalScale(12),
    },
    modalQuickContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: verticalScale(32),
        gap: moderateScale(12),
    },
    modalQuickBtn: {
        backgroundColor: colors.inputBackground,
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: verticalScale(8),
    },
    modalQuickBtnSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    modalQuickBtnText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.textSecondary,
    },
    modalQuickBtnTextSelected: { color: colors.black },
    modalAddBtn: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(16),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    modalAddBtnDisabled: { backgroundColor: colors.textSecondary },
    modalAddBtnText: {
        color: colors.black,
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    gstBreakdownContainer: {
        backgroundColor: colors.inputBackground,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginTop: verticalScale(24),
        marginBottom: verticalScale(16),
        borderWidth: 1,
        borderColor: colors.border,
    },
    gstBreakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    gstBreakdownTotal: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: moderateScale(12),
        marginTop: verticalScale(8),
        marginBottom: 0,
    },
    gstBreakdownLabel: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
    },
    gstBreakdownValue: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        fontWeight: '500',
    },
    gstBreakdownTotalLabel: {
        fontSize: moderateScale(16),
        color: colors.textPrimary,
        fontWeight: '600',
    },
    gstBreakdownTotalValue: {
        fontSize: moderateScale(16),
        color: colors.primary,
        fontWeight: '700',
    },
    gstInfoText: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
        marginTop: verticalScale(12),
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default AddMoneyModal;
