import React from 'react';

import GiftCardMemorized from './GiftCardMemorized';
import { GIFT_CARD_FORM } from '../../config';
import useFormikMemorizer from '../../hook/useFormikMemorizer';

function GiftCard() {
  const giftCardFormikData = useFormikMemorizer(GIFT_CARD_FORM);

  return <GiftCardMemorized formikData={giftCardFormikData} />;
}

export default GiftCard;
