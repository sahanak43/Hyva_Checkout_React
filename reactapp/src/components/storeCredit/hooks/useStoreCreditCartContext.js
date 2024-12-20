import { get as _get } from 'lodash-es';
import useCartContext from '../../../hook/useCartContext';

export default function useStoreCreditCartContext() {
  const { cart, applyStoreCredit, removeStoreCredit } = useCartContext();
  const storeCredit = _get(cart, 'appliedStoreCredit');

  return {
    applyStoreCredit,
    removeStoreCredit,
    storeCredit,
  };
}
