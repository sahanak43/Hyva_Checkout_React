import React, { useState, useEffect, useMemo } from 'react';
import { Form } from 'formik';
import { node } from 'prop-types';
import { string as YupString } from 'yup';

import { _emptyFunc } from '../../../utils';
import { GIFT_CARD_FORM } from '../../../config';
import { GiftCardFormikContext } from '../context';
import { useCheckoutFormContext } from '../../../hook';
import useFormSection from '../../../hook/useFormSection';
import { formikDataShape } from '../../../utils/propTypes';

const defaultValues = {
  giftCardCode: '',
  appliedGiftCode: '',
};

const validationSchema = {
  giftCardCode: YupString()
    .nullable()
    // Enforcing this validation in order to avoid placing order upon pressing "enter"
    .test('makeFormInvalidIfInputPresent', '', (value, context) => {
      if (!value) {
        return true;
      }
      const appliedGiftCode = (
        context?.parent.appliedGiftCode || ''
      ).toLowerCase();
      return appliedGiftCode === value;
    }),
};

const formSubmit = _emptyFunc();

function GiftCardFormikManager({ children, formikData }) {
  const [initialValues, setInitialValues] = useState(defaultValues);
  const { aggregatedData } = useCheckoutFormContext();

  useEffect(() => {
    if (aggregatedData) {
      const { giftCard: appliedGiftCode } = aggregatedData?.cart || {};
      setInitialValues({
        ...defaultValues,
        giftCardCode: appliedGiftCode,
        appliedGiftCode:
          typeof appliedGiftCode === 'string'
            ? appliedGiftCode.toLowerCase()
            : '',
      });
    }
  }, [aggregatedData]);

  const formContext = useFormSection({
    formikData,
    initialValues,
    validationSchema,
    id: GIFT_CARD_FORM,
    submitHandler: formSubmit,
  });

  const context = useMemo(
    () => ({ ...formContext, ...formikData, formikData }),
    [formContext, formikData]
  );

  return (
    <GiftCardFormikContext.Provider value={context}>
      <Form id={GIFT_CARD_FORM}>{children}</Form>
    </GiftCardFormikContext.Provider>
  );
}

GiftCardFormikManager.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default GiftCardFormikManager;
