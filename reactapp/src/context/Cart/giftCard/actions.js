import {
  applyGiftCardToCartRequest,
  removeGiftCardFromCartRequest,
  getGiftCardBalanceRequest,
} from '../../../api';
import { SET_CART_INFO } from '../cart/types';

export async function applyGiftCardAction(dispatch, appDispatch, giftCardCode) {
  const cartInfo = await applyGiftCardToCartRequest(appDispatch, giftCardCode);
  dispatch({
    type: SET_CART_INFO,
    payload: cartInfo,
  });
  return cartInfo;
}

export async function removeGiftCardAction(
  dispatch,
  appDispatch,
  giftCardCode
) {
  const cartInfo = await removeGiftCardFromCartRequest(
    appDispatch,
    giftCardCode
  );

  dispatch({
    type: SET_CART_INFO,
    payload: cartInfo,
  });
  return cartInfo;
}

export async function giftCardBalanceAction(
  dispatch,
  appDispatch,
  giftCardCode
) {
  const cartInfo = await getGiftCardBalanceRequest(appDispatch, giftCardCode);
  dispatch({
    type: SET_CART_INFO,
    payload: cartInfo,
  });
  return cartInfo;
}
