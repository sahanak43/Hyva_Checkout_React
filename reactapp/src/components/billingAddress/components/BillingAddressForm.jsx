/* eslint-disable */
import React, { useState, useEffect } from 'react';

import { SaveButton } from '../../address';
import TextInput from '../../common/Form/TextInput';
import SelectInput from '../../common/Form/SelectInput';
import CustomSelectInput from '../../common/Form/CustomSelectInput';
import CancelButton from './billingAddressForm/CancelButton';
import SaveInBookCheckbox from '../../address/components/SaveInBookCheckbox';
import { __ } from '../../../i18n';
import { _keys } from '../../../utils';
import LocalStorage from '../../../utils/localStorage';
import { isValidCustomerAddressId } from '../../../utils/address';
import useCountryState from '../../address/hooks/useCountryState';
import useAddressWrapper from '../../address/hooks/useAddressWrapper';
import useBillingAddressAppContext from '../hooks/useBillingAddressAppContext';
import useFormValidateThenSubmit from '../../../hook/useFormValidateThenSubmit';
import useBillingAddressFormikContext from '../hooks/useBillingAddressFormikContext';
// import phoneCountryCode from '../../../api/cart/phoneCountryCode/phoneCountryCode';
import useCartContext from '../../../hook/useCartContext';
import useAppContext from '../../../hook/useAppContext';

function BillingAddressForm() {
  const [isValid, setIsValid] = useState(false);
  const [dynamicCity, setDynamicCity] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const {
    fields,
    formId,
    viewMode,
    formikData,
    submitHandler,
    handleKeyDown,
    billingValues,
    isBillingSame,
    setFieldValue,
    setIsNewAddress,
    selectedAddress,
    setFieldTouched,
    validationSchema,
    setSelectedAddress,
  } = useBillingAddressFormikContext();
  const { isLoggedIn } = useBillingAddressAppContext();
  const { reCalculateMostRecentAddressOptions } = useAddressWrapper();
  const formSubmitHandler = useFormValidateThenSubmit({
    formId,
    formikData,
    submitHandler,
    validationSchema,
  });
  const { countryOptions, stateOptions, hasStateOptions } = useCountryState({
    fields,
    formikData,
  });
  const { selectedCountry, isBillingAddressTouched } = formikData;
  const { cart } = useCartContext();
  const { phone_no_country_code: countryCode = [] } = cart;
  const filteredCountryCode = countryCode.filter(
    (option) => option.value !== 'city'
  );
  const element = document.getElementById('react-checkout');
  const configData = JSON.parse(element.getAttribute('data-checkout_config'));
  const address_cities = configData.address_cities
    ? JSON.parse(configData.address_cities)
    : {};

  // useEffect(() => {
  //   if (
  //     formikData?.formSectionValues?.phone_no_country_code === undefined ||
  //     filteredCountryCode.length
  //   ) {
  //     const InitailVAlue = {
  //       target: {
  //         value: filteredCountryCode[0]?.value,
  //       },
  //     };
  //     // Call the handlePhoneCountryCode function with the synthetic event
  //     handlePhoneCountryCode(InitailVAlue);
  //   }
  // }, [
  //   formikData?.formSectionValues?.phone_no_country_code,
  //   filteredCountryCode,
  // ]);
  useEffect(() => {
    if (
      formikData?.formSectionValues?.region !== undefined &&
      formikData?.formSectionValues?.region !== ''
    ) {
      const initialVal = formikData.formSectionValues.region;

      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          value: initialVal,
        },
      };

      // Call the handleRegionChange function with the synthetic event
      handRegionChangeIntial(syntheticEvent);
    }
  }, [formikData?.formSectionValues?.region]);
  const { regionList } = useAppContext();
  const handRegionChangeIntial = (event) => {
    const newValue = event.target.value;
    setFieldValue(fields.region, newValue);
    setFieldTouched(fields.region, newValue);
    const selectedOption = stateOptions.find(
      (option) => option.value === newValue
    );

    if (selectedOption) {
      const regionIdState = selectedOption.id;
      const filtered = regionList.filter(
        (region) => region.regionId === regionIdState
      );
      const filteredWithValues = filtered.map((region) => ({
        ...region, // spread the existing fields
        value: region.name,
        label: region.name, // add the new field with the value equal to the name
      }));
      setDynamicCity(filteredWithValues);
      // setFilteredRegions(filtered);
    }
  };

  // this has been commented as because instead of using query to get cities, we are achieving it through react-checkout_config attribute.

  // const handleRegionChange = (event) => {
  //   const newValue = event.target.value;
  //   setFieldValue(fields.region, newValue);
  //   setFieldTouched(fields.region, newValue);
  //   setFieldValue(fields.city, '');
  //   const selectedOption = stateOptions.find(
  //     (option) => option.value === newValue
  //   );

  //   if (selectedOption) {
  //     const regionIdState = selectedOption.id;
  //     const filtered = regionList.filter(
  //       (region) => region.regionId === regionIdState
  //     );
  //     const filteredWithValues = filtered.map((region) => ({
  //       ...region, // spread the existing fields
  //       value: region.name,
  //       label: region.name, // add the new field with the value equal to the name
  //     }));
  //     setDynamicCity(filteredWithValues);
  //     // setFilteredRegions(filtered);
  //   }
  // };

  const handleCityChange = (event) => {
    const newValue = event.target.value;
    setFieldValue(fields.region, newValue);
    setFieldTouched(fields.region, newValue);
    setFieldValue(fields.city, '');
    const selectedOption = stateOptions.find(
      (option) => option.value === newValue
    );

    if (selectedOption) {
      const regionIdState = selectedOption.id;
      const cities = address_cities[regionIdState];
      if (cities) {
        // Format cities for SelectInput
        const filteredCities = cities.map((city) => ({
          value: city,
          label: city,
        }));
        setFilteredCities(filteredCities);
      }
    }
  };

  useEffect(() => {
    if (
      formikData?.formSectionValues?.phone_no_country_code === '' &&
      filteredCountryCode.length
    ) {
      // Check if the current value is not already the desired value
      const currentPhoneNoCountryCode =
        formikData?.formSectionValues?.phone_no_country_code;
      const newPhoneNoCountryCode = filteredCountryCode[0].value;

      if (currentPhoneNoCountryCode !== newPhoneNoCountryCode) {
        setFieldTouched(fields.phone_no_country_code, true);
        setFieldValue(fields.phone_no_country_code, newPhoneNoCountryCode);
      }
    }
    // Explicitly ensure that this effect doesn't depend on formikData unnecessarily
  }, []);

  const handlePhoneCountryCode = (e) => {
    const value = e.target.value;
    setFieldTouched(fields.phone_no_country_code, value);
    setFieldValue(fields.phone_no_country_code, value);
  };
  const saveAddressAction = async () => {
    let newAddressId = selectedAddress;
    // Updating mostRecentAddressList in prior to form submit; Because values
    // there would be used in the submit action if the address is from
    // mostRecentAddressList.
    if (isLoggedIn) {
      if (isValidCustomerAddressId(selectedAddress)) {
        // This means a customer address been edited and now changed and submitted.
        // So treat this as a new address;
        const recentAddressList = LocalStorage.getMostRecentlyUsedAddressList();
        newAddressId = `new_address_${_keys(recentAddressList).length + 1}`;
        LocalStorage.addAddressToMostRecentlyUsedList(
          billingValues,
          newAddressId
        );
        if (!formikData.formSectionErrors) {
          const event = new CustomEvent('modalToggleBilling', {
            detail: false,
          });
          window.dispatchEvent(event);
        }
      } else {
        LocalStorage.updateMostRecentlyAddedAddress(
          newAddressId,
          billingValues
        );
      }
    }

    if (!formikData.formSectionErrors) {
      const event = new CustomEvent('modalToggleBilling', {
        detail: false,
      });
      window.dispatchEvent(event);
    }

    await formSubmitHandler(newAddressId);

    if (!isLoggedIn) {
      return;
    }
    //had added if condition to solve default hyva issue - > only saves when there are no error
    if (!formikData.formSectionErrors) {
      setIsNewAddress(false);
      setSelectedAddress(newAddressId);
      LocalStorage.saveCustomerAddressInfo(newAddressId, isBillingSame, false);
      reCalculateMostRecentAddressOptions();
    }
  };

  const handleCountryChange = (event) => {
    const newValue = event.target.value;
    setFieldTouched(fields.country, newValue);
    setFieldValue(fields.country, newValue);
    // when country is changed, then always reset region field.
    setFieldValue(fields.region, '');
  };

  if (isLoggedIn) {
    useEffect(() => {
      if (formikData.formSectionValues) {
        const valid = formikData.formSectionValues;
        if (
          valid.firstname.length ||
          valid.lastname.length ||
          valid.city.length ||
          valid.phone.length ||
          valid.region.length ||
          valid.street[0].length
        ) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      }
    }, [formikData.formSectionValues]);
  }

  if (viewMode) {
    return null;
  }

  return (
    <>
      <div className=" mt-2.5 py-2 b-2 border-lightGrey">
        <div className="flex max-lg:block max-lg:mb-4">
          <div className="pr-2.5 w-1/2 mb-5 max-lg:w-full max-lg:p-0 max-lg:mb-4">
            <TextInput
              required
              name={fields.firstname}
              formikData={formikData}
              label={__('First Name')}
              onKeyDown={handleKeyDown}
              className="border-lightGrey flex-1 max-lg:text-[13px]"
            />
          </div>
          <div className="pl-2.5 w-1/2 max-lg:w-full max-lg:p-0">
            <TextInput
              required
              name={fields.lastname}
              label={__('Last name')}
              formikData={formikData}
              onKeyDown={handleKeyDown}
              className="border-lightGrey max-lg:text-[13px]"
            />
          </div>
        </div>
        <div className="flex  mb-5 max-lg:mb-4">
          <div className="w-full">
            <TextInput
              required
              label={__('Address')}
              formikData={formikData}
              onKeyDown={handleKeyDown}
              name={`${fields.street}[0]`}
              className="border-lightGrey max-lg:text-[13px]"
            />
          </div>
          {/* <div className="pl-2.5 w-1/2">
            <TextInput
              required
              placeholder=""
              name={fields.zipcode}
              formikData={formikData}
              label={__('Street Address: Line 2')}
              onKeyDown={handleKeyDown}
              className="border-lightGrey"
            />
          </div> */}
        </div>
        <div className="flex max-lg:block max-lg:mb-4">
          <div className="hidden">
            <SelectInput
              required
              label={__('')}
              name={fields.country}
              formikData={formikData}
              options={countryOptions}
              onChange={handleCountryChange}
              className="h-50px w-full border-lightGrey w-[27rem] max-lg:text-[13px]"
            />
          </div>
          <div className="pr-2.5 w-1/2 mb-5 max-lg:w-full max-lg:p-0 max-lg:mb-4">
            <SelectInput
              required
              label={__('State')}
              name={fields.region}
              options={stateOptions}
              formikData={formikData}
              className="h-50px w-full border-lightGrey w-[27rem] max-lg:w-full max-lg:text-[13px]"
              isHidden={!selectedCountry || !hasStateOptions}
              // onChange={handleRegionChange}
              onChange={handleCityChange}
            />
          </div>
          <div className="pl-2.5 w-1/2 max-lg:w-full max-lg:p-0">
            {/* <TextInput
              required
              label={__('Area')}
              name={fields.city}
              formikData={formikData}
              placeholder={__('')}
              onKeyDown={handleKeyDown}
              className="border-lightGrey w-1/2"
            /> */}
            <CustomSelectInput
              required
              label={__('City')}
              name={fields.city}
              formikData={formikData}
              // options={dynamicCity}
              options={filteredCities}
              // onChange={handleCountryChange}
              className="h-50px w-full border-lightGrey w-[27rem] max-lg:w-full max-lg:text-[13px]"
            />
          </div>
        </div>

        <div className="flex relative">
          <div className="pr-2.5">
            <SelectInput
              // label={__('Country Code')}
              // value={formikData}
              name={fields.phone_no_country_code}
              options={filteredCountryCode}
              onChange={handlePhoneCountryCode}
              formikData={formikData}
              className="w-[136px] border-lightGrey h-[50px] max-lg:text-[13px]"
              labelClassName="text-xs font-medium text-customGray absolute top-[-7px] bg-white left-[15px] px-0.5"
              showCityOption={false}
              value={filteredCountryCode[0]?.value}
            />
          </div>
          <div className="pl-2.5 w-full">
            <TextInput
              required
              label={__('Phone Number')}
              name={fields.phone}
              formikData={formikData}
              onKeyDown={handleKeyDown}
              type="number"
              placeholder={__('')}
              className="border-lightGrey max-lg:text-[13px]"
            />
          </div>
        </div>
        <SaveInBookCheckbox fields={fields} formikData={formikData} />
      </div>

      <div className="flex justify-end gap-[20px] mt-2">
        <CancelButton />
        {isLoggedIn ? (
          <SaveButton
            // isFormValid={isBillingAddressTouched}
            isFormValid={isValid}
            actions={{ saveAddress: saveAddressAction }}
          />
        ) : (
          <SaveButton
            isFormValid={isBillingAddressTouched}
            actions={{ saveAddress: saveAddressAction }}
          />
        )}
      </div>
    </>
  );
}

export default BillingAddressForm;
