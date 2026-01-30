import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';

export default function Notifications() {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const notifications = [
        {
            id: 1,
            type: 'win',
            title: 'You Won!',
            message: 'Congratulations! You won ₹500 in 8 Ball Pool',
            time: '2 hours ago',
            read: false,
        },
        {
            id: 2,
            type: 'wallet',
            title: 'Money Added',
            message: '₹1000 has been added to your wallet',
            time: '5 hours ago',
            read: false,
        },
        {
            id: 3,
            type: 'referral',
            title: 'Referral Bonus',
            message: 'You earned ₹30 from referral',
            time: '1 day ago',
            read: true,
        },
        {
            id: 4,
            type: 'game',
            title: 'New Game Available',
            message: 'Try our new game: Fruit Chop',
            time: '2 days ago',
            read: true,
        },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'win':
                return 'trophy';
            case 'wallet':
                return 'wallet';
            case 'referral':
                return 'gift';
            case 'game':
                return 'gamepad-variant';
            default:
                return 'bell';
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</CText>
                <TouchableOpacity style={styles.clearButton}>
                    <CText style={[styles.clearText, { color: colors.primary }]}>Clear All</CText>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {notifications.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            style={[
                                styles.notifCard,
                                { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.black },
                                !notif.read && [styles.unreadCard, { borderColor: colors.primary }]
                            ]}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.inputBackground }]}>
                                <MaterialCommunityIcons
                                    name={getIcon(notif.type)}
                                    size={moderateScale(24)}
                                    color={notif.read ? colors.textSecondary : colors.primary}
                                />
                            </View>
                            <View style={styles.notifContent}>
                                <CText style={[styles.notifTitle, { color: colors.textPrimary }]}>{notif.title}</CText>
                                <CText style={[styles.notifMessage, { color: colors.textSecondary }]}>{notif.message}</CText>
                                <CText style={[styles.notifTime, { color: colors.textSecondary }]}>{notif.time}</CText>
                            </View>
                            {!notif.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    clearButton: {
        padding: moderateScale(4),
    },
    clearText: {
        fontSize: moderateScale(14),
        color: colors.primary,
        fontWeight: '600',
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: moderateScale(16),
    },
    notifCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    unreadCard: {
        borderColor: colors.primary,
        borderWidth: 1.5,
    },
    iconContainer: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(12),
    },
    notifContent: {
        flex: 1,
    },
    notifTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    notifMessage: {
        fontSize: moderateScale(14),
        color: colors.textSecondary,
        marginBottom: 4,
    },
    notifTime: {
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
    unreadDot: {
        width: moderateScale(10),
        height: moderateScale(10),
        borderRadius: moderateScale(5),
        backgroundColor: colors.primary,
        marginLeft: moderateScale(8),
    },
});
