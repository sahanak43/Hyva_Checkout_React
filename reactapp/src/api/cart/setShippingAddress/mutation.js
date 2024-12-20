import { CART_DATA_FRAGMENT } from '../utility/query/cartQueryInfo';

export const SET_SHIPPING_ADDR_MUTATION = `
mutation setShippingAddress(
  $cartId: String!
  $firstname: String!
  $lastname: String!
  $street: [String]!
  $city: String!
  $region: String
  $regionId: Int
  $zipcode: String!
  $country: String!
  $phone: String!
  $phone_no_country_code: String!
  $saveInBook: Boolean
  
) {
  setShippingAddressesOnCart(
    input: {
      cart_id: $cartId
      shipping_addresses: [{
      	address: {
          firstname: $firstname
          lastname: $lastname
          street: $street
          city: $city
          region: $region
          region_id: $regionId
          postcode: $zipcode
          country_code: $country
          telephone: $phone
          phone_no_country_code: $phone_no_country_code
          save_in_address_book: $saveInBook
        }
      }]
    }
  ) {
    cart {
      ${CART_DATA_FRAGMENT()}
    }
  }
}`;
