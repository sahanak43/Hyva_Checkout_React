import {
  fetchCountryListRequest,
  fetchCountryStateListRequest,
  fetchCountryRegionRequest,
} from '../../../api';
import {
  ADD_COUNTRY_STATES,
  SET_COUNTRY_LIST,
  ADD_COUNTRY_REGION,
} from './type';

export async function fetchCountriesAction(dispatch) {
  try {
    const countryList = await fetchCountryListRequest(dispatch);

    dispatch({
      type: SET_COUNTRY_LIST,
      payload: countryList,
    });
  } catch (error) {
    // @todo show error message
    console.error(error);
  }
}

export async function fetchCountryStatesAction(dispatch, countryId) {
  try {
    const stateList = await fetchCountryStateListRequest(dispatch, countryId);

    dispatch({
      type: ADD_COUNTRY_STATES,
      payload: { [countryId]: stateList },
    });

    return stateList;
  } catch (error) {
    // @todo show error message
    console.error(error);
    return {};
  }
}

// inorder to pass the region_if to backend we can use this
export async function fetchCountryRegionAction(dispatch) {
  try {
    const regionList = await fetchCountryRegionRequest(dispatch, 813);
    dispatch({
      type: ADD_COUNTRY_REGION,
      payload: { region_id: regionList },
    });
  } catch (error) {
    // @todo show error message
    console.error(error);
  }
}
