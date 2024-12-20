export default function setEmailOnGuestCartMutation() {
  return `mutation setGuestEmailOnCart($cartId: String!, $email: String!) {
    setGuestEmailOnCart(
      input: {
        cart_id: $cartId
        email: $email
      }
    ) {
      cart {
        email
      }
    }
  }`;
}
