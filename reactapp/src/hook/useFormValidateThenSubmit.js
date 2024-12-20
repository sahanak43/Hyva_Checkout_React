import { object as YupObject } from 'yup';

import { prepareFormSectionErrorMessage } from '../utils/form';
import { _isObjEmpty } from '../utils';

export default function useFormValidateThenSubmit({
  formId,
  formikData,
  submitHandler,
  validationSchema,
}) {
  const {
    setFieldTouched,
    formSectionErrors,
    formSectionValues,
    isFormSectionTouched,
  } = formikData || {};

  return async (...args) => {
    if (isFormSectionTouched && !_isObjEmpty(formSectionErrors)) {
      prepareFormSectionErrorMessage(
        formId,
        formSectionErrors,
        setFieldTouched
      );
    }
    try {
      const validationRules = YupObject().shape(validationSchema);
      const isValid = await validationRules.validate(formSectionValues);
      if (isValid) {
        await submitHandler(...args);
      }
    } catch (e) {
      // console.log(e);
    }
  };
}
