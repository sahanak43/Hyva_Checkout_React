import sendRequest from '../../../sendRequest';
import modifier from '../../fetchGuestCart/modifier';
import { APPLY_STORE_CREDIT_MUTATION } from './mutation';
import LocalStorage from '../../../../utils/localStorage';

export default async function applyStoreCredit(dispatch) {
  const variables = { cartId: LocalStorage.getCartId() };
  return modifier(
    await sendRequest(dispatch, {
      query: APPLY_STORE_CREDIT_MUTATION,
      variables,
    }),
    'applyStoreCreditToCart.cart'
  );
}
