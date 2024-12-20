import fetchGuestCartModifier from '../cart/fetchGuestCart/modifier';
import fetchCountryListModifier from '../countries/fetchCountryList/modifier';
import fetchCountryStateListModifier from '../countries/fetchCountryStateList/modifier';
import fetchCountryPhoneNumberListModifier from '../countries/fetchPhoneNumberCountryList.js/modifier';
import fetchCustomerAddressesModifier from '../customer/fetchCustomerAddresses/modifier';
import getCheckoutAgreementsModifier from '../storeConfig/getCheckoutAgreements/modifier';
import fetchCountryRegionModifier from '../countries/fetchCountryRegion/modifier';

export default function aggregatedQueryModifier(result, token, countryId) {
  const cart = fetchGuestCartModifier(result);
  const countryList = fetchCountryListModifier(result);
  const checkoutAgreements = getCheckoutAgreementsModifier(result);
  const customer = (token && fetchCustomerAddressesModifier(result)) || {};
  const stateList =
    (countryId && { [countryId]: fetchCountryStateListModifier(result) }) || {};
  const PhoneNumberCountryList = fetchCountryPhoneNumberListModifier(result);
  const regionList = fetchCountryRegionModifier(result) || {};
  const clicknCollectList = result.data.shipping_clickncollect;
  const giftCardBalance = result.data.applied_gift_cards;
  const storeCreditBalance = result.data.cart.applied_store_credit;
  const cartselectedshippingmethod =
    result.data.cart.cart_selected_shipping_method;

  return {
    cart,
    customer,
    stateList,
    countryList,
    regionList,
    checkoutAgreements,
    PhoneNumberCountryList,
    clicknCollectList,
    giftCardBalance,
    storeCreditBalance,
    cartselectedshippingmethod,
  };
}
