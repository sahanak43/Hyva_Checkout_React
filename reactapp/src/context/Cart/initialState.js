import LocalStorage from '../../utils/localStorage';

const selectedShippingAddress = LocalStorage.getCustomerShippingAddressId();

const initialState = {
  errors: false,
  order: {},
  cart: {
    loaded: false,
    email: null,
    id: null,
    isVirtualCart: true,
    billing_address: null,
    shipping_address: {},
    isEmailAvailable: true,
    selected_shipping_address: selectedShippingAddress || '',
    shipping_methods: {},
    selected_shipping_method: {},
    items: {},
    cart_selected_shipping_method: {},
    available_payment_methods: {},
    selected_payment_method: {
      code: '',
      title: '',
    },
    cardDetails: {
      cardNumber: '',
      cvv: '',
      expiry: '',
    },
    applied_coupons: null,
    applied_gift_cards: [],
    giftCardAccount: {},
    applied_store_credit: {},
    prices: {
      discounts: [],
      discountLabel: '',
      discountAmount: 0,
      hasDiscounts: false,
      subTotal: '',
      subTotalAmount: 0,
      grandTotal: '',
      grandTotalAmount: 0,
    },
    is_virtual: false,
  },
};

export default initialState;
