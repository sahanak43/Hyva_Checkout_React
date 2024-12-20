import modifier from './modifier';
import sendRequest from '../../sendRequest';
import { COUNTRY_REGION_LIST_QUERY } from './query';

/* eslint-disable camelcase */
export default async function fetchCountryRegion(dispatch, region_id) {
  /* eslint-disable camelcase */
  const variables = { region_id };

  return modifier(
    await sendRequest(dispatch, {
      query: COUNTRY_REGION_LIST_QUERY,
      variables,
    })
  );
}
