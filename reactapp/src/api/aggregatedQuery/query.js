import {
  CART_QUERY_PART,
  CART_QUERY_STORECREDIT_PART,
} from '../cart/fetchGuestCart/query';
import { COUNTRY_LIST_QUERY_PART } from '../countries/fetchCountryList/query';
import { COUNTRY_STATE_LIST_QUERY_PART } from '../countries/fetchCountryStateList/query';
import { CUSTOMER_ADDRESS_LIST_QUERY_PART } from '../customer/fetchCustomerAddresses/query';
import { CHECKOUT_AGREEMENTS_QUERY_PART } from '../storeConfig/getCheckoutAgreements/query';
// import { PHONE_NUMBER_COUNTRY_CODE_QUERY_PART } from '../countries/fetchPhoneNumberCountryList.js/query';
// import { COUNTRY_REGION_LIST_QUERY_PART } from '../countries/fetchCountryRegion/query';
import { cartShippingClicknCollectMethods } from '../cart/utility/query/cartShippingClicknCollectMethods';

export default function getQuery(token, countryId) {
  // Have removed $region_id: Int as we are not using region list query instead we are using react-checkout_config attribute
  // query aggregatedQuery($cartId: String!, $countryId: String, $region_id: Int)
  return `
    query aggregatedQuery($cartId: String!, $countryId: String) {
      ${token ? CART_QUERY_STORECREDIT_PART : CART_QUERY_PART}
      ${COUNTRY_LIST_QUERY_PART}
      ${CHECKOUT_AGREEMENTS_QUERY_PART}
      ${token ? CUSTOMER_ADDRESS_LIST_QUERY_PART : ''}
      ${countryId ? COUNTRY_STATE_LIST_QUERY_PART : ''}
      ${cartShippingClicknCollectMethods}
    }
  `;
}
