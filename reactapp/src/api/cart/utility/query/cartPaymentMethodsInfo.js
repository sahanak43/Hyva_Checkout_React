const cartPaymentMethodsInfo = `
  available_payment_methods {
    code
    title
  }
  selected_payment_method {
    code
    title
    additional_data {
      amount {
        value
        currency
      }
      fee_label
    }
    }
`;

export default cartPaymentMethodsInfo;
