import {
  applyCouponCodeAction,
  removeCouponCodeAction,
} from './couponCode/actions';

import {
  applyGiftCardAction,
  removeGiftCardAction,
  giftCardBalanceAction,
} from './giftCard/actions';

import {
  applyStoreCreditAction,
  removeStoreCreditAction,
} from './storeCredit/action';

import {
  setBillingAddressAction,
  setCustomerAddrAsBillingAddrAction,
} from './billingAddress/actions';
import {
  setPaymentMethodAction,
  setRestPaymentMethodAction,
} from './paymentMethod/actions';

import { setcheckoutComPaymentAction } from './checkoutComPaymentMethod/action';
import {
  mergeCartsAction,
  setCartInfoAction,
  createEmptyCartAction,
  getGuestCartInfoAction,
  getCustomerCartIdAction,
  getCartInfoAfterMergeAction,
} from './cart/actions';
import {
  addCartShippingAddressAction,
  setSelectedShippingAddressAction,
  setCustomerAddrAsShippingAddrAction,
} from './shippingAddress/actions';
import { updateCartItemAction } from './cartItems/actions';
import {
  setEmailOnGuestCartAction,
  getEmailIsPresentAction,
} from './email/actions';
import { setShippingMethodAction } from './shippingMethod/actions';
import { placeOrderAction, setOrderInfoAction } from './order/actions';
import { storeAggregatedCartStatesAction } from './aggregated/actions';

const dispatchMapper = {
  placeOrder: placeOrderAction,
  mergeCarts: mergeCartsAction,
  setCartInfo: setCartInfoAction,
  setOrderInfo: setOrderInfoAction,
  updateCartItem: updateCartItemAction,
  createEmptyCart: createEmptyCartAction,
  applyCouponCode: applyCouponCodeAction,
  applyGiftCard: applyGiftCardAction,
  applyStoreCredit: applyStoreCreditAction,
  removeCouponCode: removeCouponCodeAction,
  removeGiftCard: removeGiftCardAction,
  balanceGiftCard: giftCardBalanceAction,
  removeStoreCredit: removeStoreCreditAction,
  getGuestCartInfo: getGuestCartInfoAction,
  setPaymentMethod: setPaymentMethodAction,
  setcheckoutComPayment: setcheckoutComPaymentAction,
  setShippingMethod: setShippingMethodAction,
  getCustomerCartId: getCustomerCartIdAction,
  getCustomerCartInfo: getGuestCartInfoAction,
  setEmailOnGuestCart: setEmailOnGuestCartAction,
  setCartBillingAddress: setBillingAddressAction,
  setRestPaymentMethod: setRestPaymentMethodAction,
  getCartInfoAfterMerge: getCartInfoAfterMergeAction,
  addCartShippingAddress: addCartShippingAddressAction,
  storeAggregatedCartStates: storeAggregatedCartStatesAction,
  setCartSelectedShippingAddress: setSelectedShippingAddressAction,
  setCustomerAddressAsBillingAddress: setCustomerAddrAsBillingAddrAction,
  setCustomerAddressAsShippingAddress: setCustomerAddrAsShippingAddrAction,
  getEmailIsPresent: getEmailIsPresentAction,
};

function cartDispatchers(dispatch, appDispatch) {
  const dispatchers = { dispatch };
  Object.keys(dispatchMapper).forEach((dispatchName) => {
    dispatchers[dispatchName] = dispatchMapper[dispatchName].bind(
      null,
      dispatch,
      appDispatch
    );
  });

  return dispatchers;
}

export default cartDispatchers;
