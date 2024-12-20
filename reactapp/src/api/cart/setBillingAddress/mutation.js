import { CART_DATA_FRAGMENT } from '../utility/query/cartQueryInfo';

/**
 * When the cart contains only virtual products, usage of "same_as_shipping" gives
 * error. Hence we won't use "same_as_shipping" in the case of virtual products only
 * cart.
 */
export default function prepareMutation(isVirtualCart) {
  return `
  mutation setBillingAddress(
    $cartId: String!
    $firstname: String!
    $lastname: String!
    $street: [String]!
    $city: String!
    $region: String
    $regionId: Int
    $country: String!
    $phone: String!
    $phone_no_country_code: String!
    ${isVirtualCart ? '' : '$isSameAsShipping: Boolean'}
    $saveInBook: Boolean
  ) {
    setBillingAddressOnCart(
      input: {
        cart_id: $cartId
        billing_address: {
          ${isVirtualCart ? '' : 'same_as_shipping: $isSameAsShipping'}
          address: {
            firstname: $firstname
            lastname: $lastname
            street: $street
            city: $city
            region: $region
            region_id: $regionId
            country_code: $country
            telephone: $phone
            phone_no_country_code: $phone_no_country_code
            save_in_address_book: $saveInBook
          }
        }
      }
    ) {
      cart {
        ${CART_DATA_FRAGMENT()}
      }
    }
  }
  `;
}
