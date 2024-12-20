import { get as _get } from 'lodash-es';

export default function fetchCountryRegionModifier(response) {
  const regions = _get(response, 'data.cities', []) || [];
  return regions.map((region) => ({
    id: region.id,
    regionId: region.region_id, // Explicitly map region_id to regionId
    name: region.name,
  }));
}
