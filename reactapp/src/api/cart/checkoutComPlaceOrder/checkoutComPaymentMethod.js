import modifier from './modifier';
import sendRequest from '../../sendRequest';
import LocalStorage from '../../../utils/localStorage';
import { CHECKOUTCOM_PAYMENT_MUTATION } from './mutation';

export default async function checkoutComPayment(dispatch, cardDetails) {
  const { cardNumber, expiry, cvv } = cardDetails;
  const [month, year] = expiry.split('/');
  const variables = {
    cart_id: LocalStorage.getCartId(),
    card_number: cardNumber,
    card_expiry_month: Number(month),
    card_expiry_year: Number(year),
    card_cvv: cvv,
  };

  try {
    const response = await sendRequest(dispatch, {
      // eslint-disable-line
      query: CHECKOUTCOM_PAYMENT_MUTATION,
      variables,
    });
    modifier(response);
    return response;
  } catch (error) {
    console.error('Error in checkoutComPayment:', error);
  }
  return {};
}
