import { get as _get } from 'lodash-es';

export default function getGiftCardBalanceModifier(result) {
  return _get(result, 'data.giftCardAccount', {});
}
