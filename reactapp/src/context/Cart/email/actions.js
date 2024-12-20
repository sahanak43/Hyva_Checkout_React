import { SET_CART_EMAIL, GET_IS_EMAIL_PRESENT } from './types';
import {
  setEmailOnGuestCartRequest,
  getIsEmailPresentRequest,
} from '../../../api';

export async function setEmailOnGuestCartAction(dispatch, appDispatch, email) {
  try {
    await setEmailOnGuestCartRequest(appDispatch, email);

    dispatch({
      type: SET_CART_EMAIL,
      payload: { email },
    });
  } catch (error) {
    // @todo show error message;
  }
}

export async function getEmailIsPresentAction(dispatch, appDispatch, email) {
  try {
    const data = await getIsEmailPresentRequest(appDispatch, email);

    dispatch({
      type: GET_IS_EMAIL_PRESENT,
      payload: { data },
    });
    return data;
  } catch (error) {
    // @todo show error message;
  }
  return {};
}
