export function setCartInfo(state, cartInfo) {
  return {
    ...state,
    cart: {
      ...state.cart,
      ...cartInfo,
    },
  };
}

export function getPhoneNumberCode(state) {
  return {
    ...state,
    cart: {
      ...state.cart,
    },
  };
}
