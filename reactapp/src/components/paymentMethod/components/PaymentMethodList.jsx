import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import { get as _get } from 'lodash-es';

import RadioInput from '../../common/Form/RadioInput';
import { __ } from '../../../i18n';
import TextInput from '../../common/Form/TextInput';

import { classNames, _objToArray } from '../../../utils';
import usePaymentMethodCartContext from '../hooks/usePaymentMethodCartContext';
import usePaymentMethodFormContext from '../hooks/usePaymentMethodFormContext';
import usePaymentMethodAppContext from '../hooks/usePaymentMethodAppContext';
import StoreCredit from '../../storeCredit/StoreCredit';
import useCartContext from '../../../hook/useCartContext';
import useTotalsCartContext from '../../totals/hooks/useTotalsCartContext';
import {
  MasterCardIcon,
  TabbyIcon,
  VisaIcon,
  TamaraIcon,
  JcbIcon,
  AmexIcon,
  DinersIcon,
  MaestroIcon,
  DiscoverIcon,
  CardNumberIcon,
  ExpiryDateIcon,
  CvvIcon,
  TabbyMarkIcon,
} from '../../assests';

const cardTypes = {
  Visa: /^4\d{0,15}$/,
  Mastercard: /^(5[1-5]\d{0,15})$/,
  AmericanExpress: /^(34|37)\d{0,14}$/,
  Discover: /^(6011\d{0,15}|622[1-9]\d{0,12}|64[4-9]\d{0,13}|65\d{0,15})$/,
  DinersClub: /^(300|301|302|303|304|305|36|38)\d{0,13}$/,
  JCB: /^(352[8-9]|353[0-9]|354[0-9]|355[0-9]|356[0-9]|357[0-9]|358[0-9])\d{0,15}$/,
  Maestro: /^(5018|5020|5038|6304|6759|6761|6762)\d{0,12}$/,
};

const cardIcons = {
  Visa: () => (
    <VisaIcon className="absolute !right-0 top-[50%] transform -translate-y-1/2 w-7 h-7 justify-center mx-[8px] bottom-0" />
  ),
  Mastercard: () => (
    <MasterCardIcon className="absolute !right-0 top-[50%] transform -translate-y-1/2 w-7 h-7 justify-center mx-[8px] bottom-0" />
  ),
  AmericanExpress: () => (
    <AmexIcon className="absolute !right-0 top-[50%] transform -translate-y-1/2 w-7 h-7 justify-center mx-[8px] bottom-0" />
  ),
  Discover: () => (
    <DiscoverIcon className="absolute !right-0 top-[50%] transform -translate-y-1/2 w-7 h-7 justify-center mx-[8px] bottom-0" />
  ),
  Maestro: () => (
    <MaestroIcon className="absolute !right-0 top-[50%] transform -translate-y-1/2 w-7 h-7 justify-center mx-[8px] bottom-0" />
  ),
  JCB: () => (
    <JcbIcon className="absolute !right-0 top-[50%] transform -translate-y-1/2 w-7 h-7 justify-center mx-[8px] bottom-0" />
  ),
  DinersClub: () => (
    <DinersIcon className="absolute !right-0 top-[50%] transform -translate-y-1/2 w-7 h-7 justify-center mx-[8px] bottom-0" />
  ),
};

/* eslint-disable react/prop-types */
/* eslint-disable no-new, no-undef, object-shorthand */
function Tabby(props) {
  const element = document.getElementById('react-checkout');
  const configData = JSON.parse(element.getAttribute('data-checkout_config'));
  const {
    payment: { tabby_checkout: { config: { apiKey = '' } = {} } = {} } = {},
  } = configData || {};
  const { price, currency } = props;
  const path = window.location.pathname;
  const regex = /^\/ar-/;
  const lang = regex.test(path) ? 'ar' : 'en';

  useEffect(() => {
    const initializeTabbyPromo = () => {
      new TabbyPromo({
        selector: '#TabbyPromo',
        currency: currency,
        price: price,
        installmentsCount: 4,
        lang,
        publicKey: apiKey,
        merchantCode: 'en',
        size: 'medium',
        theme: 'default',
        header: false,
      });
    };

    const initializeTabbyCard = () => {
      new TabbyCard({
        selector: '#TabbyCard',
        currency: currency,
        price: price,
        installmentsCount: 4,
        lang,
        size: 'wide',
        theme: 'default',
        source: 'product',
        publicKey: apiKey,
        merchantCode: 'en',
      });
    };

    if (
      typeof window.TabbyPromo === 'function' &&
      typeof window.TabbyCard === 'function'
    ) {
      initializeTabbyCard();
      initializeTabbyPromo();
    }
  }, [price, currency, lang]);

  return <div id="TabbyPromo" className="hidden" />;
}

function TamaraWidget({ price, code }) {
  if (code !== 'tamara_pay_by_instalments_4' || price === 0) {
    return null;
  }
  return (
    <div className="mt-[20px]">
      <tamara-widget type="tamara-summary" amount={price} inline-type="3" />{' '}
    </div>
  );
}

function PaymentMethodList({ methodRenderers }) {
  const { fields, submitHandler, formikData, handleKeyDown, initialValues } =
    usePaymentMethodFormContext();
  const { methodList, isVirtualCart, doCartContainShippingAddress } =
    usePaymentMethodCartContext();
  const { isLoggedIn } = usePaymentMethodAppContext();
  const { code } = initialValues;
  const { paymentValues, setFieldValue, setFieldTouched } = formikData;
  const [showCreditDebitForm, setShowCreditDebitForm] = useState(
    code === 'checkoutcom_card_payment' || false
  );
  const {
    cart: {
      selected_payment_method: { code: selectedCode },
    },
  } = useCartContext();
  const [paymentMethod, setPaymentMethod] = useState(code || selectedCode);
  const [cardIcon, setCardIcon] = useState(null);
  const paymentAvailable = isVirtualCart || doCartContainShippingAddress;

  const { grandTotal, grandTotalWithCurrency } = useTotalsCartContext();
  const tabbyTamaraCurrency = grandTotalWithCurrency.currency;
  const str = grandTotal;
  const grandTotalNum = parseFloat(str.replace(/[^0-9.]/g, ''));
  const isMobile = window.innerWidth < 768;

  const getCardTypeAndIcon = (number) => {
    const trimmedNumber = number.replace(/\s/g, '');
    /* eslint-disable */
    const cardEntry = Object.entries(cardTypes).find(([cardType, regex]) =>
      regex.test(trimmedNumber)
    );

    if (cardEntry) {
      const [cardType] = cardEntry;
      return { type: cardType, icon: cardIcons[cardType] };
    }

    return { type: 'Unknown', icon: null };
  };

  const isSafari = () => {
    return (
      (!isMobile &&
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) ||
      (/iPhone/i.test(navigator.userAgent) &&
        !/iPhone.*CriOS/i.test(navigator.userAgent))
    );
  };

  useEffect(() => {
    if (code === 'checkoutcom_card_payment') {
      setShowCreditDebitForm(true);
    } else {
      setShowCreditDebitForm(false);
    }
  }, [code]);

  const handlePaymentMethodSelection = async (event) => {
    const methodSelected = _get(methodList, `${event.target.value}.code`);

    if (!methodSelected) {
      return;
    }

    setPaymentMethod(methodSelected);
    await setFieldValue(fields.code, methodSelected);
    setFieldTouched(fields.code, true);

    if (methodSelected === 'checkoutcom_card_payment') {
      setShowCreditDebitForm(true);
    } else {
      setShowCreditDebitForm(false);
      setFieldValue(fields.cardNumber, '');
      setFieldValue(fields.cvv, '');
      setFieldValue(fields.expiry, '');
    }

    /* eslint-disable camelcase */

    // don't need to save payment method in case the method opted has a custom
    // renderer. This is because custom payment renderers may have custom
    // functionalities associated with them. So if in case they want to perform
    // save payment operation upon selection, then they need to deal with it there.
    if (!methodRenderers[methodSelected]) {
      await submitHandler(methodSelected);
    }
  };

  const handleCardNumberChange = (event) => {
    let newValue = event.target.value.replace(/\D/g, '').replace(/\s/g, '');

    // Determine the card type and icon
    const { type, icon: IconComponent } = getCardTypeAndIcon(newValue);

    // Set the card icon based on the detected type
    setCardIcon(() => IconComponent);

    // Validate length and format based on card type
    if (type === 'AmericanExpress') {
      if (newValue.length > 15) {
        newValue = newValue.slice(0, 15);
      }
      newValue = newValue
        .replace(/(\d{4})(\d{0,6})(\d{0,5})/, '$1 $2 $3')
        .trim();
    } else if (type === 'DinersClub') {
      if (newValue.length > 14) {
        newValue = newValue.slice(0, 14);
      }
      newValue = newValue
        .replace(/(\d{4})(\d{0,6})(\d{0,4})/, '$1 $2 $3')
        .trim();
    } else if (type === 'Maestro') {
      if (newValue.length > 12) {
        newValue = newValue.slice(0, 12);
      }
      newValue = newValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    } else {
      if (newValue.length > 16) {
        newValue = newValue.slice(0, 16);
      }
      // Add spaces after every 4 digits
      newValue = newValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }

    setFieldTouched(fields.cardNumber, true);
    setFieldValue(fields.cardNumber, newValue);
  };

  const handleExpiryChange = (event) => {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }

    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    setFieldTouched(fields.expiry, true);
    setFieldValue(fields.expiry, value);
  };

  const handleCVVChange = (event) => {
    const cardNumber = formikData?.formSectionValues?.cardNumber;
    let newValue = event.target.value.replace(/\D/g, '');

    // Determine the card type and get its CVV length
    const { type } = getCardTypeAndIcon(cardNumber);

    const maxCVVLength = type === 'AmericanExpress' ? 4 : 3;

    // Limit CVV input to the max length
    if (newValue.length > maxCVVLength) {
      newValue = newValue.slice(0, maxCVVLength);
    }

    setFieldTouched(fields.cvv, true);
    setFieldValue(fields.cvv, newValue);
  };

  const methodListArray = _objToArray(methodList);
  let availableFreeStore = [];
  if (grandTotalNum === 0) {
    availableFreeStore = methodListArray.filter(
      (method) => method.code === 'free'
    );
  } else {
    availableFreeStore = methodListArray;
  }

  const handleTabby = () => {
    let tabbyContainer = document.querySelectorAll('#TabbyPromo > div > span');

    if (tabbyContainer.length) {
      let shRoot = tabbyContainer[0].shadowRoot;

      if (shRoot) {
        let firstDiv = shRoot.querySelector('div:first-child');

        if (firstDiv) {
          firstDiv.click();
        }
      }
    }
  };

  // useEffect(() => {
  //   if (
  //     grandTotalNum === 0 &&
  //     availableFreeStore.length === 1 &&
  //     availableFreeStore[0].code === 'free'
  //   ) {
  //     // Set the 'free' payment method as the selected one
  //     setFieldValue(fields.code, 'free');
  //   }
  // }, [grandTotalNum, availableFreeStore, setFieldValue, fields.code]);

  return (
    <div
      title={
        !paymentAvailable ? __('Please provide a shipping address first.') : ''
      }
      className={classNames(
        !paymentAvailable ? 'cursor-not-allowed opacity-40' : '',
        'pb-4 max-lg:border-b-[1px] max-lg:border-customGray-500'
      )}
    >
      <ul>
        {_objToArray(availableFreeStore).map((method) => {
          const MethodRenderer = methodRenderers[method.code];

          // If apple but has no valid apple-session available, then return null
          if (
            method.code === 'checkoutcom_apple_pay' &&
            !(
              window.ApplePaySession &&
              window.ApplePaySession?.canMakePayments()
            )
          ) {
            return null;
          }

          return (
            <li key={method.code}>
              {MethodRenderer ? (
                <MethodRenderer
                  method={method}
                  selected={paymentValues}
                  actions={{ change: handlePaymentMethodSelection }}
                />
              ) : (
                <>
                  <RadioInput
                    value={method.code}
                    label={
                      <div className="flex items-center">
                        {method.code === 'tamara_pay_by_instalments_4' && (
                          <TamaraIcon alt="Tamara" className=" pl-2" />
                        )}
                        {method.code === 'tabby_installments' && (
                          <TabbyIcon className="pl-2" alt="Tabby" />
                        )}
                        <span className="pl-[15px] text-[18px] text-darkerGrey font-gotham max-lg:text-[13px]">
                          {method.title}
                        </span>
                        {method?.code === 'tabby_installments' && (
                          <div
                            className="cursor-pointer pl-[5px]"
                            onClick={handleTabby}
                          >
                            <TabbyMarkIcon classname="h-[18px] w-[18px]" />
                          </div>
                        )}
                      </div>
                    }
                    name="paymentMethod"
                    disabled={!paymentAvailable}
                    onChange={handlePaymentMethodSelection}
                    checked={method.code === paymentValues?.code}
                  />
                  {method.code === 'checkoutcom_card_payment' &&
                    showCreditDebitForm && (
                      <div className="credit-debit-form mt-[20px] pl-[30px] max-lg:mt-[16px]">
                        <div className="mb-4 relative">
                          <CardNumberIcon className="pt-[8px] mx-[7px] absolute w-[26px] h-[40px] z-10" />
                          <TextInput
                            className="pl-[40px] rounded-[3px] w-full max-lg:text-[13px] z-0"
                            required
                            name={fields.cardNumber}
                            placeholder={__('Card number')}
                            formikData={formikData}
                            onKeyDown={handleKeyDown}
                            onChange={handleCardNumberChange}
                          />
                          {cardIcon &&
                            React.createElement(cardIcon, {
                              alt: 'Card type',
                            })}
                        </div>
                        <div className="flex">
                          <div className="mr-2 pr-[10px] pb-[16px] w-[50%]">
                            <ExpiryDateIcon className=" pt-[8px] mx-[7px] absolute w-[26px] h-[40px] z-10" />
                            <TextInput
                              className="pl-[40px] rounded-[3px] max-lg:text-[13px]"
                              type="text"
                              id="expiryDate"
                              name={fields.expiry}
                              placeholder="MM/YY"
                              formikData={formikData}
                              onKeyDown={handleKeyDown}
                              onChange={handleExpiryChange}
                            />
                          </div>
                          <div className="w-[50%]">
                            <CvvIcon className=" pt-[8px] mx-[7px] absolute w-[26px] h-[40px] z-10" />
                            <TextInput
                              type="text"
                              className="pl-[40px] rounded-[3px] max-lg:text-[13px]"
                              id="cvv"
                              name={fields.cvv}
                              placeholder="CVV"
                              formikData={formikData}
                              onKeyDown={handleKeyDown}
                              onChange={handleCVVChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {method?.code === 'tabby_installments' && (
                    <div
                      id="TabbyCard"
                      className={`${
                        paymentValues?.code !== 'tabby_installments'
                          ? 'hidden'
                          : ''
                      }`}
                    ></div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <Tabby price={grandTotalNum} currency={tabbyTamaraCurrency} />
      <div id="TabbyPromo" className="hidden" />
      <TamaraWidget price={grandTotalNum} code={paymentMethod} />

      {isLoggedIn && (
        <div className="pt-5 text-darkerGrey text-sm font-medium">
          <StoreCredit />
        </div>
      )}
    </div>
  );
}

PaymentMethodList.propTypes = {
  methodRenderers: object,
};

PaymentMethodList.defaultProps = {
  methodRenderers: {},
};

export default PaymentMethodList;
