/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Modal from './components/modal';
import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import ShippingAddressForm from './components/ShippingAddressForm';
import ShippingAddressView from './components/ShippingAddressView';
import ShippingAddressFormikProvider from './components/ShippingAddressFormikProvider';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import useShippingAddressAppContext from '../shippingAddress/hooks/useShippingAddressAppContext';
import useCartContext from '../../hook/useCartContext';
import BillingAddressForm from '../billingAddress/components/BillingAddressForm';
import BillingAddressView from '../billingAddress/components/BillingAddressView';

const ShippingAddressMemorized = React.memo(({ formikData }) => {
  const { isLoggedIn } = useShippingAddressAppContext();

  // const [isModalOpen, setIsModalOpen] = useState(
  //   JSON.parse(localStorage.getItem('isShippingModalOpen')) || false
  // );
  const { cart } = useCartContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClickAndCollect, setIsClickAndCollect] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    // Force a re-render when cart.shipping_address changes
    if (Object.keys(cart?.shipping_address).length === 0) {
      setForceRender(prev => prev + 1); // Trigger a re-render by updating the state
    }
  }, [cart?.shipping_address]);

  useEffect(() => {
    // Force a re-render when cart.shipping_address changes
    if (Object.keys(cart?.shipping_address).length === 0) {
      setForceRender(prev => prev + 1); // Trigger a re-render by updating the state
    }
  }, []);


  useEffect(() => {
    const handleModalToggle = (event) => {
      setIsModalOpen(event.detail);
    };

    window.addEventListener('modalToggleShipping', handleModalToggle);

    return () => {
      window.removeEventListener('modalToggleShipping', handleModalToggle);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isShippingModalOpen', JSON.stringify(isModalOpen));
  }, [isModalOpen]);

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  // for handling checking and unchecking of checkbox
  useEffect(() => {
    const handleCheck = (event) => {
      setIsClickAndCollect(event.detail);
    };

    window.addEventListener('isClicknCollectEvent', handleCheck);
    return () => {
      window.removeEventListener('isClicknCollectEvent', handleCheck);
    };
  }, []);

  return (
    <div key={forceRender}>{/* Add key to force re-render */}
    <ShippingAddressFormikProvider formikData={formikData}>
      <Card>
        <div className="max-lg:hidden">
          {!isClickAndCollect && (
            <div>
            <ToggleBox title={__('Shipping Address')} show>
              {isLoggedIn && cart?.shipping_address && Object.keys(cart.shipping_address).length ? (
                <Modal isOpen={isModalOpen} onClose={closeModalHandler}>
                  <h4 className="font-gotham text-2xl font-light border-b pb-4 border-customGray">
                    {__('Shipping Address')}
                  </h4>
                  <ShippingAddressForm />
                </Modal>
              ) : (
                <ShippingAddressForm />
              )}
              <ShippingAddressView />
            </ToggleBox>
            </div>
          )}
        </div>
        <div className="hidden max-lg:block">
          {!isClickAndCollect && (
            <div>
              <h4 className="font-gotham text-4 font-book">
                {__('Shipping Address')}
              </h4>
              {isLoggedIn && cart?.shipping_address && Object.keys(cart.shipping_address).length ? (
                <Modal isOpen={isModalOpen} onClose={closeModalHandler}>
                  <h4 className="font-gotham text-4 font-book">
                    {__('Shipping Address')}
                  </h4>
                  <ShippingAddressForm />
                </Modal>
              ) : (
                <div>
                  <ShippingAddressForm />
                </div>
              )}
              <ShippingAddressView />
            </div>
          )}
        </div>
        <div className="hidden">
          <ShippingAddressForm />
          <ShippingAddressView />
          {/* <BillingAddressForm /> */}
          {/* <BillingAddressView /> */}
        </div>
      </Card>
    </ShippingAddressFormikProvider>
    </div>
  );
});

ShippingAddressMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default ShippingAddressMemorized;
