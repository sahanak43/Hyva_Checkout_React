import { placeOrderAppleRequest, getValidateMerchantRequest } from '../..';

const history = window.location;

const placeOrder = async (cartId, payment, appDispatch) => {
  try {
    console.log(payment, 'payment >>>>');
    const response = await placeOrderAppleRequest(appDispatch, {
      cart_id: cartId,
      version: payment.token.paymentData.version || '',
      signature: payment.token.paymentData.signature || '',
      data: payment.token.paymentData.data || '',
      publicKeyHash: payment.token.paymentData.header.publicKeyHash || '',
      ephemeralPublicKey:
        payment.token.paymentData.header.ephemeralPublicKey || '',
      transactionId: payment.token.paymentData.header.transactionId || '',
      displayName: payment.token.paymentMethod.displayName || '',
      network: payment.token.paymentMethod.network || '',
      type: payment.token.paymentMethod.type || '',
      transactionIdentifier: payment.token.transactionIdentifier || '',
    });
    console.log('APPLE PAY: sendApplePaymentRequest cartId', cartId);
    console.log('APPLE PAY: sendApplePaymentRequest cardToken', payment);
    console.log('APPLE PAY: sendApplePaymentRequest response', response);
    const {
      data: {
        createCheckoutComCardApplePayPlaceOrder: {
          success,
          message,
          order: { number },
        },
      },
    } = response;

    if (!success) {
      if (number !== null) {
        window.location.replace('/checkout/onepage/failure');
        return number;
      }
      throw message;
    }
    return number;
  } catch (e) {
    console.error('APPLEPAYERR=>', e);
    alert(e.message || e);
    return false;
  }
};

const onApplePayButtonClicked = async (cart, appDispatch) => {
  let orderId = null;
  return new Promise((resolve, reject) => {
    const { ApplePaySession } = window;
    if (!ApplePaySession) {
      reject(new Error('Apple pay session not found'));
    }
    console.log(cart, 'cartdata');

    // const cart = reduxStore.getState().marinaCart?.cart;
    const countryCode = cart?.billing_address?.country;
    const currencyCode = cart?.prices?.grandTotalWithCurrency?.currency;
    const grandTotal = cart?.prices?.grandTotalWithCurrency?.value.toFixed(2);

    console.log(grandTotal, appDispatch);
    getValidateMerchantRequest(appDispatch);
    console.log(currencyCode, grandTotal, countryCode);

    const totalData = {
      label: `${currencyCode}${grandTotal} with Apple`,
      type: 'final',
      amount: grandTotal,
    };

    // Define ApplePayPaymentRequest
    const request = {
      countryCode,
      currencyCode,
      merchantCapabilities: ['supports3DS'],
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      total: totalData,
    };

    console.log('APPLE PAY: request', request);

    // Create ApplePaySession
    const session = new ApplePaySession(3, request);

    console.log('APPLE PAY: session', session);

    session.onvalidatemerchant = async () => {
      // Call your own server to request a new merchant session.
      const merchantSession = await getValidateMerchantRequest(appDispatch);
      console.log('APPLE PAY: merchantSession', merchantSession);
      session.completeMerchantValidation(merchantSession);
      console.log('APPLE PAY: merchantSession after', merchantSession);
    };

    session.onpaymentmethodselected = (event) => {
      console.log('APPLE PAY: onpaymentmethodselected', event); // Define ApplePayPaymentMethodUpdate based on the selected payment method.
      // No updates or errors are needed, pass an empty object.
      const update = {
        newTotal: totalData,
      };
      session.completePaymentMethodSelection(update);
      console.log('APPLE PAY: onpaymentmethodselected after', event);
    };

    session.onshippingmethodselected = (event) => {
      console.log('APPLE PAY: onshippingmethodselected', event);
      // Define ApplePayShippingMethodUpdate based on the selected shipping method.
      // No updates or errors are needed, pass an empty object.
      const update = {};
      session.completeShippingMethodSelection(update);
      console.log('APPLE PAY: onshippingmethodselected after', event);
    };

    session.onshippingcontactselected = (event) => {
      console.log('APPLE PAY: onshippingcontactselected', event);
      // Define ApplePayShippingContactUpdate based on the selected shipping contact.
      const update = {};
      session.completeShippingContactSelection(update);
      console.log('APPLE PAY: onshippingcontactselected after', event);
    };

    session.oncouponcodechanged = (event) => {
      console.log('APPLE PAY: oncouponcodechanged', event);
      // Define ApplePayCouponCodeUpdate
      const update = {};
      session.completeCouponCodeChange(update);
      console.log('APPLE PAY: oncouponcodechanged after', event);
    };

    session.onpaymentauthorized = async (event) => {
      // Make API call

      const { STATUS_SUCCESS, STATUS_FAILURE } = ApplePaySession;
      console.log('APPLE PAY: onpaymentauthorized', event);
      orderId = await placeOrder(cart?.id, event?.payment, appDispatch);
      const result = {
        status: orderId ? STATUS_SUCCESS : STATUS_FAILURE,
      };
      session.completePayment(result);
      console.log('APPLE PAY: onpaymentauthorized after', event);
      if (orderId) {
        history.replace('/checkout/onepage/success');
      }
      resolve();
    };

    session.oncancel = (event) => {
      console.log('APPLE PAY: oncancel', event);
      if (orderId !== null) {
        history.replace('/checkout/onepage/failure');
      }
      reject(event);
    };

    session.begin();
  });
};

export default async ({ cart, appDispatch }) => {
  console.log(cart, '>>>');
  try {
    console.log('APPLE PAY: apple pay button clicked');
    // await addApplePayButtonScript();
    console.log('APPLE PAY: button script added');
    await onApplePayButtonClicked(cart, appDispatch);
    console.log('APPLE PAY: done');
  } catch (e) {
    console.error(e);
  }
};
