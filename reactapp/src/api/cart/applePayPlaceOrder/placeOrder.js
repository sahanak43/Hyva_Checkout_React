import sendRequest from '../../sendRequest';
import { APPLE_PAY_MUTATION } from './mutation';

export default async function placeOrderApple(dispatch, variables) {
  console.log(dispatch, variables);

  try {
    const res = await sendRequest(dispatch, {
      query: APPLE_PAY_MUTATION,
      variables,
    });
    console.log(res, 'res');

    return res;
  } catch (e) {
    console.error(e, '>>>>>>');
    return {};
  }
}
