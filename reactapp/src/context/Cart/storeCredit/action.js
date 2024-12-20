import {
  applyStoreCreditRequest,
  removeStoreCreditRequest,
} from '../../../api';

import { SET_CART_INFO } from '../cart/types';

export async function applyStoreCreditAction(dispatch, appDispatch) {
  const cartInfo = await applyStoreCreditRequest(appDispatch);

  dispatch({
    type: SET_CART_INFO,
    payload: cartInfo,
  });

  return cartInfo;
}

export async function removeStoreCreditAction(dispatch, appDispatch) {
  const cartInfo = await removeStoreCreditRequest(appDispatch);

  dispatch({
    type: SET_CART_INFO,
    payload: cartInfo,
  });
  return cartInfo;
}
