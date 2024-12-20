import React from 'react';

import StoreCreditForm from './components/StoreCreditForm';
import StoreCreditFormikManager from './components/StoreCreditFormikManager';
import { formikDataShape } from '../../utils/propTypes';

const StoreCreditMemorized = React.memo(({ formikData }) => (
  <StoreCreditFormikManager formikData={formikData}>
    <StoreCreditForm />
  </StoreCreditFormikManager>
));

StoreCreditMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default StoreCreditMemorized;
