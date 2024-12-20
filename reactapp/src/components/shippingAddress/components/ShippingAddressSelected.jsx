import React from 'react';
import { get as _get } from 'lodash-es';

import { AddressCard } from '../../address';
import BillingSameAsShippingCheckbox from './BillingSameAsShippingCheckbox';
import {
  isCartAddressValid,
  formatAddressListToCardData,
} from '../../../utils/address';
import { selectedAddressTitle } from '../utility';
import useAppContext from '../../../hook/useAppContext';
import useCartContext from '../../../hook/useCartContext';
import useShippingAddressAppContext from '../hooks/useShippingAddressAppContext';
import useShippingAddressCartContext from '../hooks/useShippingAddressCartContext';
import useShippingAddressFormikContext from '../hooks/useShippingAddressFormikContext';

function ShippingAddressSelected() {
  const {
    shippingValues,
    selectedAddress,
    setBackupAddress,
    setFormToEditMode,
  } = useShippingAddressFormikContext();
  const { stateList, isLoggedIn, customerAddressList } =
    useShippingAddressAppContext();
  const { cartShippingAddress } = useShippingAddressCartContext();
  const { cart } = useCartContext();
  const { countryList } = useAppContext();
  const addressInfo = formatAddressListToCardData(
    [{ id: selectedAddress, ...cartShippingAddress }],
    stateList,
    cart,
    countryList
  );

  const performAddressEdit = () => {
    const customerAddress = _get(customerAddressList, selectedAddress);
    const addressToBackup = customerAddress || shippingValues;

    setBackupAddress({ ...addressToBackup });
    setFormToEditMode();
    const event = new CustomEvent('modalToggleShipping', {
      detail: true, // Ensure detail matches the new state
    });
    window.dispatchEvent(event);
  };

  if (!isCartAddressValid(cartShippingAddress)) {
    return null;
  }

  return (
    <AddressCard
      address={addressInfo[0]}
      actions={{ performAddressEdit }}
      title={selectedAddressTitle(isLoggedIn, customerAddressList)}
      billingSameCheckbox={
        <div className="flex items-center h-10 px-3 pb-4 mt-3 -mx-4 -mb-4">
          <BillingSameAsShippingCheckbox />
        </div>
      }
    />
  );
}

export default ShippingAddressSelected;
