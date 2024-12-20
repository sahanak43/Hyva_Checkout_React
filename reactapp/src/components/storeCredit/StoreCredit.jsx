import React from 'react';

import StoreCreditMemorized from './StoreCreditMemorized';
import { STORE_CREDIT_FORM } from '../../config';
import useFormikMemorizer from '../../hook/useFormikMemorizer';

function StoreCredit() {
  const storeCreditFormikData = useFormikMemorizer(STORE_CREDIT_FORM);

  return <StoreCreditMemorized formikData={storeCreditFormikData} />;
}

export default StoreCredit;
