import { get as _get } from 'lodash-es';

import env from './env';
import { __ } from '../i18n';
import RootElement from './rootElement';
import LocalStorage from './localStorage';
import { prepareFullName } from './customer';
import { BILLING_ADDR_FORM, config } from '../config';
import { _cleanObjByKeys, _isNumber, _toString } from './index';
// import useCartContext from '../hook/useCartContext';
// import useAppContext from '../hook/useAppContext';

export const initialCountry =
  env.defaultCountry ||
  RootElement.getDefaultCountryId() ||
  config.defaultCountry;

export const CART_SHIPPING_ADDRESS = 'cart_shipping_address';

export const billingSameAsShippingField = `${BILLING_ADDR_FORM}.isSameAsShipping`;

export function isCartAddressValid(address) {
  return !!(address && address.firstname && address.country);
}

export function isValidCustomerAddressId(addressId) {
  // Number.isNaN should not use here. both functions works differently.
  // eslint-disable-next-line no-restricted-globals
  return addressId && !isNaN(addressId);
}
/* eslint-disable camelcase */
export function formatAddressListToCardData(
  addressList,
  stateList,
  cart,
  countryList
) {
  return addressList.map((addr) => {
    const {
      id,
      city = '',
      phone = '',
      street = [],
      region = '',
      // zipcode = '',
      country = '',
      firstname = '',
      lastname = '',
      regionLabel = '',
      // countryCode = '',
      // phone_no_country_code,
    } = addr;
    // const { cart } = useCartContext();
    // const { countryList } = useAppContext();
    const countryName = countryList?.[0]?.name || '';
    const phoneCountryCode = cart?.phone_no_country_code?.[0]?.label || '';
    const countryRegions = _get(stateList, `${country}`, []);
    const countryRegion = countryRegions.find((state) => state.code === region);
    return {
      id: _toString(id),
      address: [
        prepareFullName({ firstname, lastname }),
        ...street,
        // __('%1 %2', zipcode, city),
        __('%1 , %2', city, regionLabel || _get(countryRegion, 'name')),
        // regionLabel || _get(countryRegion, 'name'),
        countryName,
        __('%1 %2', phoneCountryCode, phone),
      ].filter((i) => !!i),
    };
  });
}

const addressInitValues = {
  firstname: '',
  lastname: '',
  street: [''],
  phone: '',
  zipcode: '',
  city: '',
  region: '',
  country: '',
};

export function prepareFormAddressFromCartAddress(address, selectedAddressId) {
  const newAddress = { ...address };
  const { countryCode, regionCode } = address;

  if (countryCode) {
    newAddress.country = countryCode;
  }
  if (regionCode) {
    newAddress.region = regionCode;
  }
  if (selectedAddressId) {
    newAddress.selectedAddress = selectedAddressId;
  }

  const keysToRemove = [
    'fullName',
    'middlename',
    'regionCode',
    'countryCode',
    'regionLabel',
    'isDefaultBilling',
    'isDefaultShipping',
  ];

  return {
    ...addressInitValues,
    ..._cleanObjByKeys(newAddress, keysToRemove),
  };
}

export function isMostRecentAddress(addressId) {
  const recentAddressList = LocalStorage.getMostRecentlyUsedAddressList();

  return !!recentAddressList[addressId];
}

export function prepareAddressForSaving(addressToSave, regionData) {
  // Region code some times can be integer instead of string eg: FR
  // In those cases, use "region_id" instead of "region" input in GQL in order
  // to update the address data.
  if (_isNumber(regionData?.code)) {
    return {
      ...addressToSave,
      region: '',
      regionId: regionData?.id,
    };
  }

  return addressToSave;
}
