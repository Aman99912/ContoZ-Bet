import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

const CustomAlert = ({
    visible,
    title,
    message,
    onClose,
    buttonText = 'Okay',
    showConfirm = false,
    confirmText = 'Yes',
    onConfirm = null,
    cancelText = 'Cancel',
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.alertCard}>
                    {title && <CText style={styles.alertTitle}>{title}</CText>}
                    <CText style={styles.alertMessage}>{message}</CText>

                    <View style={styles.buttonContainer}>
                        {showConfirm ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.alertButton, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <CText style={styles.cancelButtonText}>{cancelText}</CText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.alertButton, styles.confirmButton]}
                                    onPress={() => {
                                        if (onConfirm) onConfirm();
                                        onClose();
                                    }}
                                >
                                    <CText style={styles.alertButtonText}>{confirmText}</CText>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity style={styles.alertButton} onPress={onClose}>
                                <CText style={styles.alertButtonText}>{buttonText}</CText>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertCard: {
        backgroundColor: colors.surface,
        width: '80%',
        borderRadius: moderateScale(16),
        padding: moderateScale(24),
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    alertTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(12),
        textAlign: 'center',
    },
    alertMessage: {
        fontSize: moderateScale(16),
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: verticalScale(24),
        lineHeight: moderateScale(22),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: moderateScale(12),
    },
    alertButton: {
        backgroundColor: colors.primary,
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(30),
        borderRadius: moderateScale(25),
        minWidth: moderateScale(120),
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    confirmButton: {
        backgroundColor: colors.primary,
    },
    alertButtonText: {
        color: colors.black,
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});

export default CustomAlert;
