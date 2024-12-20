import React, { useState } from 'react';
import { get as _get } from 'lodash-es';
import { bool, string } from 'prop-types';
import { Field, ErrorMessage } from 'formik';
// import { Field } from 'formik';

import { _replace } from '../../../utils';
import { formikDataShape } from '../../../utils/propTypes';

function TextInput({
  id,
  name,
  type,
  label,
  width,
  disable,
  helpText,
  required,
  isHidden,
  customClass,
  className,
  formikData,
  placeholder,
  ...rest
}) {
  const {
    setFieldValue,
    formSectionId,
    setFieldTouched,
    formSectionErrors,
    formSectionValues,
    formSectionTouched,
  } = formikData;
  const inputId = id || name;
  const relativeFieldName = _replace(name, formSectionId).replace('.', '');
  const hasFieldError = !!_get(formSectionErrors, relativeFieldName);
  const value = _get(formSectionValues, relativeFieldName, '') || '';
  const hasFieldTouched = !!_get(formSectionTouched, relativeFieldName);
  const hasError = hasFieldError && hasFieldTouched;

  const [focused, setFocused] = useState(false);
  const handleFocus = () => {
    setFocused(true);
  };
  const handleBlur = () => {
    if (!value) {
      setFocused(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (type !== 'number') {
      setFieldTouched(name, newValue);
      setFieldValue(name, newValue);
    } else if (type === 'number') {
      const regex = /^(?!971)(?!0)\d{0,9}$/;
      if (regex.test(newValue)) {
        setFieldTouched(name, newValue);
        setFieldValue(name, newValue);
      }
    }
  };

  return (
    <div
      className={` form-control relative ${
        isHidden ? 'hidden' : ''
      } ${customClass}`}
    >
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-base  text-customGray left-3.5 top-5.5 absolute transition-all duration-500 max-lg:text-[13px] ${
              focused || value
                ? 'top-[-10px]  text-xs  bg-white focus:outline-none border-lightGrey p-1'
                : ' top-3  text-base'
            } `}
          >
            {label}
            {required && <sup className="text-red-500"> *</sup>}
          </label>
        )}
      </div>

      <Field
        name={name}
        id={inputId}
        value={value}
        disabled={disable}
        type={type || 'text'}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // onChange={(event) => {
        //   const newValue = event.target.value;
        //   setFieldTouched(name, newValue);
        //   setFieldValue(name, newValue);
        // }}
        onChange={handleChange}
        className={` border-lightGrey h-50px 
        } ${
          focused || value ? ' text-black' : ' text-customGray'
        } ${className} ${width || 'w-full'}`}
        {...rest}
      />
      <div
        className={`feedback text-sm md:text-xs text-left max-lg:text-xs max-lg:!text-left ${
          hasError ? 'text-red-500' : 'invisible'
        }`}
      >
        <ErrorMessage name={name}>
          {(msg) => msg.replace('%1', label)}
        </ErrorMessage>
      </div>
      <div className="text-xs">{helpText}</div>
    </div>
  );
}

TextInput.propTypes = {
  id: string,
  type: string,
  label: string,
  disable: bool,
  width: string,
  required: bool,
  isHidden: bool,
  helpText: string,
  className: string,
  placeholder: string,
  customClass: string,
  name: string.isRequired,
  formikData: formikDataShape.isRequired,
};

TextInput.defaultProps = {
  id: '',
  label: '',
  width: '',
  helpText: '',
  type: 'text',
  disable: false,
  className: '',
  required: false,
  placeholder: '',
  isHidden: false,
  customClass: '',
};

export default TextInput;
