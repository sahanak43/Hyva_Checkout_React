import modifier from './modifier';
import sendRequest from '../../sendRequest';
import LocalStorage from '../../../utils/localStorage';
import { TAMARA_PAYMENT_MUTATION } from './mutation';

export default async function setTamaraPayment(dispatch) {
  const variables = { cart_id: LocalStorage.getCartId() };

  try {
    const response = await sendRequest(dispatch, {
      query: TAMARA_PAYMENT_MUTATION,
      variables,
    });
    modifier(response);
    return response;
  } catch (error) {
    console.error('Error in setTabbyPayment:', error);
  }
  return {};
}
