import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'formik';
import { node } from 'prop-types';
import { string as YupString } from 'yup';

import { __ } from '../../../i18n';
import { PAYMENT_METHOD_FORM } from '../../../config';
import useFormSection from '../../../hook/useFormSection';
import { formikDataShape } from '../../../utils/propTypes';
import useCheckoutFormContext from '../../../hook/useCheckoutFormContext';
import PaymentMethodFormContext from '../context/PaymentMethodFormContext';
import usePaymentMethodAppContext from '../hooks/usePaymentMethodAppContext';
import usePaymentMethodCartContext from '../hooks/usePaymentMethodCartContext';
import { setcheckoutComPaymentAction } from '../../../context/Cart/checkoutComPaymentMethod/action';
import useEnterActionInForm from '../../../hook/useEnterActionInForm';

const defaultValues = {
  code: '',
  selectedMethod: '',
  cardNumber: '',
  cvv: '',
  expiry: '',
};

const cardTypes = {
  Visa: /^4\d{0,15}$/,
  Mastercard: /^(5[1-5]\d{0,15})$/,
  AmericanExpress: /^(34|37)\d{0,14}$/,
  Discover: /^(6011\d{0,15}|622[1-9]\d{0,12}|64[4-9]\d{0,13}|65\d{0,15})$/,
  DinersClub: /^(300|301|302|303|304|305|36|38)\d{0,13}$/,
  Maestro: /^(5018|5020|5038|6304|6759|6761|6762)\d{0,15}$/,
  JCB: /^(352[8-9]|353[0-9]|354[0-9]|355[0-9]|356[0-9]|357[0-9]|358[0-9])\d{0,15}$/,
};

const cardLengths = {
  Visa: 16,
  Mastercard: 16,
  AmericanExpress: 15,
  Discover: 16,
  DinersClub: 14,
  Maestro: 12,
  JCB: 16,
};
const getCardType = (number) => {
  const strippedValue = (number || '').replace(/\s/g, '');

  // Step 2: Match card number with card type
  return Object.keys(cardTypes).find((card) =>
    cardTypes[card].test(strippedValue)
  );
};

const luhnCheck = (value) => {
  let sum = 0;
  let shouldDouble = false;
  /* eslint-disable no-plusplus */

  for (let i = value.length - 1; i >= 0; i--) {
    const digit = parseInt(value.charAt(i), 10);

    if (shouldDouble) {
      if (digit * 2 > 9) {
        sum += digit * 2 - 9;
      } else {
        sum += digit * 2;
      }
    } else {
      sum += digit;
    }

    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};
const validateCardNumber = (number) => {
  // if (!number) return false;
  const strippedValue = number.replace(/\s/g, '');

  const cardType = getCardType(strippedValue);
  if (!cardType) {
    return false;
  }
  // console.trace(
  //   strippedValue.length,
  //   strippedValue,x`
  //   cardLengths[cardType],
  //   'strippedValue',
  //   number
  // );

  const expectedLength = cardLengths[cardType];
  const isLengthValid = strippedValue.length === expectedLength;
  const isTypeValid = cardTypes[cardType].test(strippedValue);

  // Additional Luhn check for valid card numbers
  const isLuhnValid = luhnCheck(strippedValue);

  if (cardType === 'AmericanExpress') {
    return isLengthValid;
  }

  if (cardType === 'DinersClub') {
    return isLengthValid;
  }

  if (cardType === 'Maestro') {
    return isLengthValid;
  }
  // return isLengthValid || (isLengthValid && isTypeValid); // Both length and type should be valid

  // Return true if the card number is of valid length, valid type, and passes Luhn check
  return isLengthValid && isTypeValid && isLuhnValid;
};

const requiredMessage = __('Required');
const initialValidationSchema = {
  code: YupString().required(requiredMessage),
  cardNumber: YupString()
    .required(requiredMessage)
    .test(
      'is-valid-card-number',
      'Please enter a valid card number',
      validateCardNumber
    ),
  cvv: YupString()
    .required('Please enter a valid CVV code')
    .test('is-valid-cvv', 'Please enter a valid CVV code', function (value) {
      const { cardNumber } = this.parent;
      const cardType = getCardType(cardNumber); // Function to determine card type

      if (cardType === 'AmericanExpress') {
        return /^\d{4}$/.test(value);
      }

      return /^\d{3}$/.test(value);
    }),

  expiry: YupString()
    .required(requiredMessage)
    .matches(/^\d{2}\/\d{2}$/, 'Please enter a valid expiry date')
    .test('expiryDate', 'Please enter a valid expiry date', (value) => {
      if (!value) return false;

      // Ensure the input is numeric and follows MM/YY format
      const [month, year] = value.split('/');
      if (Number.isNaN(Number(month)) || Number.isNaN(Number(year))) {
        return false;
      }

      const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
      const currentMonth = new Date().getMonth() + 1; // Current month (1-12)

      const expiryMonth = parseInt(month, 10);
      const expiryYear = parseInt(year, 10);

      // Check if the year is valid and if it's not in the past

      if (expiryMonth < 1 || expiryMonth > 12) {
        return false;
      }
      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        return false;
      }

      return true;
    }),
};

function PaymentMethodFormManager({ children, formikData }) {
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [validationSchema, setValidationSchema] = useState(
    initialValidationSchema
  );
  const { aggregatedData } = useCheckoutFormContext();
  const { setPaymentMethod } = usePaymentMethodCartContext();
  const { setMessage, setPageLoader, setErrorMessage } =
    usePaymentMethodAppContext();
  /**
   * This can be used to add additional validations for payment method
   */
  const updateValidationSchema = useCallback((validationSchemaToUpdate) => {
    setValidationSchema((oldValidationSchema) => ({
      ...oldValidationSchema,
      ...validationSchemaToUpdate,
    }));
  }, []);

  useEffect(() => {
    if (formikData?.paymentValues?.code === 'checkoutcom_card_payment') {
      setValidationSchema(initialValidationSchema);
    } else {
      setValidationSchema({ code: YupString().required(requiredMessage) });
    }
  }, [initialValues, formikData]);

  // const { code } = initialValues || '';
  // useEffect(() => {
  //   console.log(initialValues, code, '>>>');
  //   const isCardMethod = code === 'checkoutcom_card_payment';
  //   if (isCardMethod) {
  //     setValidationSchema(initialValidationSchema);
  //   }
  // }, [initialValues, code]);

  const formSubmit = async (paymentMethod) => {
    setMessage(false);

    if (!paymentMethod) {
      return;
    }

    try {
      setPageLoader(true);
      if (initialValues.selectedMethod === 'checkoutcom_card_payment') {
        await setcheckoutComPaymentAction(paymentMethod);
      } else {
        await setPaymentMethod(paymentMethod);
      }
      // setSuccessMessage(__('Payment method added successfully.'));
      setPageLoader(false);
    } catch (error) {
      setPageLoader(false);
      setErrorMessage(
        error.message ||
          __(
            'Something went wrong while adding the payment method to the quote.'
          )
      );
    }
  };
  const handleKeyDown = useEnterActionInForm({
    formikData,
    validationSchema,
    submitHandler: formSubmit,
  });

  const formContext = useFormSection({
    formikData,
    initialValues,
    validationSchema,
    id: PAYMENT_METHOD_FORM,
    submitHandler: formSubmit,
  });

  useEffect(() => {
    if (aggregatedData) {
      const paymentMethod = aggregatedData?.cart?.selected_payment_method || {};
      const { cardNumber, expiry, cvv } = formikData?.formSectionValues || {};
      setInitialValues((prevValues) => ({
        ...prevValues,
        code: paymentMethod.code || '',
        cardNumber: cardNumber || '',
        expiry: expiry || '',
        cvv: cvv || '',
      }));
    }
  }, [aggregatedData]);

  // useEffect(() => {
  //   const { cardNumber, expiry, cvv } = formikData?.formSectionValues || {};

  //   setInitialValues((prevValues) => ({
  //     ...prevValues,
  //     cardNumber: cardNumber || prevValues.cardNumber,
  //     expiry: expiry || prevValues.expiry,
  //     cvv: cvv || prevValues.cvv,
  //   }));
  // }, [formikData?.formSectionValues]);

  const context = useMemo(
    () => ({
      ...formContext,
      ...formikData,
      formikData,
      initialValues,
      validationSchema,
      setInitialValues,
      setValidationSchema,
      handleKeyDown,
      updateValidationSchema,
    }),
    [
      formikData,
      formContext,
      initialValues,
      validationSchema,
      updateValidationSchema,
    ]
  );

  return (
    <PaymentMethodFormContext.Provider value={context}>
      <Form id={PAYMENT_METHOD_FORM}>{children}</Form>
    </PaymentMethodFormContext.Provider>
  );
}

PaymentMethodFormManager.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default PaymentMethodFormManager;
