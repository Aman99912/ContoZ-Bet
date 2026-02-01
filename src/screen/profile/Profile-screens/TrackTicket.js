import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userAPI } from '@/api/services';

export default function TrackTicket() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getTickets();
            // Response is directly an array of tickets
            setTickets(response || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchTickets();
        setRefreshing(false);
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return colors.primary;
            case 'closed':
                return colors.textSecondary;
            case 'in progress':
                return colors.pending;
            default:
                return colors.textSecondary;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return colors.error;
            case 'medium':
                return colors.pending;
            case 'low':
                return colors.primary;
            default:
                return colors.textSecondary;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderTicketCard = (ticket) => (
        <View
            key={ticket._id}
            style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
            {/* Header */}
            <View style={styles.ticketHeader}>
                <View style={styles.ticketHeaderLeft}>
                    <CText style={[styles.ticketId, { color: colors.textPrimary }]}>
                        #{ticket.ticketId?.substring(0, 8)}
                    </CText>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                        <CText style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                            {ticket.status}
                        </CText>
                    </View>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) + '20' }]}>
                    <CText style={[styles.priorityText, { color: getPriorityColor(ticket.priority) }]}>
                        {ticket.priority}
                    </CText>
                </View>
            </View>

            {/* Subject */}
            <CText style={[styles.subject, { color: colors.textPrimary }]} numberOfLines={2}>
                {ticket.subject}
            </CText>

            {/* Description */}
            <CText style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>
                {ticket.description}
            </CText>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                    <View style={styles.attachmentsHeader}>
                        <MaterialCommunityIcons name="paperclip" size={moderateScale(16)} color={colors.textSecondary} />
                        <CText style={[styles.attachmentsLabel, { color: colors.textSecondary }]}>
                            {ticket.attachments.length} Attachment{ticket.attachments.length > 1 ? 's' : ''}
                        </CText>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentsScroll}>
                        {ticket.attachments.map((url, index) => (
                            <TouchableOpacity key={index} activeOpacity={0.8}>
                                <Image
                                    source={{ uri: url }}
                                    style={styles.attachmentThumbnail}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Footer */}
            <View style={styles.ticketFooter}>
                <View style={styles.dateContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={moderateScale(14)} color={colors.textSecondary} />
                    <CText style={[styles.date, { color: colors.textSecondary }]}>
                        {formatDate(ticket.created_at)}
                    </CText>
                </View>
                {ticket.comments && ticket.comments.length > 0 && (
                    <View style={styles.commentsContainer}>
                        <MaterialCommunityIcons name="comment-outline" size={moderateScale(14)} color={colors.textSecondary} />
                        <CText style={[styles.commentsCount, { color: colors.textSecondary }]}>
                            {ticket.comments.length} Comment{ticket.comments.length > 1 ? 's' : ''}
                        </CText>
                    </View>
                )}
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="ticket-outline" size={moderateScale(80)} color={colors.textSecondary} />
            <CText style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Tickets Found</CText>
            <CText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                You haven't created any support tickets yet
            </CText>
            <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('CreateTicket')}
                activeOpacity={0.8}
            >
                <CText style={styles.createButtonText}>Create Your First Ticket</CText>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Track Tickets</CText>
                <TouchableOpacity onPress={() => navigation.navigate('CreateTicket')} style={styles.addButton}>
                    <MaterialCommunityIcons name="plus" size={moderateScale(24)} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <CText style={[styles.loadingText, { color: colors.textSecondary }]}>Loading tickets...</CText>
                </View>
            ) : (
                <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                >
                    <View style={styles.content}>
                        {tickets.length > 0 ? (
                            <>
                                <CText style={[styles.ticketCount, { color: colors.textSecondary }]}>
                                    {tickets.length} Ticket{tickets.length > 1 ? 's' : ''}
                                </CText>
                                {tickets.map(renderTicketCard)}
                            </>
                        ) : (
                            renderEmptyState()
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
    },
    backButton: {
        padding: moderateScale(4),
    },
    addButton: {
        padding: moderateScale(4),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: moderateScale(20),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: verticalScale(12),
        fontSize: moderateScale(14),
    },
    ticketCount: {
        fontSize: moderateScale(14),
        marginBottom: verticalScale(12),
    },
    ticketCard: {
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        marginBottom: verticalScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    ticketHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    ticketId: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    statusBadge: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(12),
    },
    statusText: {
        fontSize: moderateScale(11),
        fontWeight: '600',
    },
    priorityBadge: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(12),
    },
    priorityText: {
        fontSize: moderateScale(11),
        fontWeight: '600',
    },
    subject: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        marginBottom: verticalScale(8),
    },
    description: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        marginBottom: verticalScale(12),
    },
    attachmentsContainer: {
        marginBottom: verticalScale(12),
    },
    attachmentsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
        gap: moderateScale(4),
    },
    attachmentsLabel: {
        fontSize: moderateScale(12),
    },
    attachmentsScroll: {
        marginTop: verticalScale(4),
    },
    attachmentThumbnail: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(8),
        marginRight: moderateScale(8),
    },
    ticketFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: verticalScale(12),
        borderTopWidth: 1,
        borderTopColor: 'rgba(128, 128, 128, 0.1)',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(4),
    },
    date: {
        fontSize: moderateScale(12),
    },
    commentsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(4),
    },
    commentsCount: {
        fontSize: moderateScale(12),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(80),
    },
    emptyTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        marginTop: verticalScale(16),
        marginBottom: verticalScale(8),
    },
    emptySubtitle: {
        fontSize: moderateScale(14),
        textAlign: 'center',
        marginBottom: verticalScale(24),
    },
    createButton: {
        paddingHorizontal: moderateScale(24),
        paddingVertical: moderateScale(12),
        borderRadius: moderateScale(12),
    },
    createButtonText: {
        color: '#FFF',
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
});
