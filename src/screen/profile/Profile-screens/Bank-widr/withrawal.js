import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CCard from '@/components/common/CCard';

const { width } = Dimensions.get('window');

const WithdrawalScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Background Blobs */}
            <View style={styles.blobTop} />
            <View style={styles.blobBottom} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={moderateScale(28)} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <CText style={styles.headerTitle}>Withdrawal</CText>
                    <View style={styles.headerPlaceholder} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentWrapper}>
                        <CText style={styles.subtitle}>Choose Method</CText>
                        <CText style={styles.description}>
                            Select how you want to receive your funds.
                        </CText>

                        {/* Bank Option */}
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('BankDetails')}
                            style={styles.optionButton}
                        >
                            <CCard style={styles.optionCard}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="bank-outline" size={moderateScale(32)} color={colors.primary} />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <CText style={styles.optionTitle}>Bank Transfer</CText>
                                    <CText style={styles.optionSubtitle}>Withdraw directly to your bank account</CText>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
                            </CCard>
                        </TouchableOpacity>

                        {/* UPI Option */}
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('UPIDetails')}
                            style={styles.optionButton}
                        >
                            <CCard style={styles.optionCard}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="qrcode-scan" size={moderateScale(32)} color={colors.primary} />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <CText style={styles.optionTitle}>UPI Transfer</CText>
                                    <CText style={styles.optionSubtitle}>Instant withdrawal via UPI ID</CText>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
                            </CCard>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        position: 'relative',
    },
    safeArea: {
        flex: 1,
    },
    blobTop: {
        position: 'absolute',
        top: -width * 0.4,
        right: -width * 0.2,
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        backgroundColor: colors.primary,
        opacity: 0.08,
    },
    blobBottom: {
        position: 'absolute',
        bottom: -width * 0.3,
        left: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: colors.primary,
        opacity: 0.05,
        transform: [{ scaleX: 1.2 }],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        marginBottom: verticalScale(20),
        marginTop: verticalScale(10),
    },
    backButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    headerPlaceholder: {
        width: moderateScale(40),
    },
    scrollContent: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: verticalScale(20),
    },
    contentWrapper: {
        flex: 1,
    },
    subtitle: {
        fontSize: moderateScale(24),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
    },
    description: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        marginBottom: verticalScale(30),
    },
    optionButton: {
        marginBottom: verticalScale(16),
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: moderateScale(20),
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    iconContainer: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(25),
        backgroundColor: 'rgba(44, 182, 125, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(16),
        borderWidth: 1,
        borderColor: 'rgba(44, 182, 125, 0.2)',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: verticalScale(4),
    },
    optionSubtitle: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
});

export default WithdrawalScreen;
