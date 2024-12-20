import { get as _get } from 'lodash-es';

export default function setTamaraPaymentModifier(result) {
  return _get(result, 'data.createTamaraPlaceOrder.cart', {});
}
