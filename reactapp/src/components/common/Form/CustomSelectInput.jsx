/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { ErrorMessage } from 'formik';
import { get as _get } from 'lodash-es';
import { arrayOf, bool, shape, string } from 'prop-types';

import { __ } from '../../../i18n';
import { _replace } from '../../../utils';
import { formikDataShape } from '../../../utils/propTypes';

function CustomSelectInput({
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
  const [searchQuery, setSearchQuery] = useState('');
  const [displayValue, setDisplayValue] = useState(''); // State for the display value
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const allowedRegex = /^[a-zA-Z0-9 ,\-'\u0600-\u06FF]{1,28}$/;

  useEffect(() => {
    if (value && !options.some((option) => option.value === value)) {
      setSearchQuery(value);
    }
  }, [value, options]);

  useEffect(() => {
    const initialOption = options.find((option) => option.value === value);

    if (initialOption) {
      setDisplayValue(initialOption.label);
    } else if (value) {
      // Set the display value to the value itself if it exists but is not in the options list
      setDisplayValue(value);
    } else {
      // Optional: Set a fallback display value when there's no match
      setDisplayValue('');
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFocused(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setSearchQuery('');
    setFocused(true);
    setDropdownOpen(true);
  };

  const handleBlur = () => {
    setFocused(false);
    setDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const existingOption = options.find(
        (option) => option.label === searchQuery
      );
      if (existingOption) {
        setFieldValue(name, existingOption.value);
        setDisplayValue(existingOption.label);
      } else {
        setFieldValue(name, searchQuery);
        setDisplayValue(searchQuery);
      }
      setFieldTouched(name, true);
      setSearchQuery('');
      setDropdownOpen(false);
      e.preventDefault(); // Prevent form submission or default behavior
    }
  };

  const handleSearchQueryChange = (e) => {
    const newValue = e.target.value;

    // Allow clearing the input (empty value)
    if (newValue === '' || allowedRegex.test(newValue)) {
      setSearchQuery(newValue);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`form-control font-gotham max-lg:text-sm ${isHidden ? 'hidden' : ''}`}
      ref={dropdownRef}
    >
      <div className="relative flex items-center justify-between">
        <label
          htmlFor={inputId}
          className={`text-base text-customGray left-3.5 top-5.5 absolute transition-all duration-500 z-20 max-lg:text-sm ${
            focused || value
              ? 'top-[-10px] text-xs bg-white focus:outline-none border-lightGrey p-1 max-lg:text-[13px]'
              : 'top-3 text-base max-lg:text-[13px]'
          } `}
        >
          {label}
          {required && <sup className="text-red-500"> *</sup>}
        </label>
      </div>
      <div className="relative">
        <div
          className={`w-full p-2 border xs:block max-w-md`}
          onClick={handleFocus}
        >
          <input
            type="text"
            // placeholder={placeholder || label}
            // value={
            //   filteredOptions.find((opt) => opt.value === value)?.label ||
            //   searchQuery ||
            //   ''
            // }
            value={displayValue}
            readOnly
            className="w-full p-1 border-none bg-transparent max-lg:text-[13px]"
            onKeyDown={handleKeyDown}
          />
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-y-auto">
            <input
              type="text"
              placeholder={__('Search...')}
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="w-full p-2 border-b"
              onKeyDown={handleKeyDown}
            />
            {showCityOption && (
              <div
                className="p-2 cursor-pointer hover:bg-gray-100 hidden"
                onClick={() => {
                  setFieldValue(name, '');
                  setFieldTouched(name, true);
                  setSearchQuery('');
                  setDropdownOpen(false);
                }}
              >
                {__('City')}
              </div>
            )}
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setFieldValue(name, option.value);
                  setFieldTouched(name, true);
                  setDisplayValue(option.label);
                  setSearchQuery('');
                  setDropdownOpen(false);
                  setFieldTouched(name, true);
                  setFieldValue(name, option.value);
                }}
              >
                {option.label}
              </div>
            ))}
            {searchQuery &&
              !filteredOptions.some(
                (option) => option.label === searchQuery
              ) && (
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setFieldValue(name, searchQuery);
                    setFieldTouched(name, true);
                    setSearchQuery('');
                    setDropdownOpen(false);
                  }}
                >
                  {searchQuery}
                </div>
              )}
          </div>
        )}
        <div
          id={`${inputId}-feedback`}
          className={`feedback text-sm md:text-xs text-left ${
            hasError ? 'text-red-500' : 'text-green-500'
          }`}
        >
          <ErrorMessage name={name}>
            {(msg) => msg.replace('%1', label)}
          </ErrorMessage>
        </div>
      </div>
      <div className="text-xs" id={`${inputId}-help`} tabIndex="-1">
        {helpText}
      </div>
    </div>
  );
}

CustomSelectInput.propTypes = {
  id: string,
  required: bool,
  isHidden: bool,
  helpText: string,
  placeholder: string,
  name: string.isRequired,
  label: string.isRequired,
  formikData: formikDataShape.isRequired,
  options: arrayOf(
    shape({
      value: string,
      label: string,
    })
  ),
  labelClassName: string,
  showCityOption: bool,
};

CustomSelectInput.defaultProps = {
  id: '',
  options: [],
  helpText: '',
  required: false,
  placeholder: '',
  isHidden: false,
  labelClassName: '',
  showCityOption: true,
};

export default CustomSelectInput;
