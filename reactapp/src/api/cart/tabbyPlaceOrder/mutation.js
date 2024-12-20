export const TABBY_PAYMENT_MUTATION = `
mutation placeOrderWithTabby($cart_id: String!) {
    placeOrderWithTabby(cart_id: $cart_id) {
        redirect_url
        errors {
            message
            code
        }
    }
}
`;
