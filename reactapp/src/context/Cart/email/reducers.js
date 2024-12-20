export function setCartEmail(state, email) {
  return {
    ...state,
    cart: {
      ...state.cart,
      ...email,
    },
  };
}

export function setIsEmailPresent(state, isEmailAvailable) {
  const { data } = isEmailAvailable;
  return {
    ...state,
    cart: {
      ...state.cart,
      isEmailAvailable: data,
    },
  };
}
