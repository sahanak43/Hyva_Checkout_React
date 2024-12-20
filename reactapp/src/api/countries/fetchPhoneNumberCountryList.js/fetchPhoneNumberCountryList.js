import modifier from './modifier';
import sendRequest from '../../sendRequest';
import { GET_PHONE_NUMBER_CODE_QUERY } from './query';

export default  async function fetchCountryPhoneNumberList(dispatch) {
    return modifier(
        await sendRequest(dispatch, { query: GET_PHONE_NUMBER_CODE_QUERY})
    );
}