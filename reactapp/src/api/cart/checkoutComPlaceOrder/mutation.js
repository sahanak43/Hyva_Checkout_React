export const CHECKOUTCOM_PAYMENT_MUTATION = `
mutation createCheckoutComCardPlaceOrder(
    $cart_id: String!
    $card_number: String!,
    $card_expiry_month: Int!
    $card_expiry_year: Int!
    $card_cvv: String
) {
    createCheckoutComCardPlaceOrder(
        input: {
            cart_id: $cart_id
            card_number: $card_number,
            card_expiry_month: $card_expiry_month,
            card_expiry_year: $card_expiry_year,
            card_cvv: $card_cvv
        }
    ) {
        redirect_url
        errors {
            message
            code
        }
    }
}
`;
