import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import CInput from '@/components/common/CInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userAPI } from '@/api/services';

export default function CreateTicket() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant permission to access your photos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: 5,
            });

            if (!result.canceled) {
                const newImages = result.assets.map(asset => ({
                    uri: asset.uri,
                    type: asset.mimeType || 'image/jpeg',
                    name: asset.fileName || `image_${Date.now()}.jpg`,
                }));
                setAttachments([...attachments, ...newImages]);
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert('Error', 'Failed to pick images. Please try again.');
        }
    };

    const removeImage = (index) => {
        const newAttachments = attachments.filter((_, i) => i !== index);
        setAttachments(newAttachments);
    };

    const handleSubmit = async () => {
        if (!subject.trim()) {
            Alert.alert('Validation Error', 'Please enter a subject.');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Validation Error', 'Please enter a description.');
            return;
        }

        try {
            setLoading(true);

            // Create FormData
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('description', description);

            // Append attachments
            attachments.forEach((attachment, index) => {
                formData.append('attachments', {
                    uri: attachment.uri,
                    name: attachment.name,
                    type: attachment.type,
                });
            });

            console.log('FormData created with:', {
                subject,
                description,
                attachmentsCount: attachments.length,
            });

            // Log attachment details for debugging
            attachments.forEach((att, idx) => {
                console.log(`Attachment ${idx}:`, {
                    uri: att.uri.substring(0, 50) + '...',
                    name: att.name,
                    type: att.type,
                });
            });

            // Call API
            const response = await userAPI.createTicket(formData);

            Alert.alert(
                'Success',
                'Your support ticket has been created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );

            // Reset form
            setSubject('');
            setDescription('');
            setAttachments([]);
        } catch (error) {
            console.error('Error creating ticket:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(28)} color={colors.textPrimary} />
                </TouchableOpacity>
                <CText style={[styles.headerTitle, { color: colors.textPrimary }]}>Create Support Ticket</CText>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <CText style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Please provide details about your issue
                    </CText>

                    {/* Subject Input */}
                    <View style={styles.inputContainer}>
                        <CText style={[styles.label, { color: colors.textPrimary }]}>Subject *</CText>
                        <CInput
                            placeholder="Enter ticket subject"
                            value={subject}
                            onChangeText={setSubject}
                            maxLength={100}
                        />
                    </View>

                    {/* Description Input */}
                    <View style={styles.inputContainer}>
                        <CText style={[styles.label, { color: colors.textPrimary }]}>Description *</CText>
                        <CInput
                            placeholder="Describe your issue in detail"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            maxLength={500}
                        />
                        <CText style={[styles.charCount, { color: colors.textSecondary }]}>
                            {description.length}/500
                        </CText>
                    </View>

                    {/* Attachments Section */}
                    <View style={styles.inputContainer}>
                        <CText style={[styles.label, { color: colors.textPrimary }]}>Attachments (Optional)</CText>

                        <TouchableOpacity
                            style={[styles.uploadButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={pickImages}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name="image-plus" size={moderateScale(24)} color={colors.primary} />
                            <CText style={[styles.uploadText, { color: colors.textPrimary }]}>
                                Add Images (Max 5)
                            </CText>
                        </TouchableOpacity>

                        {/* Image Preview */}
                        {attachments.length > 0 && (
                            <View style={styles.imageGrid}>
                                {attachments.map((attachment, index) => (
                                    <View key={index} style={styles.imageContainer}>
                                        <Image source={{ uri: attachment.uri }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={[styles.removeButton, { backgroundColor: colors.error }]}
                                            onPress={() => removeImage(index)}
                                        >
                                            <MaterialCommunityIcons name="close" size={moderateScale(16)} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            { backgroundColor: colors.primary },
                            loading && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <CText style={styles.submitButtonText}>Submit Ticket</CText>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    headerPlaceholder: {
        width: moderateScale(36),
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: moderateScale(20),
    },
    subtitle: {
        fontSize: moderateScale(14),
        marginBottom: verticalScale(24),
    },
    inputContainer: {
        marginBottom: verticalScale(2),
    },
    label: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        marginBottom: verticalScale(8),
    },
    charCount: {
        fontSize: moderateScale(12),
        textAlign: 'right',
        marginTop: verticalScale(4),
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    uploadText: {
        fontSize: moderateScale(14),
        marginLeft: moderateScale(8),
        fontWeight: '500',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: verticalScale(12),
        gap: moderateScale(10),
    },
    imageContainer: {
        position: 'relative',
        width: moderateScale(80),
        height: moderateScale(80),
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(8),
    },
    removeButton: {
        position: 'absolute',
        top: -moderateScale(6),
        right: -moderateScale(6),
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        padding: moderateScale(16),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        marginTop: verticalScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});
