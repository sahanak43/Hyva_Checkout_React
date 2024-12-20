/* eslint-disable */

import React from 'react';
import { bool } from 'prop-types';
import Button from '../../../common/Button';
import {
  isCartAddressValid,
  isValidCustomerAddressId,
} from '../../../../utils/address';
import { __ } from '../../../../i18n';
import { _toString } from '../../../../utils';
import LocalStorage from '../../../../utils/localStorage';
import useShippingAddressCartContext from '../../hooks/useShippingAddressCartContext';
import useShippingAddressFormikContext from '../../hooks/useShippingAddressFormikContext';

function CancelButton({ cross }) {
  const {
    backupAddress,
    setFormToViewMode,
    setSelectedAddress,
    setCustomerAddressSelected,
    setShippingAddressFormFields,
  } = useShippingAddressFormikContext();
  const { cartShippingAddress } = useShippingAddressCartContext();

  const clickHandler = () => {
    setShippingAddressFormFields({ ...backupAddress });
    setFormToViewMode();
    setCustomerAddressSelected(
      isValidCustomerAddressId(LocalStorage.getCustomerShippingAddressId())
    );

    if (backupAddress.id) {
      setSelectedAddress(_toString(backupAddress.id));
    }
    const event = new CustomEvent('modalToggleShipping', {
      detail: false, // Ensure detail matches the new state
    });
    window.dispatchEvent(event);
  };
  if (!isCartAddressValid(cartShippingAddress)) {
    return null;
  }

  return (
    <div>
      {cross ? (
        <div onClick={clickHandler}> &times;</div>
      ) : (
        <Button click={clickHandler} variant="primary" className="h-40px">
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
