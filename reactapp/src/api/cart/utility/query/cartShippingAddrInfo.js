import cartShippingMethods from './cartShippingMethods';

const cartShippingAddrInfo = `
shipping_addresses {
  city
  country {
    code
    label
  }
  region {
    code
    label
  }
  phone_no_country_code
  firstname
  lastname
  postcode
  region {
    code
    label
  }
  street
  telephone
  ${cartShippingMethods}
}`;

export default cartShippingAddrInfo;
