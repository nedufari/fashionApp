export const PaymentConfig ={
    flutterwave: {
        publicKey :process.env.FLUTTERWAVE_PUBLIC_KEY,
        secretKey :process.env.FLUTTERWAVE_SECRET_KEY,
    },

    paystack:{
        publicKey :process.env.PAYSTACK_PUBLIC_SECRET,
        secretKey :process.env.PAYSTACK_TEST_SECRET,

    }
}