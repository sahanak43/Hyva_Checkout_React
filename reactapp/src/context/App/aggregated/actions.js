import { AGGREGATED_APP_DATA } from './types';

export async function storeAggregatedAppStatesAction(dispatch, data) {
  const {
    customer,
    countryList,
    checkoutAgreements,
    stateList,
    regionList,
    clicknCollectList,
    cartselectedshippingmethod,
  } = data;

  return dispatch({
    type: AGGREGATED_APP_DATA,
    payload: {
      ...customer,
      stateList,
      countryList,
      regionList,
      checkoutAgreements,
      clicknCollectList,
      cartselectedshippingmethod,
    },
  });
}
