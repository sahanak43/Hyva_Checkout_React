import cartBillingAddrInfo from './cartBillingAddrInfo';
import cartItemsInfo from './cartItemsInfo';
import cartPaymentMethodsInfo from './cartPaymentMethodsInfo';
import cartPriceInfo from './cartPriceInfo';
import cartShippingAddrInfo from './cartShippingAddrInfo';

const localStorageData = JSON.parse(
  window.localStorage.getItem('mage-cache-storage')
);
const isUserSignedIn = localStorageData.customer?.signin_token || false;
export const CART_DATA_FRAGMENT = () => {
  if (!isUserSignedIn) {
    return `
    id
    email
    cart_selected_shipping_method {
        carrier_code
        method_code
    }
    phone_no_country_code {
      value
      label
    }
    is_virtual
    applied_coupons {
      code
    }

    applied_gift_cards {
      code
      applied_balance {
          value
          currency
      } 
      current_balance {
          value
          currency
      }
      expiration_date
  
  }
    ${cartItemsInfo}
    ${cartBillingAddrInfo}
    ${cartShippingAddrInfo}
    ${cartPriceInfo}
    ${cartPaymentMethodsInfo}
  `;
  }
  return `
  id
  email
  cart_selected_shipping_method {
    carrier_code
    method_code
  }
  phone_no_country_code {
    value
    label
  }
  is_virtual
  applied_coupons {
    code
  }
  applied_store_credit {
    enabled
    current_balance {
        currency
        value
    }
    applied_balance {
        currency
        value
    }
}
  applied_gift_cards {
    code
    applied_balance {
        value
        currency
    } 
    current_balance {
        value
        currency
    }
    expiration_date

}
  ${cartItemsInfo}
  ${cartBillingAddrInfo}
  ${cartShippingAddrInfo}
  ${cartPriceInfo}
  ${cartPaymentMethodsInfo}
`;
};
const cartQueryInfo = `
  email
  id
  is_virtual
  billing_address {
    city
    country {
      code
      label
    }
    firstname
    lastname
    postcode
    region {
      code
      label
    }
    street
    telephone
  }
  total_quantity
  items {
    id
    quantity
    prices {
      price {
        value
      },
      row_total {
        value
      }
    }
    product {
      id
      name
      sku
      small_image {
        label
        url
      }
      url_key
    }
    ... on VirtualCartItem {
      customizable_options {
        label
        values {
          id
          label
          value
        }
        id
      }
    }
  }
  available_payment_methods {
    code
    title
  }
  selected_payment_method {
    code
    title
  }
  applied_coupons {
    code
  }
  applied_store_credit {
    enabled
    current_balance {
        currency
        value
    }
    applied_balance {
        currency
        value
    }
}
  applied_gift_cards {
    applied_balance {
      value
      currency
    }
    code
    current_balance {
      value
      currency
    }
    expiration_date
  }
  applied_store_credit {
    enabled
    current_balance {
        currency
        value
    }
    applied_balance {
        currency
        value
    }
}
  prices {
    grand_total {
      value
      currency
    }
    subtotal_excluding_tax {
      value
      currency
    }
  }
`;

export default cartQueryInfo;
