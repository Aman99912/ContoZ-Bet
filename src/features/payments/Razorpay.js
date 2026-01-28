import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_CONFIG } from './razorpay.config';

/**
 * Razorpay Payment Integration Component
 * 
 * @param {Object} options - Payment options
 * @param {string} options.key - Razorpay API key (optional, uses env by default)
 * @param {number} options.amount - Amount in paise (e.g., 100 = ₹1)
 * @param {string} options.currency - Currency code (default: 'INR')
 * @param {string} options.name - Business/App name
 * @param {string} options.description - Payment description
 * @param {string} options.orderId - Order ID from backend
 * @param {Object} options.prefill - User prefill data
 * @param {string} options.prefill.name - User name
 * @param {string} options.prefill.email - User email
 * @param {string} options.prefill.contact - User contact number
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const initiateRazorpayPayment = ({
    key = RAZORPAY_CONFIG.KEY_ID, // Use env key by default
    amount,
    currency = 'INR',
    name = 'Conto-Z Bet',
    description = 'Add Money to Wallet',
    orderId,
    prefill = {},
    onSuccess,
    onError,
}) => {
    const options = {
        key: key, // Razorpay API Key
        amount: amount, // Amount in paise
        currency: currency,
        name: name,
        description: description,
        order_id: orderId, // Order ID from backend
        prefill: {
            name: prefill.name || '',
            email: prefill.email || '',
            contact: prefill.contact || '',
        },
        theme: {
            color: '#00FF00', // Primary green color
        },
    };

    RazorpayCheckout.open(options)
        .then((data) => {
            // Payment success
            if (onSuccess) {
                onSuccess({
                    paymentId: data.razorpay_payment_id,
                    orderId: data.razorpay_order_id,
                    signature: data.razorpay_signature,
                });
            }
        })
        .catch((error) => {
            // Payment failed or cancelled
            if (onError) {
                onError({
                    code: error.code,
                    description: error.description,
                    source: error.source,
                    step: error.step,
                    reason: error.reason,
                });
            }
        });
};

/**
 * Example Usage:
 * 
 * import { initiateRazorpayPayment } from '@/features/payments/Razorpay';
 * 
 * const handleAddMoney = () => {
 *     initiateRazorpayPayment({
 *         // key is optional, uses env variable by default
 *         amount: 50000, // ₹500 in paise
 *         orderId: 'order_xyz123', // Get from backend
 *         prefill: {
 *             name: 'John Doe',
 *             email: 'john@example.com',
 *             contact: '9876543210',
 *         },
 *         onSuccess: (response) => {
 *             console.log('Payment Success:', response);
 *             // Update wallet balance
 *             // Show success message
 *         },
 *         onError: (error) => {
 *             console.log('Payment Error:', error);
 *             // Show error message
 *         },
 *     });
 * };
 */

export default initiateRazorpayPayment;
