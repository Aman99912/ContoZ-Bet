import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from './CText';

const { width } = Dimensions.get('window');

const PaymentSuccessModal = ({
    visible,
    onClose,
    status = 'success', // 'success' | 'failure'
    message,
    title,
    transactionId
}) => {
    const { colors } = useTheme();

    if (!visible) return null;

    const isSuccess = status === 'success';
    const iconName = isSuccess ? 'check-circle' : 'alert-circle';
    const iconColor = isSuccess ? '#28a745' : '#e74c3c';
    const defaultTitle = isSuccess ? 'Payment Successful' : 'Payment Failed';
    const defaultMessage = isSuccess
        ? 'Your wallet has been updated successfully.'
        : 'Your payment could not be processed.';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={iconName}
                            size={moderateScale(70)}
                            color={iconColor}
                        />
                    </View>

                    <CText style={[styles.title, { color: colors.textPrimary }]}>
                        {title || defaultTitle}
                    </CText>

                    <CText style={[styles.message, { color: colors.textSecondary }]}>
                        {message || defaultMessage}
                    </CText>

                    {transactionId && (
                        <View style={[styles.txnContainer, { backgroundColor: colors.background }]}>
                            <CText style={[styles.txnLabel, { color: colors.textSecondary }]}>Transaction ID</CText>
                            <CText style={[styles.txnId, { color: colors.textPrimary }]}>{transactionId}</CText>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <CText style={[styles.buttonText, { color: colors.black }]}>Close</CText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        borderRadius: moderateScale(20),
        padding: moderateScale(24),
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconContainer: {
        marginBottom: verticalScale(16),
    },
    title: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        marginBottom: verticalScale(8),
        textAlign: 'center',
    },
    message: {
        fontSize: moderateScale(14),
        textAlign: 'center',
        marginBottom: verticalScale(20),
        lineHeight: verticalScale(20),
    },
    txnContainer: {
        width: '100%',
        padding: moderateScale(12),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(24),
        alignItems: 'center',
    },
    txnLabel: {
        fontSize: moderateScale(12),
        marginBottom: verticalScale(2),
    },
    txnId: {
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(25),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});

export default PaymentSuccessModal;
