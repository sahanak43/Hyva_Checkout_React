import modifier from './modifier';
import sendRequest from '../../sendRequest';
import LocalStorage from '../../../utils/localStorage';
import { TABBY_PAYMENT_MUTATION } from './mutation';

export default async function setTabbyPayment(dispatch) {
  const variables = { cart_id: LocalStorage.getCartId() };

  try {
    const response = await sendRequest(dispatch, {
      query: TABBY_PAYMENT_MUTATION,
      variables,
    });
    modifier(response);
    return response;
  } catch (error) {
    console.error('Error in setTabbyPayment:', error);
  }
  return {};
}
