export const PHONE_NUMBER_COUNTRY_CODE_QUERY_PART = `
phone_no_country_code {
    value
    label
  }
`;

export const GET_PHONE_NUMBER_CODE_QUERY = `
query getPhoneNumberCodeQuery {
    ${PHONE_NUMBER_COUNTRY_CODE_QUERY_PART}
}
`;
