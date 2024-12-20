/* eslint-disable */
import React, { useEffect, useState } from 'react';

import Checkbox from '../../common/Form/Checkbox';
import {
  isCartAddressValid,
  isValidCustomerAddressId,
  billingSameAsShippingField,
} from '../../../utils/address';
import { __ } from '../../../i18n';
import { BILLING_ADDR_FORM } from '../../../config';
import LocalStorage from '../../../utils/localStorage';
import useAddressWrapper from '../../address/hooks/useAddressWrapper';
import useShippingAddressAppContext from '../hooks/useShippingAddressAppContext';
import useShippingAddressCartContext from '../hooks/useShippingAddressCartContext';
import useShippingAddressFormikContext from '../hooks/useShippingAddressFormikContext';

function BillingSameAsShippingCheckbox() {
  const [isClickAndCollect, setIsClickAndCollect] = useState(false);

  const {
    cartBillingAddress,
    cartShippingAddress,
    setCartBillingAddress,
    setCustomerAddressAsBillingAddress,
  } = useShippingAddressCartContext();
  const {
    setFieldValue,
    isBillingSame,
    shippingValues,
    selectedAddress,
    isFormSectionValid,
  } = useShippingAddressFormikContext();
  const { isLoggedIn, setPageLoader, setErrorMessage, setSuccessMessage } =
    useShippingAddressAppContext();
  const { setBillingSelected, setIsBillingCustomerAddress } =
    useAddressWrapper();
    // for handling checking and unchecking of checkbox
  useEffect(() => {
    const handleModalToggle = (event) => {
      setIsClickAndCollect(event.detail);
    };

    window.addEventListener('isClicknCollectEvent', handleModalToggle);
    return () => {
      window.removeEventListener('isClicknCollectEvent', handleModalToggle);
    };
  }, []);
  
  useEffect(() => {
    // Automatically uncheck the checkbox and call onChange when isClickAndCollect is true
    if (isClickAndCollect && isBillingSame) {
      toggleBillingEqualsShippingState(); // Uncheck when isClickAndCollect is true
    }
    
    // Automatically check the checkbox when isClickAndCollect becomes false
    // if (!isClickAndCollect && !isBillingSame) {
    //   toggleBillingEqualsShippingState(); // Check when isClickAndCollect becomes false
    // }
    // if (!isClickAndCollect && !isBillingSame) {
    //   setTimeout(() => {
    //     toggleBillingEqualsShippingState(); // Check when isClickAndCollect becomes false
    //   }, 800); // 800ms delay
    // }

    
  }, [isClickAndCollect]);



  const makeBillingSameAsShippingRequest = async () => {
    const billingIsSame = true;
    const isCustomerAddress = isValidCustomerAddressId(selectedAddress);
    const successMessage = __('Billing address made same as shipping address');

    try {
      if (!isLoggedIn || (isLoggedIn && !isCustomerAddress)) {
        setPageLoader(true);
        await setCartBillingAddress({ ...shippingValues });
        setFieldValue(BILLING_ADDR_FORM, {
          ...shippingValues,
          isSameAsShipping: billingIsSame,
        });
        setSuccessMessage(successMessage);
      } else if (isLoggedIn && isCustomerAddress) {
        setPageLoader(true);
        await setCustomerAddressAsBillingAddress(
          selectedAddress,
          billingIsSame
        );
        setSuccessMessage(successMessage);
      }

      setBillingSelected(selectedAddress);
      setIsBillingCustomerAddress(isCustomerAddress);

      LocalStorage.saveCustomerAddressInfo(
        selectedAddress,
        billingIsSame,
        false
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(__('Billing address update failed. Please try again.'));
    } finally {
      setPageLoader(false);
    }
  };

  const toggleBillingEqualsShippingState = async () => {
    const newSameAsShipping = !isBillingSame;
    setFieldValue(billingSameAsShippingField, newSameAsShipping);
    LocalStorage.saveBillingSameAsShipping(newSameAsShipping);

    if (newSameAsShipping && isFormSectionValid) {
      await makeBillingSameAsShippingRequest();
    }
  };

  // if (
  //   !isCartAddressValid(cartShippingAddress) &&
  //   isCartAddressValid(cartBillingAddress)
  // ) {
  //   return null;
  // }

  return (
    <Checkbox
      isChecked={isBillingSame} // Uncheck if isClickAndCollect is true
      name={billingSameAsShippingField}
      onChange={toggleBillingEqualsShippingState}
      label={__('My billing and shipping address are the same')}
    />
  );
}

export default BillingSameAsShippingCheckbox;
