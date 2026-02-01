import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

const NotificationService = {
    // Request User Permission
    requestUserPermission: async () => {
        try {
            if (Platform.OS === 'android' && Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Notification permission denied');
                    return false;
                }
            }

            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Permission request failed', error);
            return false;
        }
    },

    // Get FCM Token
    getFCMToken: async () => {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log('FCM Token:', fcmToken);
                return fcmToken;
            } else {
                console.log('Failed to generate FCM token');
                return null;
            }
        } catch (error) {
            console.error('FCM Token error:', error);
            return null;
        }
    },

    // Initialize Listeners (Optional for now, but good foundation)
    init: () => {
        // Foreground state messages
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });

        return unsubscribe;
    }
};

export default NotificationService;
