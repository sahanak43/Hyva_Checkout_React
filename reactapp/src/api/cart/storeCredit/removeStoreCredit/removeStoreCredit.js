import sendRequest from '../../../sendRequest';
import modifier from '../../fetchGuestCart/modifier';
import { REMOVE_STORE_CREDIT_MUTATION } from './mutation';
import LocalStorage from '../../../../utils/localStorage';

export default async function removeStoreCredit(dispatch) {
  const variables = { cartId: LocalStorage.getCartId() };
  return modifier(
    await sendRequest(dispatch, {
      query: REMOVE_STORE_CREDIT_MUTATION,
      variables,
    }),
    'removeStoreCreditFromCart.cart'
  );
}
