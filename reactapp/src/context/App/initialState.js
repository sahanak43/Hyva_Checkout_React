import LocalStorage from '../../utils/localStorage';

const initialState = {
  checkoutAgreements: {},
  countriesLoaded: [],
  countryList: [],
  customer: {},
  customerAddressList: {},
  defaultBillingAddress: '',
  defaultShippingAddress: '',
  isLoggedIn: !!LocalStorage.getCustomerToken(),
  message: false,
  pageLoader: false,
  stateList: {},
  PhoneNumberCountryList: [],
  clicknCollect: {},
};

export default initialState;
