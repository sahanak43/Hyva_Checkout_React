import { get as _get } from 'lodash-es';

export default function fetchCountryPhoneNumberListModifier(result) {
  return _get(result, 'data.phone_no_country_code', []).map((phone) => ({
    value: phone.value,
    label: phone.label,
  }));
}
