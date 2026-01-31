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
    amount,
    name = 'Conto-Z Bet',
    description = 'Add Money to Wallet',
    prefill = {},
    onSuccess,
    onError,
}) => {
    let order_id = null; // Store order_id for failure reporting

    try {
        console.log('[Razorpay] Initiating Recharge:', amount);

        // 1. Create Order
        const orderResponse = await userAPI.createRechargeOrder({ amount });
        console.log('[Razorpay] Order Created:', orderResponse);

        if (orderResponse?.status !== 201 || !orderResponse?.order) {
            throw new Error(orderResponse?.message || 'Failed to create order');
        }

        const { id, amount: order_amount, key, currency } = orderResponse.order;
        order_id = id;

        // 2. Open Checkout
        const options = {
            key: key || RAZORPAY_CONFIG.KEY_ID,
            amount: order_amount,
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
                color: '#28a745',
            },
        };

        const data = await RazorpayCheckout.open(options);
        console.log('[Razorpay] Payment Success (Client):', data);

        // 3. Verify Payment
        const verifyPayload = {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
        };

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
            if (onError) onError({ message: 'Payment verification failed', details: verifyError });
        }

    } catch (error) {
        console.log('[Razorpay] Error:', error);

        // Report Failure to Backend if order_id exists
        if (order_id) {
            try {
                const reason = error.description || error.reason || error.message || 'Payment Terminated';
                // User requested format: payment_status: 'failed', reason: ...
                // Sending to same verify endpoint or update endpoint? User said "read one api to confim payment". 
                // Assuming verifyRechargePayment handles this or we just send it.
                // However, usually verify requires signature. If failed, no signature.
                // But user insisted "agar payment failed a jaye to dena".
                await userAPI.verifyRechargePayment({
                    razorpay_order_id: order_id,
                    payment_status: 'failed',
                    reason: reason
                });
                console.log('[Razorpay] Failure reported to backend');
            } catch (reportError) {
                console.log('[Razorpay] Failed to report failure:', reportError);
            }
        }

        if (onError) {
            onError(error);
        }
    }
};

export default initiateRazorpayPayment;
