import { CART_DATA_FRAGMENT } from '../utility/query/cartQueryInfo';

export const SET_SHIPPING_METHOD_MUTATION = `
mutation setShippingMehodMutation(
  $cartId: String!,
  $carrierCode: String!,
  $methodCode: String!,
  $clickncollect_store: String,
  $clickncollect_date: String,
  $clickncollect_time: String,
) {
  setShippingMethodsOnCart(
    input: {
      cart_id: $cartId
      clickncollect_store: $clickncollect_store
      clickncollect_date: $clickncollect_date
      clickncollect_time: $clickncollect_time
      shipping_methods: [
        {
          carrier_code: $carrierCode
          method_code: $methodCode
        }
      ]
    }
  ) {
  cart {
    ${CART_DATA_FRAGMENT()}
    shipping_addresses{
      selected_shipping_method{
        carrier_code
        method_code
        carrier_title
        method_title
      }
    }
    }
  }
}
`;
