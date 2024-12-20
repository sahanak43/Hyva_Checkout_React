import {
  setCartShippingAddress,
  setCartSelectedShippingAddress,
} from './shippingAddress/reducers';
import {
  SET_CART_SHIPPING_ADDRESS,
  SET_CART_SELECTED_SHIPPING_ADDRESS,
} from './shippingAddress/types';
import { SET_CART_INFO } from './cart/types';
import { setCartInfo } from './cart/reducers';
import { SET_CART_EMAIL, GET_IS_EMAIL_PRESENT } from './email/types';
import { SET_ORDER_INFO } from './order/types';
import { setCartEmail, setIsEmailPresent } from './email/reducers';
import { setOrderInfo } from './order/reducers';
import { setAggregatedData } from './aggregated/reducers';
import { AGGREGATED_CART_DATA } from './aggregated/types';
import { setCartBillingAddress } from './billingAddress/reducers';
import { SET_CART_BILLING_ADDRESS } from './billingAddress/types';
import { setGiftCardBalance } from './giftCard/reducer';
import { GET_GIFT_CARD_BALANCE } from './giftCard/types';

const actions = {
  [SET_CART_INFO]: setCartInfo,
  [SET_CART_EMAIL]: setCartEmail,
  [SET_ORDER_INFO]: setOrderInfo,
  [AGGREGATED_CART_DATA]: setAggregatedData,
  [SET_CART_BILLING_ADDRESS]: setCartBillingAddress,
  [SET_CART_SHIPPING_ADDRESS]: setCartShippingAddress,
  [SET_CART_SELECTED_SHIPPING_ADDRESS]: setCartSelectedShippingAddress,
  [GET_IS_EMAIL_PRESENT]: setIsEmailPresent,
  [GET_GIFT_CARD_BALANCE]: setGiftCardBalance,
};

function cartReducer(state, { type, payload }) {
  const action = actions[type];

  if (action) {
    return action(state, payload);
  }

  return state;
}

export default cartReducer;
