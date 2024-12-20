import { get as _get } from 'lodash-es';

import { formatPrice } from '../../../utils/price';
import { prepareFullName } from '../../../utils/customer';
/* eslint-disable camelcase */

export function modifySelectedShippingMethod(addressList) {
  const selectedMethod = _get(addressList, '0.selected_shipping_method');

  if (!selectedMethod) {
    return {};
  }

  const {
    price_incl_tax: { value },
    method_code: methodCode,
    carrier_code: carrierCode,
    carrier_title: carrierTitle,
    method_title: methodTitle,
  } = selectedMethod;
  const methodId = `${carrierCode}__${methodCode}`;

  return {
    id: methodId,
    carrierCode,
    methodCode,
    carrierTitle,
    methodTitle,
    amount: value,
    price: formatPrice(value),
  };
}

export function modifyShippingMethods(addressList) {
  const shippingMethods = _get(addressList, '0.available_shipping_methods', []);
  if (!shippingMethods || !shippingMethods.length) {
    return {};
  }

  return shippingMethods.reduce((accumulator, method) => {
    const {
      method_code: methodCode,
      carrier_code: carrierCode,
      method_title: methodTitle,
      carrier_title: carrierTitle,
      price_incl_tax: { value: amount },
    } = method;

    const methodId = `${carrierCode}__${methodCode}`;

    accumulator[methodId] = {
      id: methodId,
      carrierCode,
      carrierTitle,
      methodCode,
      methodTitle,
      price: formatPrice(amount),
      amount,
    };

    return accumulator;
  }, {});
}

export function modifyShippingAddressList(addressList) {
  const shippingAddress = _get(addressList, '0');
  // const phoneNumberCountryCode = _get(addressList, 'phone_no_country_code', '');

  if (!shippingAddress) {
    return {};
  }

  const {
    city,
    street,
    lastname,
    firstname,
    telephone: phone,
    region: { code: regionCode },
    country: { code: countryCode },
    phone_no_country_code,
  } = shippingAddress;

  return {
    city,
    phone,
    street,
    lastname,
    firstname,
    phone_no_country_code,
    region: regionCode || '',
    country: countryCode,
    fullName: prepareFullName(shippingAddress),
  };
}

export default function setShippingAddressModifier(result) {
  const shippingAddresses = _get(
    result,
    // inside setShippingAddress mutation
    'data.setShippingAddressesOnCart.cart.shipping_addresses',
    []
  );

  return modifyShippingAddressList(shippingAddresses);
}
