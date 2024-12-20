import modifier from './modifier';
import sendRequest from '../../sendRequest';
import { IS_EMAIL_PRESENT } from './query';

export default async function getIsEmailPresent(dispatch, email) {
  const variables = { email };
  return modifier(
    await sendRequest(dispatch, {
      query: IS_EMAIL_PRESENT,
      variables,
    })
  );
}
