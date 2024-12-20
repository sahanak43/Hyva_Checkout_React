export function setGiftCardBalance(state, giftCardAccount) {
  const { data } = giftCardAccount;
  return {
    ...state,
    cart: {
      ...state.cart,
      giftCardAccount: data,
    },
  };
}
