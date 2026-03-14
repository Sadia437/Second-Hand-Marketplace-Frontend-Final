import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import API from '../../utils/axiosConfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ booking }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const { productPrice, _id, productName } = booking;

   
    useEffect(() => {
        if (productPrice > 0) {
            API.post('/payments/create-payment-intent', { bookingId: _id })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("Payment Intent Error:", err);
                });
        }
    }, [productPrice, _id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card === null) return;

        setProcessing(true);

       
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            toast.error(error.message);
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: booking.userName || 'Anonymous',
                        email: booking.userEmail || 'unknown@mail.com'
                    },
                },
            },
        );

        if (confirmError) {
            toast.error(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === "succeeded") {
           
            const paymentInfo = {
                transactionId: paymentIntent.id,
                bookingId: _id,
                email: booking.userEmail
            };

            try {
                const res = await API.post('/payments/confirm', paymentInfo);
                if (res.data.success) {
                    toast.success(`Payment successful! ID: ${paymentIntent.id}`);
                    navigate('/dashboard/my-orders'); 
                }
            } catch (err) {
                toast.error("Failed to update booking status");
            }
        }
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="btn btn-primary w-full mt-4"
            >
                {processing ? 'Processing...' : `Pay ৳${productPrice}`}
            </button>
        </form>
    );
};

export default CheckoutForm;