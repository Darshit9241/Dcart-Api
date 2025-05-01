// Google Pay constants
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

export const initializeGooglePay = (callback) => {
  if (!window.google || !window.google.payments) {
    console.error('Google Pay not available');
    return;
  }

  const client = new window.google.payments.api.PaymentsClient({
    environment: 'TEST' // Change to 'PRODUCTION' when going live
  });

  client.isReadyToPay(getGooglePaymentDataRequest())
    .then((response) => {
      if (response.result) {
        callback(client);
      } else {
        console.error('Google Pay is not available');
      }
    })
    .catch((err) => {
      console.error('Google Pay initialization error:', err);
    });
};

export const getGooglePaymentDataRequest = (totalPrice = '0') => {
  const paymentDataRequest = {
    ...baseRequest,
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'example', // Replace with your payment gateway
          gatewayMerchantId: 'exampleGatewayMerchantId' // Replace with your merchant ID
        }
      }
    }],
    merchantInfo: {
      merchantId: '12345678901234567890', // Replace with your merchant ID
      merchantName: 'Your Store Name'
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: totalPrice.toString(),
      currencyCode: 'USD',
      countryCode: 'US'
    }
  };

  return paymentDataRequest;
};

export const processGooglePayment = (paymentsClient, totalPrice, onSuccess, onError) => {
  if (!paymentsClient) {
    if (onError) onError('Google Pay is not available');
    return;
  }

  const paymentDataRequest = getGooglePaymentDataRequest(totalPrice);

  paymentsClient.loadPaymentData(paymentDataRequest)
    .then((paymentData) => {
      // Handle the payment success
      console.log('Payment Authorized:', paymentData);
      
      if (onSuccess) onSuccess(paymentData);
    })
    .catch((err) => {
      console.error('Error processing payment:', err);
      if (onError) onError('Payment failed. Please try again.');
    });
};

// Helper function to load Google Pay script
export const loadGooglePayScript = (callback) => {
  if (document.querySelector('script[src="https://pay.google.com/gp/p/js/pay.js"]')) {
    if (callback) callback();
    return;
  }
  
  const script = document.createElement('script');
  script.src = 'https://pay.google.com/gp/p/js/pay.js';
  script.async = true;
  script.onload = () => {
    if (callback) callback();
  };
  document.body.appendChild(script);
  
  return script;
}; 