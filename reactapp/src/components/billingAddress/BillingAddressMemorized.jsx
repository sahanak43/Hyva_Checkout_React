/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Modal from './components/Modalbilling';
import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import BillingAddressForm from './components/BillingAddressForm';
import BillingAddressView from './components/BillingAddressView';
import BillingAddressFormikProvider from './components/BillingAddressFormikProvider';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import useBillingAddressCartContext from './hooks/useBillingAddressCartContext';
import useBillingAddressAppContext from './hooks/useBillingAddressAppContext';
import useCartContext from '../../hook/useCartContext';

const BillingAddressMemorized = React.memo(({ formikData }) => {
  const { isBillingSame } = formikData;
  const { isVirtualCart } = useBillingAddressCartContext();
  const { isLoggedIn } = useBillingAddressAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cart } = useCartContext();
  const { cartselectedshippingmethod} = cart;
  const [isClickAndCollect, setIsClickAndCollect] = useState(false);

  useEffect(() => {
    const handleModalToggle = (event) => {
      setIsModalOpen(event.detail);
    };

    window.addEventListener('modalToggleBilling', handleModalToggle);

    return () => {
      window.removeEventListener('modalToggleBilling', handleModalToggle);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isBillingModalOpen', JSON.stringify(isModalOpen));
  }, [isModalOpen]);

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const handleModalToggle = (event) => {
      setIsClickAndCollect(event.detail);
    };

    window.addEventListener('isClicknCollectEvent', handleModalToggle);
    return () => {
      window.removeEventListener('isClicknCollectEvent', handleModalToggle);
    };
  }, []);

  return (
    <BillingAddressFormikProvider formikData={formikData}>
      {!isBillingSame || isVirtualCart || (cartselectedshippingmethod?.carrier_code === 'clickncollect' || isClickAndCollect)  ? (
        <Card>
          <div className="max-lg:hidden">
            <ToggleBox title={__('Billing Address')} show>
              {isLoggedIn && cart?.billing_address && Object.keys(cart.billing_address).length ? (
                <Modal isOpen={isModalOpen} onClose={closeModalHandler}>
                  <h4 className="font-gotham text-2xl font-light border-b pb-4 border-customGray">
                    {__('Billing Address')}
                  </h4>
                  <BillingAddressForm />
                </Modal>
              ) : (
                <BillingAddressForm />
              )}
              {/* has added beacuse on the inital load after unchecking the checkbox billing is not loading only if i relaod it , it is loading i am gonna applu same for billing */}
              {
                isLoggedIn && 

                <BillingAddressForm />

              }

              <BillingAddressView />
            </ToggleBox>
          </div>
          <div className="hidden max-lg:block">
            <h4 className="font-gotham text-4 font-book">
              {__('Billing Address')}
            </h4>
            {isLoggedIn && cart?.billing_address && Object.keys(cart.billing_address).length ? (
              <Modal isOpen={isModalOpen} onClose={closeModalHandler}>
                <h4 className="font-gotham text-4 font-book">
                  {__('Billing Address')}
                </h4>
                <BillingAddressForm />
              </Modal>
            ) : (
              <div>
                <BillingAddressForm />
              </div>
            )}
            {/* {
                isLoggedIn && 

                <BillingAddressForm />

              } */}
            <BillingAddressView />
          </div>
        </Card>
      ) : null}
    </BillingAddressFormikProvider>
  );
});

BillingAddressMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default BillingAddressMemorized;
