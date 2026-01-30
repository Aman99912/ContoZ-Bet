import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_CONFIG } from './razorpay.config';
import { userAPI } from '@/api/services';

/**
 * Razorpay Payment Integration Component
 * 
 * Orchestrates:
 * 1. Create Order (Server)
 * 2. Checkout (Razorpay SDK)
 * 3. Verify Payment (Server)
 */
export const initiateRazorpayPayment = async ({
    amount, // Amount in INR (e.g. 150) - function converts to paise if needed checking backend response
    name = 'Conto-Z Bet',
    description = 'Add Money to Wallet',
    prefill = {},
    onSuccess,
    onError,
}) => {
    try {
        console.log('[Razorpay] Initiating Recharge:', amount);

        // 1. Create Order
        // Helper to ensure we catch API errors before opening checkout
        const orderResponse = await userAPI.createRechargeOrder({ amount });
        console.log('[Razorpay] Order Created:', orderResponse);

        if (orderResponse?.status !== 201 || !orderResponse?.order) {
            throw new Error(orderResponse?.message || 'Failed to create order');
        }

        const { id: order_id, amount: order_amount, key, currency } = orderResponse.order;

        // 2. Open Checkout
        const options = {
            key: key || RAZORPAY_CONFIG.KEY_ID,
            amount: order_amount, // Amount in paise from backend
            currency: currency || 'INR',
            name: name,
            description: description,
            order_id: order_id,
            prefill: {
                name: prefill.name || '',
                email: prefill.email || '',
                contact: prefill.contact || '',
            },
            theme: {
                color: '#28a745', // Brand color
            },
        };

        const data = await RazorpayCheckout.open(options);
        console.log('[Razorpay] Payment Success (Client):', data);

        // 3. Verify Payment
        // data contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
        const verifyPayload = {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
        };

        // Note: You might want to show a "Verifying..." spinner here if UI allows, 
        // but since this is a helper function, we just await.

        try {
            const verifyResponse = await userAPI.verifyRechargePayment(verifyPayload);
            console.log('[Razorpay] Verification Success:', verifyResponse);

            if (onSuccess) {
                onSuccess({
                    ...data,
                    verifyResponse: verifyResponse
                });
            }
        } catch (verifyError) {
            console.error('[Razorpay] Verification Failed:', verifyError);
            // Even if client payment succeeded, verification failed. 
            // Usually we treat this as error or "pending" state.
            if (onError) {
                onError({
                    message: 'Payment verification failed',
                    details: verifyError
                });
            }
        }

    } catch (error) {
        console.log('[Razorpay] Error:', error);

        // Handle Razorpay cancellation or API errors
        if (onError) {
            onError(error);
        }
    }
};

export default initiateRazorpayPayment;
