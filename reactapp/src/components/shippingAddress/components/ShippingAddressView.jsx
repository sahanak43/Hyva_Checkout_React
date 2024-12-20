import React, { useState, useEffect } from 'react';
import Modal from './modal';
import { CreateNewAddressLink } from '../../address';
import ShippingAddressOthers from './ShippingAddressOthers';
import ShippingAddressSelected from './ShippingAddressSelected';
import {
  isCartAddressValid,
  CART_SHIPPING_ADDRESS,
} from '../../../utils/address';
import { computeCanHideOtherAddressSection } from '../../address/utility';
import useShippingAddressAppContext from '../hooks/useShippingAddressAppContext';
import useShippingAddressCartContext from '../hooks/useShippingAddressCartContext';
import useShippingAddressFormikContext from '../hooks/useShippingAddressFormikContext';

function ShippingAddressView() {
  const {
    editMode,
    selectedAddress,
    setIsNewAddress,
    setBackupAddress,
    setFormToEditMode,
    setSelectedAddress,
    customerAddressSelected,
    setCustomerAddressSelected,
    resetShippingAddressFormFields,
  } = useShippingAddressFormikContext();
  const { cartShippingAddress } = useShippingAddressCartContext();
  const { isLoggedIn, customerAddressList } = useShippingAddressAppContext();
  const isCartShippingAddressValid = isCartAddressValid(cartShippingAddress);
  // hide other section if there exists only one address for use.
  const hideOtherAddrSection = computeCanHideOtherAddressSection(
    isLoggedIn,
    selectedAddress,
    cartShippingAddress,
    customerAddressList
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('isShippingModalOpen', JSON.stringify(isModalOpen));
    const event = new CustomEvent('modalToggleShipping', {
      detail: isModalOpen,
    });
    window.dispatchEvent(event);
  }, [isModalOpen]);

  const newAddressClickHandler = () => {
    setIsNewAddress(true);
    setBackupAddress({ ...cartShippingAddress, id: selectedAddress });
    setSelectedAddress(CART_SHIPPING_ADDRESS);
    setCustomerAddressSelected(false);
    resetShippingAddressFormFields();
    setFormToEditMode();
    setIsModalOpen(true);
    const event = new CustomEvent('modalToggleShipping', {
      detail: true, // Ensure detail matches the new state
    });
    window.dispatchEvent(event);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  if (editMode) {
    return null;
  }
  return (
    <div className="py-2">
      <div className="mt-5">
        <div className="my-2 space-y-2 lg:flex flex-col lg:items-start lg:space-x-4 lg:space-y-0 lg:justify-center">
          {isCartShippingAddressValid && (
            <div
              className={
                !isLoggedIn || hideOtherAddrSection ? 'w-full' : 'w-full'
              }
            >
              <ShippingAddressSelected />
              {/* <CreateNewAddressLink
                forceHide={!customerAddressSelected}
                actions={{ click: newAddressClickHandler }}
              /> */}
            </div>
          )}
          {!isCartShippingAddressValid ? (
            <div className="w-4/5">
              <ShippingAddressOthers forceHide={hideOtherAddrSection} />
              <CreateNewAddressLink
                actions={{ click: newAddressClickHandler }}
              />
            </div>
          ) : (
            <div className="w-full">
              <ShippingAddressOthers forceHide={hideOtherAddrSection} />
              <CreateNewAddressLink
                forceHide={!customerAddressSelected}
                actions={{ click: newAddressClickHandler }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="hidden">
        <Modal isOpen={isModalOpen} onClose={closeModalHandler}>
          <ShippingAddressSelected />
        </Modal>
      </div>
    </div>
  );
}

export default ShippingAddressView;
