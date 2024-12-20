import sendRequest from '../../sendRequest';
import { VALIDATE_MERCHANT } from './mutation';

export default async function getValidateMerchant(dispatch) {
  try {
    const res = await sendRequest(dispatch, {
      query: VALIDATE_MERCHANT,
    });
    const {
      data: {
        validateCheckoutComApplePay: { response },
      },
    } = res;

    return JSON.parse(response);
  } catch (e) {
    console.error(e);
    return {};
  }
}
