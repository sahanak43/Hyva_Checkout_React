import React, { useEffect, useState } from 'react';

import Login from '../login';
import Totals from '../totals';
import CartItemsForm from '../items';
import PlaceOrder from '../placeOrder';
import Message from '../common/Message';
import PageLoader from '../common/Loader';
import { AddressWrapper } from '../address';
import PaymentMethod from '../paymentMethod';
import BillingAddress from '../billingAddress';
import ShippingAddress from '../shippingAddress';
import ShippingMethodsForm from '../shippingMethod';
import StickyRightSidebar from '../StickyRightSidebar';
import CheckoutAgreements from '../checkoutAgreements';
import { config } from '../../config';
import { aggregatedQueryRequest } from '../../api';
import LocalStorage from '../../utils/localStorage';
import useCheckoutFormContext from '../../hook/useCheckoutFormContext';
import useCartContext from '../../hook/useCartContext';
import useCheckoutFormAppContext from './hooks/useCheckoutFormAppContext';
import useCheckoutFormCartContext from './hooks/useCheckoutFormCartContext';

function CheckoutForm() {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const { storeAggregatedFormStates } = useCheckoutFormContext();
  const { orderId, isVirtualCart, storeAggregatedCartStates } =
    useCheckoutFormCartContext();
  const { pageLoader, appDispatch, setPageLoader, storeAggregatedAppStates } =
    useCheckoutFormAppContext();
  const {
    cart: {
      selected_payment_method: { code },
    },
  } = useCartContext();

  function loadTabbyCardScript() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('tabby_card_script')) {
        resolve(); // Resolve if the script is already loaded
        return; // Exit early
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.tabby.ai/tabby-card.js';
      script.id = 'tabby_card_script';
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error(`Failed to load script: ${script.src}`));

      document.head.appendChild(script);
    });
  }
  function loadTabbyPopupScript() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('tabby_popup_script')) {
        resolve(); // Resolve if the script is already loaded
        return; // Exit early
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.tabby.ai/tabby-promo.js';
      script.id = 'tabby_popup_script';
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error(`Failed to load script: ${script.src}`));

      document.head.appendChild(script);
    });
  }
  loadTabbyPopupScript();
  loadTabbyCardScript();

  function TamaraWidget() {
    /* eslint-disable camelcase */
    const element = document.getElementById('react-checkout');
    const configData = JSON.parse(element.getAttribute('data-checkout_config'));
    const {
      payment: {
        tamara: { public_key = '', language = '', country_code = '' } = {},
      } = {},
    } = configData || {};
    window.tamaraWidgetConfig = {
      lang: language || '',
      country: country_code || '',
      publicKey: public_key || '',
    };
    const script = document.createElement('script');
    script.src = 'https://cdn-sandbox.tamara.co/widget-v2/tamara-widget.js';

    script.id = 'tamara_widget_script';
    script.async = true;
    document.head.appendChild(script);
  }
  TamaraWidget();

  useEffect(() => {
    if (code === 'tamara_pay_by_instalments_4') {
      TamaraWidget();
    }
    TamaraWidget();
  }, []);

  /**
   * Collect App, Cart data when the page loads.
   */
  useEffect(() => {
    if (isRequestSent) {
      return;
    }

    if (!LocalStorage.getCartId()) {
      LocalStorage.saveCartId(config.cartId);
    }
    (async () => {
      try {
        setPageLoader(true);
        setIsRequestSent(true);
        const data = await aggregatedQueryRequest(appDispatch);
        storeAggregatedCartStates(data);
        storeAggregatedAppStates(data);
        storeAggregatedFormStates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setPageLoader(false);
      }
    })();
  }, [
    appDispatch,
    isRequestSent,
    setPageLoader,
    storeAggregatedAppStates,
    storeAggregatedCartStates,
    storeAggregatedFormStates,
  ]);

  if (orderId && config.isDevelopmentMode) {
    return (
      <div className="flex flex-col items-center justify-center mx-10 my-10">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="flex flex-col items-center justify-center mt-4 space-y-3">
          <div>Your order is placed.</div>
          <div>{`Order Number: #${orderId}`}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Message />
      <div className="flex justify-center">
        <div className="max-w-[1260px] w-full pl-2 pr-2">
          <div className="flex flex-col my-6 space-y-2 md:flex-row md:space-y-0">
            <div className="w-full lg:w-3/5 md:mr-2">
              <div className="w-full space-y-2 xl:max-w-full">
                <Login />
                <AddressWrapper>
                  {!isVirtualCart && <ShippingMethodsForm />}
                  {!isVirtualCart && <ShippingAddress />}
                  <BillingAddress />
                </AddressWrapper>
                <PaymentMethod />
              </div>
            </div>
            <StickyRightSidebar>
              <CartItemsForm />
              <Totals />
              <CheckoutAgreements />
              <PlaceOrder />
            </StickyRightSidebar>
          </div>
          {pageLoader && <PageLoader />}
        </div>
      </div>
    </>
  );
}

export default CheckoutForm;
