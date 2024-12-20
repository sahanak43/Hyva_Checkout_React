import React, { useState } from 'react';
import { get as _get } from 'lodash-es';
import { ErrorMessage, Field } from 'formik';
import { arrayOf, bool, shape, string } from 'prop-types';

import { __ } from '../../../i18n';
import { _replace } from '../../../utils';
import { formikDataShape } from '../../../utils/propTypes';

function SelectInput({
  id,
  name,
  label,
  options,
  helpText,
  required,
  isHidden,
  formikData,
  placeholder,
  labelClassName,
  showCityOption,
  defaultValue,
  isClicknCollect,
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
  const hasFieldTouched = !!_get(formSectionTouched, relativeFieldName);
  const hasError = hasFieldError && hasFieldTouched;
  const value = _get(formSectionValues, relativeFieldName, '') || '';

  const [focused, setFocused] = useState(false);
  const handleFocus = () => {
    setFocused(true);
  };
  const handleBlur = () => {
    if (!value) {
      setFocused(false);
    }
  };

  return (
    <div className={`form-control font-gotham ${isHidden ? 'hidden' : ''}`}>
      <div className="relative flex items-center justify-between">
        <label
          htmlFor={inputId}
          className={`text-base  text-customGray left-3.5 top-5.5 absolute transition-all duration-500 ${
            focused || value
              ? 'top-[-10px]  text-xs  bg-white focus:outline-none border-lightGrey p-1'
              : ' top-3  text-base'
          } `}
        >
          {label}
          {required && <sup className="text-red-500"> *</sup>}
        </label>
      </div>
      <Field
        as="select"
        name={name}
        value={value}
        {...(isClicknCollect ? { defaultValue } : {})}
        id={inputId}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full p-2 border form-select xs:block max-w-md ${
          hasError ? 'border-dashed border-red-500' : ''
        }`}
        onChange={(event) => {
          const newValue = event.target.value;
          setFieldTouched(name, newValue);
          setFieldValue(name, newValue);
        }}
        {...rest}
      >
        {showCityOption && !isClicknCollect && (
          <option className="hidden" value="">
            {__('')}
          </option>
        )}
        {isClicknCollect && (
          <option className="" value="pickupLocation">
            {__('Select a pickup Location')}
          </option>
        )}
        {!isClicknCollect &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        {isClicknCollect && (
          <>
            <optgroup label="Stores">
              {options
                .filter((option) => !option.is_warehouse)
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Warehouse">
              {options
                .filter((option) => option.is_warehouse)
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
          </>
        )}
      </Field>
      <div
        id={`${inputId}-feedback`}
        className={`feedback text-sm md:text-xs text-left ${
          hasError ? 'text-red-500' : 'text-green-500'
        }`}
      >
        <ErrorMessage name={name}>
          {(msg) => msg?.replace('%1', 'This')}
        </ErrorMessage>
      </div>
      <div className="text-xs" id={`${inputId}-help`} tabIndex="-1">
        {helpText}
      </div>
    </div>
  );
}

SelectInput.propTypes = {
  id: string,
  required: bool,
  isHidden: bool,
  helpText: string,
  isClicknCollect: bool,
  defaultValue: string,
  placeholder: string,
  name: string.isRequired,
  label: string,
  formikData: formikDataShape.isRequired,
  options: arrayOf(
    shape({
      value: string,
      options: string,
    })
  ),
  labelClassName: string,
  showCityOption: bool,
};

SelectInput.defaultProps = {
  id: '',
  options: [],
  helpText: '',
  label: '',
  required: false,
  placeholder: '',
  defaultValue: '',
  isHidden: false,
  labelClassName: '',
  isClicknCollect: false,
  showCityOption: true,
};

export default SelectInput;
