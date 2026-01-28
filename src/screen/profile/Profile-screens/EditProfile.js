import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/core/theme/colors';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import CText from '@/components/common/CText';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfile() {
    const navigation = useNavigation();
    const [name, setName] = useState('General User');
    const [email, setEmail] = useState('user@example.com');
    const [mobile] = useState('9876543210');
    const [age, setAge] = useState('25');
    const [profileImage, setProfileImage] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        console.log('Profile saved:', { name, email, age, profileImage });
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                        <MaterialCommunityIcons name="close" size={moderateScale(28)} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <CText style={styles.headerTitle}>Edit Profile</CText>
                    <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                        <MaterialCommunityIcons name="check" size={moderateScale(28)} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity style={styles.avatar} onPress={pickImage} activeOpacity={0.8}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                            ) : (
                                <MaterialCommunityIcons name="account" size={moderateScale(60)} color={colors.textSecondary} />
                            )}
                            <View style={styles.cameraIcon}>
                                <MaterialCommunityIcons name="camera" size={moderateScale(20)} color={colors.black} />
                            </View>
                        </TouchableOpacity>
                        <CText style={styles.note}>Tap to change profile picture</CText>
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <CText style={styles.label}>Full Name</CText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <CText style={styles.label}>Email</CText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <CText style={styles.label}>Mobile</CText>
                            <View style={styles.disabledInput}>
                                <CText style={styles.disabledText}>{mobile}</CText>
                            </View>
                        </View>

                        <View style={styles.inputWrapper}>
                            <CText style={styles.label}>Age</CText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your age"
                                placeholderTextColor={colors.textSecondary}
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                maxLength={3}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
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
    headerButton: {
        padding: moderateScale(8),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(40),
    },
    avatarContainer: {
        alignItems: 'center',
        paddingVertical: verticalScale(24),
    },
    avatar: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        backgroundColor: colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 2,
        borderColor: colors.border,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(50),
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        borderRadius: moderateScale(20),
        padding: moderateScale(6),
        borderWidth: 2,
        borderColor: colors.background,
    },
    note: {
        marginTop: verticalScale(12),
        fontSize: moderateScale(12),
        color: colors.textSecondary,
    },
    inputContainer: {
        paddingHorizontal: moderateScale(20),
    },
    inputWrapper: {
        marginBottom: verticalScale(20),
    },
    label: {
        fontSize: moderateScale(14),
        color: colors.textPrimary,
        marginBottom: verticalScale(8),
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: moderateScale(12),
        padding: moderateScale(14),
        fontSize: moderateScale(16),
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    disabledInput: {
        backgroundColor: colors.inputBackground,
        borderRadius: moderateScale(12),
        padding: moderateScale(14),
        borderWidth: 1,
        borderColor: colors.border,
    },
    disabledText: {
        fontSize: moderateScale(16),
        color: colors.textSecondary,
    },
});
