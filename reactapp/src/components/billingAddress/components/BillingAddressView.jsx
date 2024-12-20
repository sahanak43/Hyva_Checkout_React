import React, { useState, useEffect } from 'react';

import { CreateNewAddressLink } from '../../address';
import BillingAddressOthers from './BillingAddressOthers';
import BillingAddressSelected from './BillingAddressSelected';
import { CART_BILLING_ADDRESS } from '../utility';
import { isCartAddressValid } from '../../../utils/address';
import { computeCanHideOtherAddressSection } from '../../address/utility';
import useBillingAddressAppContext from '../hooks/useBillingAddressAppContext';
import useBillingAddressCartContext from '../hooks/useBillingAddressCartContext';
import useBillingAddressFormikContext from '../hooks/useBillingAddressFormikContext';

function BillingAddressView() {
  const {
    editMode,
    selectedAddress,
    setIsNewAddress,
    setBackupAddress,
    setFormToEditMode,
    setSelectedAddress,
    customerAddressSelected,
    setCustomerAddressSelected,
    resetBillingAddressFormFields,
  } = useBillingAddressFormikContext();
  const { cartBillingAddress } = useBillingAddressCartContext();
  const { isLoggedIn, customerAddressList } = useBillingAddressAppContext();
  const isCartBillingAddressValid = isCartAddressValid(cartBillingAddress);
  // hide other section if there exists only one address for use.
  const hideOtherAddrSection = computeCanHideOtherAddressSection(
    isLoggedIn,
    selectedAddress,
    cartBillingAddress,
    customerAddressList
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('isBillingModalOpen', JSON.stringify(isModalOpen));
    const event = new CustomEvent('modalToggleBilling', {
      detail: isModalOpen,
    });
    window.dispatchEvent(event);
  }, [isModalOpen]);

  const newAddressClickHandler = () => {
    setIsNewAddress(true);
    setBackupAddress({ ...cartBillingAddress, id: selectedAddress });
    setSelectedAddress(CART_BILLING_ADDRESS);
    setCustomerAddressSelected(false);
    resetBillingAddressFormFields();
    setFormToEditMode();
    setIsModalOpen(true);
    const event = new CustomEvent('modalToggleBilling', {
      detail: true, // Ensure detail matches the new state
    });
    window.dispatchEvent(event);
  };

  if (editMode) {
    return null;
  }

  return (
    <div className="py-2">
      <div className="mt-5">
        <div className="my-2 space-y-2 lg:flex flex-col lg:items-start lg:space-x-4 lg:space-y-0 lg:justify-center">
          {isCartBillingAddressValid && (
            <div
              className={
                !isLoggedIn || hideOtherAddrSection ? 'w-full' : 'w-full'
              }
            >
              <BillingAddressSelected />
              {/* <CreateNewAddressLink
                forceHide={!customerAddressSelected}
                actions={{ click: newAddressClickHandler }}
              /> */}
            </div>
          )}
          {!isCartBillingAddressValid ? (
            <div className="w-4/5">
              <BillingAddressOthers forceHide={hideOtherAddrSection} />
              <CreateNewAddressLink
                actions={{ click: newAddressClickHandler }}
              />
            </div>
          ) : (
            <div className="w-full">
              <BillingAddressOthers forceHide={hideOtherAddrSection} />
              <CreateNewAddressLink
                forceHide={!customerAddressSelected}
                actions={{ click: newAddressClickHandler }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillingAddressView;
