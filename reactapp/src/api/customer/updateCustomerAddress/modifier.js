import { get as _get } from 'lodash-es';
import { prepareFullName } from '../../../utils/customer';

export default function updateCustomerAddressModifier(result) {
  const address = _get(result, 'data.updateCustomerAddress', {});
  /* eslint-disable camelcase */

  const {
    id,
    firstname,
    lastname,
    middlename,
    street,
    city,
    region: { region: regionLabel, region_code: regionCode },
    postcode: zipcode,
    telephone: phone,
    default_billing: isDefaultBilling,
    default_shipping: isDefaultShipping,
    country_code: countryCode,
    phone_no_country_code,
  } = address;

  return {
    [Number(id)]: {
      id,
      firstname,
      lastname,
      middlename,
      fullName: prepareFullName(address),
      street,
      city,
      regionLabel,
      regionCode,
      zipcode,
      phone,
      countryCode,
      phone_no_country_code,
      isDefaultBilling,
      isDefaultShipping,
    },
  };
}
