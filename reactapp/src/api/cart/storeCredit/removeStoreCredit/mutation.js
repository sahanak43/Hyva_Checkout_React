import { CART_DATA_FRAGMENT } from '../../utility/query/cartQueryInfo';

export const REMOVE_STORE_CREDIT_MUTATION = `
mutation removeStoreCreditFromCart($cartId: String!) {
    removeStoreCreditFromCart(
        input: {
            cart_id: $cartId
        }
    ) {
        cart {
            ${CART_DATA_FRAGMENT()}
            applied_store_credit {
                enabled
                current_balance {
                    currency
                    value
                }
                applied_balance {
                    currency
                    value
                }
            }
        }
    }
}
`;
