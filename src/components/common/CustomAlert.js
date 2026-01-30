import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme, colors } from '@/core/theme/colors';
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
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.alertCard, { backgroundColor: colors.surface }]}>
                    {title && <CText style={[styles.alertTitle, { color: colors.textPrimary }]}>{title}</CText>}
                    <CText style={[styles.alertMessage, { color: colors.textSecondary }]}>{message}</CText>

                    <View style={styles.buttonContainer}>
                        {showConfirm ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.alertButton, styles.cancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                                    onPress={onClose}
                                >
                                    <CText style={[styles.cancelButtonText, { color: colors.textSecondary }]}>{cancelText}</CText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.alertButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                                    onPress={() => {
                                        if (onConfirm) onConfirm();
                                        onClose();
                                    }}
                                >
                                    <CText style={[styles.alertButtonText, { color: colors.black }]}>{confirmText}</CText>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity style={[styles.alertButton, { backgroundColor: colors.primary }]} onPress={onClose}>
                                <CText style={[styles.alertButtonText, { color: colors.black }]}>{buttonText}</CText>
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
        marginBottom: verticalScale(12),
        textAlign: 'center',
    },
    alertMessage: {
        fontSize: moderateScale(16),
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
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(30),
        borderRadius: moderateScale(25),
        minWidth: moderateScale(120),
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    confirmButton: {
    },
    alertButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    cancelButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});

export default CustomAlert;
