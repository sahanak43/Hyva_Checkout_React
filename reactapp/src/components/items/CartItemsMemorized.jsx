import React from 'react';

import Card from '../common/Card';
import CartItemList from './components/CartItemList';
import NoItemsInfoBox from './components/NoItemsInfoBox';
import CartItemsFormManager from './components/CartItemsFormManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import useItemsCartContext from './hooks/useItemsCartContext';

const CartItemsMemorized = React.memo(({ formikData }) => {
  const { cartItemsAvailable, cartItems } = useItemsCartContext();

  return (
    <CartItemsFormManager formikData={formikData}>
      <Card
        classes={`pb-0 ${
          cartItemsAvailable ? '' : 'opacity-75'
        } hidden lg:block`}
      >
        <div className="flex justify-between items-center mb-[40px]">
          <div>
            <span className="!text-[24px] font-semibold">
              {__('Cart Summary')}
            </span>
            <span className="text-customOrange">
              {' '}
              ({Object.keys(cartItems).length})
            </span>
          </div>
          <a
            href="/checkout/cart"
            className="text-blue-600 underline ml-4 text-[20px] font-medium"
          >
            {__('Edit')}
          </a>
        </div>

        {cartItemsAvailable ? <CartItemList /> : <NoItemsInfoBox />}
      </Card>
    </CartItemsFormManager>
  );
});

CartItemsMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default CartItemsMemorized;
