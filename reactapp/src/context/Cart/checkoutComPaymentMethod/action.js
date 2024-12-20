import { checkoutComPaymentMethodRequest } from '../../../api';
import { SET_CART_INFO } from '../cart/types';

export async function setcheckoutComPaymentAction(
  dispatch,
  appDispatch,
  { cardNumber, expiry, cvv }
) {
  try {
    const paymentDetails = {
      cardNumber,
      expiry,
      cvv,
    };
    const cartData = await checkoutComPaymentMethodRequest(
      dispatch,
      paymentDetails
    );
    dispatch({
      type: SET_CART_INFO,
      payload: cartData,
    });
    return cartData;
  } catch (error) {
    // @todo show error message;
    console.error(error);
  }

  return {};
}
