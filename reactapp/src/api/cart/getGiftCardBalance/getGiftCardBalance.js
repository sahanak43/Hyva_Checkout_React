import modifier from './modifier';
import sendRequest from '../../sendRequest';
import { GIFT_CARD_BALANCE } from './query';
/* eslint-disable camelcase */

export default async function getGiftCardBalance(dispatch, gift_card_code) {
  const variables = { code: gift_card_code };
  return modifier(
    await sendRequest(dispatch, {
      query: GIFT_CARD_BALANCE,
      variables,
    })
  );
}
