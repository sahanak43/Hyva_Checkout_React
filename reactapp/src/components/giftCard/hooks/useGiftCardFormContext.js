import { useContext } from 'react';

import { GiftCardFormikContext } from '../context/index';

export default function useGiftCardFormContext() {
  return useContext(GiftCardFormikContext);
}
