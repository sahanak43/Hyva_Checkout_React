const cartItemsInfo = `
items {
  id
  quantity
  row_special_price 
  row_regular_price
  row_discount_percentage
  prices {
    row_total_including_tax{
      value
    }
    price_including_tax {
      value
    }
  }
  product {
    __typename
    id
    name
    sku
    small_image {
      label
      url
    }
    url_key
    special_price
  }
  ...on ConfigurableCartItem {
    configurable_options {
      id
      option_label
      value_label
    }
  }
}`;

export default cartItemsInfo;
