import sendRequest from '../../../sendRequest';
import modifier from '../../fetchGuestCart/modifier';
import { APPLY_GIFT_CARD_MUTATION } from './mutation';
import LocalStorage from '../../../../utils/localStorage';
/* eslint-disable camelcase */
export default async function applyGiftCard(dispatch, gift_card_code) {
  const variables = { cartId: LocalStorage.getCartId(), gift_card_code };

  return modifier(
    await sendRequest(dispatch, {
      query: APPLY_GIFT_CARD_MUTATION,
      variables,
    }),
    'applyGiftCardToCart.cart'
  );
}
