const { withAndroidManifest } = require('@expo/config-plugins');

const withRazorpay = (config) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;
        const mainApplication = androidManifest.manifest.application[0];

        // Check if the Razorpay activity is already present
        // It's possible the SDK adds it automatically in newer versions via merger, 
        // but explicit addition ensures it works.

        // Ensure 'tools' namespace exists on the manifest
        if (!androidManifest.manifest.$['xmlns:tools']) {
            androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
        }

        // Add CheckoutActivity
        const checkoutActivity = {
            $: {
                'android:name': 'com.razorpay.CheckoutActivity',
                'android:configChanges': 'keyboard|keyboardHidden|orientation|screenSize',
                'android:theme': '@style/CheckoutTheme',
                'android:exported': 'true',
                'tools:replace': 'android:exported',
            }
        };

        // Ensure activities array exists
        if (!mainApplication.activity) {
            mainApplication.activity = [];
        }

        const hasActivity = mainApplication.activity.some(
            (a) => a.$['android:name'] === 'com.razorpay.CheckoutActivity'
        );

        if (!hasActivity) {
            mainApplication.activity.push(checkoutActivity);
        }

        return config;
    });
};

module.exports = withRazorpay;
