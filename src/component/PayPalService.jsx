// PayPal service
export const loadPayPalScript = (callback) => {
  if (document.querySelector('script[src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"]')) {
    if (callback) callback();
    return;
  }

  const paypalScript = document.createElement('script');
  paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
  paypalScript.async = true;
  paypalScript.onload = () => {
    if (callback) callback();
  };
  document.body.appendChild(paypalScript);
  
  return paypalScript;
};

export const renderPayPalButtons = (containerRef, amount, onSuccess, onError) => {
  if (!window.paypal || !containerRef.current) {
    console.error('PayPal SDK not loaded or container not found');
    return false;
  }

  // Clear previous buttons if any
  while (containerRef.current.firstChild) {
    containerRef.current.removeChild(containerRef.current.firstChild);
  }
  
  window.paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: parseFloat(amount).toFixed(2),
            currency_code: 'USD'
          }
        }]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        console.log('PayPal Transaction completed by ' + details.payer.name.given_name);
        // Process the order
        if (onSuccess) onSuccess(details);
      });
    },
    onError: (err) => {
      console.error('PayPal Error:', err);
      if (onError) onError('PayPal payment failed. Please try another method.');
    }
  }).render(containerRef.current);
  
  return true;
}; 