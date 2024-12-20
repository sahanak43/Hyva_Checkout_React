import { get as _get } from 'lodash-es';

export default function setTabbyPaymentModifier(result) {
  return _get(result, 'data.placeOrderWithTabby.cart', {});
}
