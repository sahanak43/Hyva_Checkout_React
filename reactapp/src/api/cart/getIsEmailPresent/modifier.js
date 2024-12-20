import { get as _get } from 'lodash-es';

export default function getIsEmailPresentModifier(result) {
  return _get(result, 'data.isEmailAvailable.is_email_available', {});
}
