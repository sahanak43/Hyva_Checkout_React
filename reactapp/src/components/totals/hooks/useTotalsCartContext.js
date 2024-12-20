/* eslint-disable */
import { useContext } from 'react';
import { get as _get } from 'lodash-es';

import CartContext from '../../../context/Cart/CartContext';

export default function useTotalsCartContext() {
  const [cartData] = useContext(CartContext);
  const cart = _get(cartData, 'cart');
  const shippingMethod = _get(cart, 'selected_shipping_method') || {};
  const selectedPaymentMethod = _get(cart, 'selected_payment_method') || {};
  const giftCardTotal = _get(cart, 'appliedGiftCards');
  const storeCreditTotal = _get(cart, 'appliedStoreCredit');
  let code = '';
  let currentValue = '';
  let giftCurrency = '';
  if (giftCardTotal) {
    if (giftCardTotal.length) {
      code = giftCardTotal[0].code;
      currentValue = giftCardTotal[0].applied_balance.value;
      giftCurrency = giftCardTotal[0].current_balance.currency;
    }
  }

  let storeValue = '';
  let storeCurrency = '';
  if (storeCreditTotal && storeCreditTotal.current_balance) {
    storeValue = storeCreditTotal.current_balance.value || '';
    storeCurrency = storeCreditTotal.current_balance.currency || '';
  }

  const prices = _get(cart, 'prices') || {};
  const {
    price: shippingMethodRate,
    carrierTitle: shippingCarrierTitle,
    methodTitle: shippingMethodTitle,
  } = shippingMethod;
  const {
    subTotalIncl,
    subTotalExcl,
    grandTotal,
    appliedTaxes,
    hasAppliedTaxes,
    discounts,
    hasDiscounts,
    grandTotalWithCurrency,
    subTotalInclAmount,
    grandTotalAmount,
  } = prices;

  return {
    subTotalIncl,
    subTotalExcl,
    grandTotal,
    discounts,
    appliedTaxes,
    shippingMethodRate,
    hasDiscounts,
    shippingCarrierTitle,
    shippingMethodTitle,
    selectedPaymentMethod,
    currentValue,
    grandTotalWithCurrency,
    // grandTotalAmount,
    code,
    storeValue,
    storeCurrency,
    giftCurrency,
    hasAppliedTaxes,
    giftCardTotal,
    storeCreditTotal,
    hasSubTotal: !!subTotalInclAmount,
    hasGrandTotal: !!grandTotalAmount,
    hasShippingRate: !!shippingMethod?.id,
  };
}
