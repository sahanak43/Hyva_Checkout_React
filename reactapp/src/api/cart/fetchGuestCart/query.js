import cartItemsInfo from '../utility/query/cartItemsInfo';
import cartPriceInfo from '../utility/query/cartPriceInfo';
import cartBillingAddrInfo from '../utility/query/cartBillingAddrInfo';
import cartShippingAddrInfo from '../utility/query/cartShippingAddrInfo';
import cartPaymentMethodsInfo from '../utility/query/cartPaymentMethodsInfo';

export const CART_QUERY_PART = `
  cart(cart_id: $cartId) {
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
    ${cartItemsInfo}
    ${cartPriceInfo}
    ${cartBillingAddrInfo}
    ${cartShippingAddrInfo}
    ${cartPaymentMethodsInfo}
  }
`;

export const CART_QUERY_STORECREDIT_PART = `
  cart(cart_id: $cartId) {
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
    ${cartItemsInfo}
    ${cartPriceInfo}
    ${cartBillingAddrInfo}
    ${cartShippingAddrInfo}
    ${cartPaymentMethodsInfo}
  }
`;
const localStorageData = JSON.parse(
  window.localStorage.getItem('mage-cache-storage')
);
const isUserSignedIn = localStorageData.customer?.signin_token || false;

export const GET_GUEST_CART_QUERY = () => {
  if (!isUserSignedIn) {
    return `
      query getGuestCartQuery($cartId: String!) {
        ${CART_QUERY_PART}
      }
    `;
  }
  return `
  query getGuestCartQuery($cartId: String!) {
    ${CART_QUERY_STORECREDIT_PART}
  }
`;
};
