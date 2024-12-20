/* eslint-disable */

import React from 'react';
import { bool } from 'prop-types';
import Button from '../../../common/Button';
import { __ } from '../../../../i18n';
import { _toString } from '../../../../utils';
import LocalStorage from '../../../../utils/localStorage';
import { isCartAddressValid } from '../../../../utils/address';
import useBillingAddressCartContext from '../../hooks/useBillingAddressCartContext';
import useBillingAddressFormikContext from '../../hooks/useBillingAddressFormikContext';

function CancelButton({ cross }) {
  const { cartBillingAddress } = useBillingAddressCartContext();
  const {
    backupAddress,
    setFormToViewMode,
    setSelectedAddress,
    setCustomerAddressSelected,
    setBillingAddressFormFields,
  } = useBillingAddressFormikContext();

  const clickHandler = () => {
    setBillingAddressFormFields({
      ...backupAddress,
      isSameAsShipping: LocalStorage.getBillingSameAsShippingInfo(),
    });
    setFormToViewMode();
    setCustomerAddressSelected(!!LocalStorage.getCustomerBillingAddressId());

    if (backupAddress?.id) {
      setSelectedAddress(_toString(backupAddress.id));
    }
    const event = new CustomEvent('modalToggleBilling', {
      detail: false, // Ensure detail matches the new state
    });
    window.dispatchEvent(event);
  };

  if (!isCartAddressValid(cartBillingAddress)) {
    return null;
  }

  return (
    <div>
      {cross ? (
        <div onClick={clickHandler}> &times;</div>
      ) : (
        <Button click={clickHandler} variant="primary">
          {__('Cancel')}
        </Button>
      )}
    </div>
  );
}

CancelButton.propTypes = {
  cross: bool, // Define the prop type
};

CancelButton.defaultProps = {
  cross: false, // Define the prop type
};

export default CancelButton;
