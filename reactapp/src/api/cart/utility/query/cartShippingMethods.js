const cartShippingMethods = `
available_shipping_methods {
  carrier_code
  carrier_title
  method_code
  method_title
  price_incl_tax {
    currency
    value
  }
}
selected_shipping_method {
  carrier_code
  method_code
  carrier_title
  method_title
  amount {
    currency
    value
  }
  price_incl_tax {
    value
  }
}`;

export default cartShippingMethods;
