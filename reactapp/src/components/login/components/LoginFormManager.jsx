import React, { useEffect, useState, useCallback } from 'react';
import { Form } from 'formik';
import { node } from 'prop-types';
import { get as _get } from 'lodash-es';
import { string as YupString, bool as YupBool } from 'yup';
import { debounce } from 'lodash';

import { __ } from '../../../i18n';
import { LOGIN_FORM } from '../../../config';
import useFormSection from '../../../hook/useFormSection';
import LoginFormContext from '../context/LoginFormContext';
import { formikDataShape } from '../../../utils/propTypes';
import useFormEditMode from '../../../hook/useFormEditMode';
import useLoginAppContext from '../hooks/useLoginAppContext';
import useLoginCartContext from '../hooks/useLoginCartContext';
import useEnterActionInForm from '../../../hook/useEnterActionInForm';
import useCheckoutFormContext from '../../../hook/useCheckoutFormContext';

const defaultValues = {
  email: '',
  password: '',
  customerWantsToSignIn: false,
};

const validationSchema = {
  customerWantsToSignIn: YupBool(),
  focusOut: YupBool(),
  email: YupString()
    .nullable()
    .required(__('Email is required'))
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co|info|biz|io|dev)$/,
      __('Please enter a valid email address (Ex: johndoe@domain.com).')
    ),
  password: YupString().test(
    'requiredIfSignIn',
    __('This is a required field'),
    (value, context) => {
      const sigInStatus = _get(context, 'parent.customerWantsToSignIn');

      if (sigInStatus) {
        return !!value;
      }

      return true;
    }
  ),
};

function LoginFormManager({ children, formikData }) {
  const [initialValues, setInitialValues] = useState(defaultValues);
  const { ajaxLogin, setPageLoader, setSuccessMessage, isLoggedIn } =
    useLoginAppContext();
  const { aggregatedData } = useCheckoutFormContext();
  const { setEmailOnGuestCart, getEmailIsPresent } = useLoginCartContext();
  const { editMode, setFormToEditMode, setFormToViewMode } = useFormEditMode();
  const {
    loginFormValues,
    setFieldTouched,
    formSectionTouched,
    formSectionErrors,
  } = formikData;
  const isEmailTouched = _get(formSectionTouched, 'email');
  const isEmailError = _get(formSectionErrors, 'email');

  // const { email: isEmailTouched } = formSectionTouched;
  /**
   *
   * Weather User is Having Or Not Is Checked Here
   *
   */
  // use bouncer method, so that as and when you type every single text in email field
  const handleIsUserPresent = useCallback(async () => {
    const email = _get(loginFormValues, 'email');
    try {
      setPageLoader(true);
      if (email !== '') {
        const data = await getEmailIsPresent(email);
        setPageLoader(false);
        if (data) {
          setInitialValues({
            ...initialValues,
            email,
            customerWantsToSignIn: false,
          });
          await setEmailOnGuestCart(email);
          // setSuccessMessage(__('Email address is saved.'));
          // setFormToViewMode();
          setFieldTouched(`${LOGIN_FORM}.email`, false);
          setPageLoader(false);
          return data;
        }
        if (!data) {
          setInitialValues({
            ...initialValues,
            email,
            customerWantsToSignIn: true,
          });
        }
        return data;
      }
      setPageLoader(false);
      return null;
    } catch (error) {
      setPageLoader(false);
      console.error(error);
      return null;
    }
  }, [loginFormValues, getEmailIsPresent, initialValues, setPageLoader]);

  const handleuserData = useCallback(() => {
    handleIsUserPresent();
  }, [handleIsUserPresent]);

  useEffect(() => {
    const debouncedHandleUserData = debounce(() => {
      if (isEmailTouched && !isEmailError) {
        handleuserData();
        // setIsEmailTouched(false);
      }
    }, 1500);

    debouncedHandleUserData();

    return () => {
      debouncedHandleUserData.cancel();
    };
  }, [isEmailTouched, isEmailError]);
  /**
   * Sign-in submit is handled here
   *
   * If user choose to continue as guest user, then attach the email address
   * provided to the cart.
   *
   * If user choose to login and proceed, then sign-in the user, then retrieve
   * customer cart details, then finally, merge the guest cart with the customer
   * cart.
   */
  const formSubmit = async () => {
    // setMessage(false);

    const email = _get(loginFormValues, 'email');
    const password = _get(loginFormValues, 'password');
    if (email !== '' && password !== '') {
      const customerWantsToSignIn = _get(
        loginFormValues,
        'customerWantsToSignIn'
      );

      try {
        setPageLoader(true);

        if (!customerWantsToSignIn) {
          await setEmailOnGuestCart(email);
          setSuccessMessage(__('Email address is saved.'));
          // setFormToViewMode();
          setFieldTouched(`${LOGIN_FORM}.email`, false);
          setPageLoader(false);
          return;
        }

        const loginData = await ajaxLogin({ username: email, password });

        if (loginData.errors) {
          // setErrorMessage(__(loginData.message || 'Login failed.'));
        } else {
          document.cookie = `mage-cache-sessid=true; path=/;`;
        }
        setPageLoader(false);
      } catch (error) {
        setPageLoader(false);
        console.error(error);
      }
    }
    // console.log('null');
  };

  const handleKeyDown = useEnterActionInForm({
    formikData,
    validationSchema,
    submitHandler: formSubmit,
  });

  const formSectionContext = useFormSection({
    formikData,
    initialValues,
    id: LOGIN_FORM,
    validationSchema,
    submitHandler: formSubmit,
  });

  useEffect(() => {
    if (isLoggedIn) {
      setFormToViewMode();
    }
  }, [setFormToViewMode, isLoggedIn]);

  // Update initialvalues based on the initial cart data fetch.
  useEffect(() => {
    if (aggregatedData) {
      const email = aggregatedData?.cart?.email || '';
      setInitialValues({ ...defaultValues, email });
    }
  }, [aggregatedData]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const context = {
    ...formikData,
    ...formSectionContext,
    editMode,
    formikData,
    handleKeyDown,
    setFormToEditMode,
  };

  return (
    <LoginFormContext.Provider value={context}>
      <Form id={LOGIN_FORM}>{children}</Form>
    </LoginFormContext.Provider>
  );
}

LoginFormManager.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default LoginFormManager;
