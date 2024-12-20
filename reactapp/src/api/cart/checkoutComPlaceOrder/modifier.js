import { get as _get } from 'lodash-es';

export default function setCheckoutComPaymentModifier(result) {
  return _get(result, 'data.createCheckoutComCardPlaceOrder.cart', {});
}
