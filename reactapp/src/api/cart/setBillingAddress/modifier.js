import { get as _get } from 'lodash-es';

import LocalStorage from '../../../utils/localStorage';
import { prepareFullName } from '../../../utils/customer';
import { isCartAddressValid } from '../../../utils/address';

/* eslint-disable camelcase */
export function modifyBillingAddressData(billingAddress) {
  if (!isCartAddressValid(billingAddress)) {
    return {};
  }
  // const phoneNumberCountryCode = _get(
  //   billingAddress,
  //   'phone_no_country_code',
  //   []
  // );
  const {
    firstname = '',
    lastname = '',
    street = [],
    telephone: phone = '',
    city = '',
    country: { code: countryCode = '' } = {},
    region: { code: regionCode = '' } = {},
    phone_no_country_code,
  } = billingAddress;

  return {
    id: LocalStorage.getCustomerBillingAddressId(),
    firstname,
    lastname,
    fullName: prepareFullName(billingAddress),
    street,
    phone,
    phone_no_country_code,
    city,
    region: regionCode || '',
    country: countryCode,
    isSameAsShipping: LocalStorage.getBillingSameAsShippingInfo(),
  };
}

export default function setBillingAddressModifier(response) {
  const billingAddress = _get(
    response,
    // inside setBillingAddress mutation
    'data.setBillingAddressOnCart.cart.billing_address',
    {}
  );

  return modifyBillingAddressData(billingAddress);
}
