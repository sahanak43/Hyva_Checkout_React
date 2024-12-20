export const COUNTRY_REGION_LIST_QUERY_PART = `
    cities(region_id: $region_id) {
        id
        region_id
        name
    }
`;

export const COUNTRY_REGION_LIST_QUERY = `
query getRegionCityList($region_id: Int){
    ${COUNTRY_REGION_LIST_QUERY_PART}
}`;
