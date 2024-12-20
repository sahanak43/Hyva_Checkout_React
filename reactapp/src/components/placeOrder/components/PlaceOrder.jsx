/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { get as _get } from 'lodash-es';
import { useFormikContext } from 'formik';
import Button from '../../common/Button';
import {
  LOGIN_FORM,
  SHIPPING_METHOD,
  BILLING_ADDR_FORM,
  SHIPPING_ADDR_FORM,
  PAYMENT_METHOD_FORM,
} from '../../../config';
import {
  // hasLoginErrors,
  hasPaymentMethodErrors,
  hasBillingAddressErrors,
  hasShippingMethodErrors,
  hasShippingAddressErrors,
} from '../utility';
import { __ } from '../../../i18n';
import usePlaceOrder from '../hooks/usePlaceOrder';
import useAddressSave from '../hooks/useAddressSave';
import useEmailInfoSave from '../hooks/useEmailInfoSave';
import usePlaceOrderAppContext from '../hooks/usePlaceOrderAppContext';
import usePlaceOrderCartContext from '../hooks/usePlaceOrderCartContext';
import { focusOnFormErrorElement, scrollToElement } from '../../../utils/form';
import setTabbyPayment from '../../../api/cart/tabbyPlaceOrder';
import setTamaraPayment from '../../../api/cart/tamaraPlaceOrder';
import useCartContext from '../../../hook/useCartContext';
import ApplePayButton from './applePayButton';
// import setApplePayPayment from '../../../api/cart/applePayPlaceOrder/applePayPayment';
import useLoginCartContext from '../../login/hooks/useLoginCartContext';

const customerWantsToSignInField = `${LOGIN_FORM}.customerWantsToSignIn`;

function PlaceOrder() {
  const {
    cart: {
      selected_payment_method: { code },
      /* eslint-disable camelcase */
      // appliedStoreCredit,
      // selected_shipping_method: { carrierCode: SelectedShippingMethod } = {},
    } = {},
    setcheckoutComPayment,
    cart,
  } = useCartContext();
  // const { applied_balance } = appliedStoreCredit || '';

  // const { cart:{selected_shipping_method: }={} } = useShippingMethodCartContext();
  const { values, errors, setFieldValue } = useFormikContext();
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const saveEmailAddressInfo = useEmailInfoSave();
  const saveBillingShippingAddress = useAddressSave();
  const validateThenPlaceOrder = usePlaceOrder();
  const { isVirtualCart } = usePlaceOrderCartContext();
  const { setMessage, setErrorMessage, setPageLoader } =
    usePlaceOrderAppContext();
  const { setEmailOnGuestCart } = useLoginCartContext();
  const isPaymentMethodSelected = Boolean(code);
  const [hourSelected, setHourSelected] = useState(false);
  const [isClick, setIsClick] = useState(false);

  // const isStoreCreditAppliedPlaceOrder =
  //   applied_balance && applied_balance?.value > 0;
  useEffect(() => {
    // Add event listeners only after the first render
    const handleHourSelected = (event) => {
      setTimeout(() => setHourSelected(event.detail.selected), 100); // Small delay
    };

    const handleIsClickandCollect = (event) => {
      setTimeout(() => setIsClick(event.detail), 100); // Small delay
    };

    window.addEventListener('isHourSelected', handleHourSelected);
    window.addEventListener('isClicknCollectEvent', handleIsClickandCollect);

    return () => {
      window.removeEventListener('isHourSelected', handleHourSelected);
      window.removeEventListener(
        'isClicknCollectEvent',
        handleIsClickandCollect
      );
    };
  });

  const isCardDetailsValid = () => {
    if (code !== 'checkoutcom_card_payment') return true;

    const { payment_method: { cardNumber, expiry, cvv } = {} } = values;

    const isValidCardNumber = cardNumber;
    cardNumber.replace(/\s/g, '').length >= 13 &&
      cardNumber.replace(/\s/g, '').length <= 16;

    const isValidExpiry = expiry && /^\d{2}\/\d{2}$/.test(expiry);
    const isValidCvv = cvv && /^\d{3,4}$/.test(cvv);

    return isValidCardNumber && isValidExpiry && isValidCvv;
  };
  const { login: { email } = {} } = values;
  // const hourSelected = JSON.parse(window.localStorage.getItem('hourSelected'));

  const isButtonDisabled =
    !isPaymentMethodSelected ||
    (code === 'checkoutcom_card_payment' && !isCardDetailsValid()) ||
    isProcessing ||
    email === '' ||
    // hasShippingAddressErrors(errors) ||
    hasBillingAddressErrors(errors, values, isVirtualCart) ||
    hasShippingMethodErrors(errors) ||
    hasPaymentMethodErrors(errors) ||
    (isClick && hourSelected === false);
  // isClickAndCollect && !hourSelected;

  useEffect(() => {
    new Promise((resolve) => {
      const scriptId = 'apple_pay_button_script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.setAttribute(
          'src',
          'https://applepay.cdn-apple.com/jsapi/v1.1.0/apple-pay-sdk.js'
        );
        script.setAttribute('id', scriptId);
        document.head.appendChild(script);
        script.onload = () => {
          resolve();
        };
      } else {
        resolve();
      }
    });
  }, []);

  const handlePerformPlaceOrder = async () => {
    setMessage(false);
    setLoading(true);
    setIsProcessing(true);
    // if (hasLoginErrors(errors)) {
    //   const customerWantsToSignIn = _get(values, customerWantsToSignInField);

    //   setErrorMessage(
    //     __(
    //       customerWantsToSignIn
    //         ? 'Please provide your login details.'
    //         : 'Please provide your email address.'
    //     )
    //   );
    //   focusOnFormErrorElement(LOGIN_FORM, errors);
    //   return;
    // }

    // if (hasShippingAddressErrors(errors)) {
    //   setErrorMessage(__('Please provide your shipping address information.'));
    //   focusOnFormErrorElement(SHIPPING_ADDR_FORM, errors);
    //   return;
    // }

    if (hasBillingAddressErrors(errors, values, isVirtualCart)) {
      setErrorMessage(__('Please provide your billing address information.'));
      focusOnFormErrorElement(BILLING_ADDR_FORM, errors);
      return;
    }

    if (hasShippingMethodErrors(errors)) {
      setErrorMessage(__('Please select your shipping method.'));
      scrollToElement(SHIPPING_METHOD);
      return;
    }

    if (hasPaymentMethodErrors(errors)) {
      setErrorMessage(__('Please select your payment method.'));
      scrollToElement(PAYMENT_METHOD_FORM);
      return;
    }

    // if (isStoreCreditAppliedPlaceOrder) {
    //   console.log('inside credit');
    //   // await saveBillingShippingAddress(values);
    //   await validateThenPlaceOrder(values);
    // }

    try {
      setPageLoader(true);
      // if (code === 'checkoutcom_apple_pay') {
      //   try {
      //     const response = await setApplePayment(cart);
      //   } catch (error) {
      //     console.log('Apple pay error');
      //   }
      // }
      if (code === 'tamara_pay_by_instalments_4') {
        try {
          const response = await setTamaraPayment();
          if (response.data && response.data.createTamaraPlaceOrder) {
            const { redirect_url: redirectUrl } =
              response.data.createTamaraPlaceOrder;
            if (redirectUrl) {
              window.location.href = redirectUrl;
              return;
            }
          }
        } catch (error) {
          console.error('Failed to process Tamara payment:', error);
        }
      } else if (code === 'tabby_installments') {
        try {
          const response = await setTabbyPayment();
          if (response.data && response.data.placeOrderWithTabby) {
            const { redirect_url: redirectUrl } =
              response.data.placeOrderWithTabby;
            if (redirectUrl) {
              window.location.href = redirectUrl;
              setPageLoader(false);
              return;
            }
          }
        } catch (error) {
          console.error('Failed to process Tabby payment:', error);
        }
      }
      // else if (code === 'checkoutcom_apple_pay') {
      //   try {
      //     const response = await setApplePayPayment();
      //     if (
      //       response.data &&
      //       response.data.createCheckoutComCardApplePayPlaceOrder
      //     ) {
      //       const { redirect_url: redirectUrl } =
      //         response.data.createCheckoutComCardApplePayPlaceOrder;
      //       if (redirectUrl) {
      //         window.location.href = redirectUrl;
      //         setPageLoader(false);
      //         return;
      //       }
      //     }
      //   } catch (error) {
      //     console.error('Failed to process Appl payment:', error);
      //   }
      // }
      else if (code === 'checkoutcom_card_payment') {
        const {
          payment_method: { cardNumber, expiry, cvv },
        } = values;
        const sanitizedCardNumber = cardNumber.replace(/\s+/g, '');
        try {
          const response = await setcheckoutComPayment({
            cardNumber: sanitizedCardNumber,
            expiry,
            cvv,
          });
          if (response.data && response.data.createCheckoutComCardPlaceOrder) {
            const { redirect_url: redirectUrl } =
              response.data.createCheckoutComCardPlaceOrder;
            if (redirectUrl) {
              window.location.href = redirectUrl;
              return;
            }
          }
        } catch (error) {
          console.error('Failed to process Tabby payment:', error);
        }
      } else {
        await saveEmailAddressInfo(values);
        await saveBillingShippingAddress(values);
        await validateThenPlaceOrder(values);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoader(false);
      setLoading(false);
    }
  };

  const handleEmailAndPlaceOrder = () => {
    const customerWantsToSignIn = _get(values, customerWantsToSignInField);
    if (email !== '' && customerWantsToSignIn) {
      setFieldValue(`${LOGIN_FORM}.customerWantsToSignIn`, false);
      setEmailOnGuestCart(email);
    }
    setTimeout(() => {
      handlePerformPlaceOrder();
    }, 600);
  };

  return (
    <div className="flex items-center justify-center py-4 max-lg:fixed max-lg:w-full max-lg:bottom-0 max-lg:left-0 max-lg:px-5 max-lg:pb-5 max-lg:pt-4 max-lg:bg-white">
      {code === 'checkoutcom_apple_pay' ? (
        <ApplePayButton isButtonDisabled={isButtonDisabled} loading={loading} />
      ) : (
        <Button
          variant="primary"
          click={handleEmailAndPlaceOrder}
          disable={isButtonDisabled}
          className="bg-customOrange w-full justify-center mr-0 max-lg:h-[40px] max-lg:text-sm"
        >
          {loading ? __('Place Order') : __('Place Order')}
        </Button>
      )}
    </div>
  );
}

export default PlaceOrder;
