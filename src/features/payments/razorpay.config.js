/**
 * Razorpay Configuration
 * Loads credentials from environment variables
 */

export const RAZORPAY_CONFIG = {
    KEY_ID: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RlzwREitLRmM0U',
    KEY_SECRET: process.env.EXPO_PUBLIC_RAZORPAY_KEY_SECRET || 'hPEhJTLS9vp1aiIGUDnepprX',
};

export default RAZORPAY_CONFIG;
