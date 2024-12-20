import { CART_DATA_FRAGMENT } from '../../utility/query/cartQueryInfo';

export const APPLY_STORE_CREDIT_MUTATION = `
mutation applyStoreCreditToCart($cartId: String!) {
    applyStoreCreditToCart(
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
