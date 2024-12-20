export const TAMARA_PAYMENT_MUTATION = `
mutation createTamaraPlaceOrder($cart_id: String!) {
    createTamaraPlaceOrder(cart_id: $cart_id) {
        redirect_url
        errors {
            message
            code
        }
    }
}
`;
