import React from 'react';
import useCartContext from '../../../hook/useCartContext';
import Button from '../../common/Button';
import { __ } from '../../../i18n';
import usePlaceOrderAppContext from '../hooks/usePlaceOrderAppContext';
import setApplePayment from '../../../api/cart/applePayPlaceOrder';

function ApplePayButton({ isButtonDisabled, loading }) {
  const { cart } = useCartContext();
  const { appDispatch } = usePlaceOrderAppContext();

  return (
    <Button
      variant="primary"
      id="apple-pay"
      click={() => setApplePayment({ cart, appDispatch })}
      disable={isButtonDisabled}
      className="bg-customOrange w-full justify-center mr-0 max-lg:h-[40px] max-lg:text-sm"
    >
      {loading
        ? __('Place Order with apple pay')
        : __('Place Order with apple pay')}
    </Button>
  );
}
ApplePayButton.propTypes = {
  isButtonDisabled: false,
  loading: false,
};

ApplePayButton.defaultProps = {
  isButtonDisabled: false,
  loading: false,
};

export default ApplePayButton;
