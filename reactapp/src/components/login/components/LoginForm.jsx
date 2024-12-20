import React, { useState, useEffect, useRef } from 'react';
import { get as _get } from 'lodash-es';
import Button from '../../common/Button';
import TextInput from '../../common/Form/TextInput';
import { __ } from '../../../i18n';
import useLoginFormContext from '../hooks/useLoginFormContext';
import useFormValidateThenSubmit from '../../../hook/useFormValidateThenSubmit';
import useCartContext from '../../../hook/useCartContext';
// import helperVector from '../../../assests/Vector.svg';
import { VectorIcon } from '../../assests';

function LoginForm() {
  const {
    fields,
    formId,
    editMode,
    formikData,
    submitHandler,
    handleKeyDown,
    loginFormValues,
    validationSchema,
    formSectionTouched,
  } = useLoginFormContext();
  const isEmailTouched = _get(formSectionTouched, 'email') || false;
  const customerWantsToSignIn = loginFormValues?.customerWantsToSignIn;
  const disableButton = customerWantsToSignIn
    ? !formSectionTouched
    : !isEmailTouched;
  const handleButtonClick = useFormValidateThenSubmit({
    formId,
    formikData,
    submitHandler,
    validationSchema,
  });
  const { cart } = useCartContext();
  const { isEmailAvailable } = cart;
  const [showHelperMessage, setShowHelperMessage] = useState(false);
  const helperMessageRef = useRef(null);
  const iconRef = useRef(null);

  const handleIconClick = (event) => {
    event.stopPropagation();
    setShowHelperMessage(!showHelperMessage);
  };

  const handleClickOutside = (event) => {
    // Check if the click is outside the helper message and the icon
    if (
      helperMessageRef.current &&
      !helperMessageRef.current.contains(event.target) &&
      iconRef.current &&
      !iconRef.current.contains(event.target)
    ) {
      setShowHelperMessage(false); // Close the message if clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!editMode) {
    return null;
  }

  return (
    <div className="py-2.5 ">
      <div className="mb-5">
        <div className="flex gap-2.5 items-center">
          <TextInput
            required
            type="email"
            label={__('Email Address')}
            name={fields.email}
            formikData={formikData}
            onKeyDown={handleKeyDown}
            customClass="w-full max-w-[23rem]"
            // className="text-customGray border-lightGrey h-50px "
            placeholder={__('')}
            // onChange={handleEmailChange}
            className="max-lg:text-[13px]"
          />
          <div ref={iconRef}>
            {' '}
            <VectorIcon
              className="hover:text-black cursor-pointer text-mildGrey max-lg:hidden"
              alt="helper icon"
              onClick={handleIconClick}
            />
          </div>
        </div>
        {showHelperMessage && (
          <div ref={helperMessageRef} className="relative">
            {/* Tooltip Box */}
            <div className="bg-mildCement border font-gotham tracking-wide border-gray-600 p-3 text-sm w-[273px] absolute left-[26rem] top-[-40px] text-black z-10">
              {__('We will send your order confirmation here.')}
            </div>

            {/* Tooltip Arrow */}
            <div
              className="absolute before:border-r-[#666]"
              style={{
                border: '12px solid transparent',
                borderRightColor: '#f4f4f4',
                // borderRightColor: '#666',
                height: '0',
                width: '1px',
                left: '55%',
                top: '-35px',
                zIndex: 3,
              }}
            />
          </div>
        )}
        {isEmailAvailable && (
          <p className="text-sm mt-2.5 tracking-wider font-gotham max-lg:text-[13px]">
            {__('You can create an account after checkout.')}
          </p>
        )}
      </div>

      {isEmailAvailable === false && (
        <div>
          <TextInput
            type="password"
            autoComplete="on"
            label={__('Password')}
            name={fields.password}
            formikData={formikData}
            onKeyDown={handleKeyDown}
            placeholder={__('')}
            className="w-full max-w-[23rem]"
          />
          <p className="text-sm mt-2.5 font-gotham tracking-wider mb-5 pt-1.5 max-lg:text-[13px]">
            {__(
              'You already have an account with us. Sign in or continue as guest.'
            )}
          </p>
        </div>
      )}

      <div className="flex items-center justify-flex-start mt-[7px]">
        {isEmailAvailable === false && (
          <>
            <div>
              <Button
                variant="primary"
                className="h-[35px] px-4"
                disable={disableButton}
                click={handleButtonClick}
                style={{ height: '35px' }}
              >
                <span className="text-sm font-gotham tracking-wider relative top-[-2px]">
                  {__('Login')}
                </span>
              </Button>
            </div>
            <div className="font-gotham text-sm mx-2.5 tracking-wider ">
              <a href="/customer/account/forgotpassword">
                <p className="text-textBlue hover:underline font-gotham font-light">
                  {__('Forgot Your Password?')}
                </p>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
