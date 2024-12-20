import React, { useState, useEffect, useMemo } from 'react';
import { Form } from 'formik';
import { node } from 'prop-types';
import { StoreCreditFormikContext } from '../context';
import { useCheckoutFormContext } from '../../../hook';
import useFormSection from '../../../hook/useFormSection';
import { formikDataShape } from '../../../utils/propTypes';
import { STORE_CREDIT_FORM } from '../../../config';

const defaultValues = {
  storeCreditApplied: false,
  isStoreCreditChecked: false,
};

const formSubmit = () => {};

function StoreCreditFormikManager({ children, formikData }) {
  const [initialValues, setInitialValues] = useState(defaultValues);
  const { aggregatedData } = useCheckoutFormContext(); // Use context for cart data
  const { storeCredit } = aggregatedData?.cart || {}; // Get store credit info from the cart

  useEffect(() => {
    if (storeCredit) {
      setInitialValues({
        ...defaultValues,
        storeCreditApplied: storeCredit.applied || false, // Set initial state based on cart data
      });
    }
  }, [storeCredit]);

  const formContext = useFormSection({
    formikData,
    initialValues,
    id: STORE_CREDIT_FORM,
    submitHandler: formSubmit,
  });

  const context = useMemo(
    () => ({ ...formContext, ...formikData, formikData }),
    [formContext, formikData]
  );

  return (
    <StoreCreditFormikContext.Provider value={context}>
      <Form id={STORE_CREDIT_FORM}>{children}</Form>
    </StoreCreditFormikContext.Provider>
  );
}

StoreCreditFormikManager.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default StoreCreditFormikManager;
