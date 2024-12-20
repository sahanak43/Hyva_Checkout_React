import { CART_DATA_FRAGMENT } from '../../utility/query/cartQueryInfo';

export const REMOVE_GIFT_CARD_MUTATION = `
mutation removeGiftCardFromCart($cartId: String!, $gift_card_code: String!) {
    removeGiftCardFromCart(
        input: {
            cart_id: $cartId
            gift_card_code: $gift_card_code
        }
    ) {
        cart {
            ${CART_DATA_FRAGMENT()}
            applied_gift_cards {
                code
                applied_balance {
                    value
                    currency
                }
                current_balance {
                    value
                    currency
                }
                expiration_date
            }
        }
    }
}
`;
