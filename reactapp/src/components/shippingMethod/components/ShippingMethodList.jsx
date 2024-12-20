/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// import { method } from 'lodash';
import RadioInput from '../../common/Form/RadioInput';
import SelectInput from '../../common/Form/SelectInput';
import { __ } from '../../../i18n';
import { _objToArray } from '../../../utils';
import { SHIPPING_METHOD } from '../../../config';
import useShippingMethodFormContext from '../hooks/useShippingMethodFormContext';
import useShippingMethodCartContext from '../hooks/useShippingMethodCartContext';
import useAppContext from '../../../hook/useAppContext';
import useCartContext from '../../../hook/useCartContext';
import MapComponent from '../../googleMapComponent/googleMapComponent';
import { method } from 'lodash';
import ToggleBox from '../../common/ToggleBox';

function ShippingMethodList({ methodRenderers }) {
  const {
    fields,
    submitHandler,
    formikData,
    setFieldValue,
    selectedMethod,
    setFieldTouched,
  } = useShippingMethodFormContext();

  const { methodsAvailable, methodList } = useShippingMethodCartContext();
  const { carrierCode: methodCarrierCode, methodCode: methodMethodCode } =
    selectedMethod || {};
  // if(selectedMethod?.carrierCode === 'homedelivery') {
  //   const event = new CustomEvent('isClicknCollectEvent', {
  //       detail: false, // Ensure detail matches the new state
  //     });
  //     window.dispatchEvent(event);
  // }

  const { cart } = useCartContext();
  const { cartselectedshippingmethod } = cart;

  useEffect(() => {
    // Define the event handler
    const handleEvent = (event) => {
      if (event.detail == true && !isClickAndCollectSelected) {
        handleShippingMethodSelection('homedelivery');
      }
    };

    // Add the event listener for the 'handleHomedeliveryMutation'
    window.addEventListener('handleHomedeliveryMutation', handleEvent);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('handleHomedeliveryMutation', handleEvent);
    };
  });
  useEffect(() => {
    const test = localStorage.getItem('isClickAndCollect');
    if (selectedMethod?.carrierCode === 'homedelivery' && !test) {
      const event = new CustomEvent('isClicknCollectEvent', {
        detail: false, // Ensure detail matches the new state
      });
      window.dispatchEvent(event);
    }
  }, []);

  //added cause when the clickncollect and mutation is being sent but when reloading the page then customevent is not changing (unchecking the checkbox)
  useEffect(() => {
    setTimeout(() => {
      const isClickAndCollect =
        cartselectedshippingmethod?.carrier_code === 'clickncollect';
      setIsClickAndCollectSelected(isClickAndCollect);

      let gettest = localStorage.getItem('isClickAndCollect');
      if (isClickAndCollect) {
        localStorage.setItem('isClickAndCollect', 'true');
        window.dispatchEvent(
          new CustomEvent('isClicknCollectEvent', { detail: true })
        );
      } else {
        localStorage.setItem('isClickAndCollect', 'false');
        window.dispatchEvent(
          new CustomEvent('isClicknCollectEvent', { detail: false })
        );
      }
    }, 0);
  }, [cartselectedshippingmethod]);

  const selectedMethodId = `${methodCarrierCode}__${methodMethodCode}`;
  const [selectedLocation, setSelectedLocation] = useState(selectedMethodId);
  const [availablePlaceList, setAvailablePlaceList] = useState([]);
  const [preferredDay, setPreferredDay] = useState([]);
  const [hours, setHours] = useState([]);
  const [isClickAndCollectSelected, setIsClickAndCollectSelected] =
    useState(false);
  const [selectedMethodOption, setSelectedMethodOption] = useState('');
  const [showPreferredDay, setShowPreferredDay] = useState(false);
  const [showHourSelection, setShowHourSelection] = useState(false); // State to show hour selection
  const [selectedPreferredDay, setSelectedPreferredDay] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedOptionDetails, setSelectedOptionDetails] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const { clicknCollectList } = useAppContext();
  const [initialShippingMethodSelected, setInitialShippingMethodSelected] =
    useState(false);
  useEffect(() => {
    if (cartselectedshippingmethod?.method_code) {
      const initialMethodId = `${cartselectedshippingmethod?.carrier_code}__${cartselectedshippingmethod?.method_code}`;
      setSelectedMethodOption(cartselectedshippingmethod.method_code);
      setSelectedLocation(initialMethodId);

      if (initialMethodId.startsWith('clickncollect')) {
        setIsClickAndCollectSelected(true);
      }
      // setInitialShippingMethodSelected(true);
    } else {
      // Default to Home Delivery if no method is selected
      const defaultMethod = _objToArray(methodList).find(
        (method) =>
          !method.carrierTitle.toLowerCase().includes('click & collect')
      );
      if (defaultMethod) {
        setSelectedMethodOption(defaultMethod.methodCode);
        // const entries = Object.entries(methodList);
        // const homeDeliveryEntry = entries.find(
        //   ([key, value]) => value.carrierCode === 'homedelivery'
        // );
        // handleShippingMethodSelection(homeDeliveryEntry);
      }
    }
  }, [cartselectedshippingmethod]);

  useEffect(() => {
    if (selectedMethodId) {
      const initialOption = availablePlaceList.find(
        (option) =>
          `clickncollect__clickncollect_${option.source_code}` ===
          selectedMethodId
      );
      if (initialOption) {
        setSelectedOptionDetails(initialOption);
        setMapCenter({
          lat: parseFloat(initialOption.map_coordinates.latitude),
          lng: parseFloat(initialOption.map_coordinates.longitude),
        });
        // Set preferredDay and other related states as needed
      }
    }
  }, [selectedMethodId, availablePlaceList]);
  useEffect(() => {
    if (clicknCollectList) {
      setAvailablePlaceList(clicknCollectList.pickup_locations);
    }
  }, [clicknCollectList]);

  // useEffect(() => {
  //   if (selectedMethodId && selectedMethodId.startsWith('clickncollect')) {
  //     setIsClickAndCollectSelected(true);
  //     setSelectedLocation(selectedMethodId);
  //   } else {
  //     setIsClickAndCollectSelected(false);
  //   }
  // }, [selectedMethodId]);

  useEffect(() => {
    // if (formikData?.formSectionValues?.methodTitle) {
    // this is commented because, there was a glitch in credit and debit, payemtMethodFormManager.jsx[dependency array] aggregatedData, formikData
    if (true) {
      let test;
      if (selectedOptionDetails?.name) {
        test = selectedOptionDetails.name;
      } else if (formikData?.formSectionValues?.methodTitle) {
        test = formikData.formSectionValues.methodTitle;
      }
      const matchingObject = Object.values(availablePlaceList).find(
        (item) => item.name === test
      );
      if (matchingObject) {
        setPreferredDay(matchingObject.pickup_datetime[0].date_incl_hours);
        setShowPreferredDay(true);
      }
    }
  }, [
    formikData?.formSectionValues?.methodTitle,
    availablePlaceList,
    selectedOptionDetails,
  ]);

  const availableOption = [
    ...availablePlaceList.map((method) => ({
      value: `clickncollect__clickncollect_${method.source_code}`,
      label: `${method.name}`,
      is_warehouse: method.is_warehouse,
    })),
  ];

  // by default shipping will be selected -- code from here to

  // useEffect(() => {
  //   if(!isClickAndCollectSelected && selectedMethodOption !== 'clickAndCollect') {
  //     handleShippingMethodSelection('homedelivery')
  //   }
  // },[cart.shipping_address?.firstname])

  // useEffect(() => {
  //   if(!isClickAndCollectSelected) {
  //     handleShippingMethodSelection('homedelivery')
  //   }
  // },[])

  //code till here

  const handleShippingMethodSelection = async (methodSelected) => {
    // const methodSelected = methodList[event?.target.value];
    var carrierCode = '';
    var methodCode = '';

    if (methodSelected === 'homedelivery') {
      carrierCode = 'homedelivery';
      methodCode = 'homedelivery';
    }
    // const {
    //   carrierCode,
    //   methodCode,
    //   // id: methodId,
    //   methodTitle,
    // } = methodSelected;
    // if (methodId === selectedMethodId) {
    //   return;
    // }
    setFieldValue(SHIPPING_METHOD, {
      carrierCode,
      methodCode,
      // methodId,
      // methodTitle,
    });
    setFieldTouched(fields.carrierCode, true);
    setFieldTouched(fields.methodCode, true);
    setFieldTouched(fields.methodId, true);
    await submitHandler({
      carrierCode,
      methodCode,
    });
  };

  // useEffect(() => {
  //   if (selectedMethod.carrierCode === 'homedelivery') {
  //     setTimeout(() => {
  //       handleShippingMethodSelection(selectedMethod);
  //     }, 200);
  //   }

  //   // // Clear any existing timeout when methodList changes
  //   // const timeoutId = setTimeout(() => {
  //   //   console.log('triggering initial req>>');
  //   //   const entries = Object.entries(methodList);
  //   //   const homeDeliveryEntry = entries.find(
  //   //     ([key, value]) => value.carrierCode === 'homedelivery'
  //   //   );
  //   //   handleShippingMethodSelection(homeDeliveryEntry);
  //   // }, 2500); // Adjust the delay as needed (1000ms = 1 second)

  //   // // Clean up function to clear the timeout if the component unmounts or methodList changes
  //   // return () => clearTimeout(timeoutId);
  // }, [initialShippingMethodSelected]);

  const handleLocationSelection = (event) => {
    const methodId = event.target.value;
    setSelectedLocation(methodId);
    setSelectedPreferredDay('');
    if (methodId !== 'pickupLocation') {
      setShowPreferredDay(true);
    } else {
      setShowPreferredDay(false);
    }

    // Only set the first location when "click and collect" is selected and no location is selected
    if (
      methodId.startsWith('clickncollect__clickncollect') &&
      !selectedOptionDetails
    ) {
      const defaultLocation = availablePlaceList[0]; // Default to the first location

      if (defaultLocation) {
        setSelectedOptionDetails(defaultLocation);
        setMapCenter({
          lat: parseFloat(defaultLocation.map_coordinates.latitude),
          lng: parseFloat(defaultLocation.map_coordinates.longitude),
        });
        setSelectedLocation(
          `clickncollect__clickncollect_${defaultLocation.source_code}`
        );
      }
    }

    // Find the selected location from the availablePlaceList
    const selectedOption = availablePlaceList.find(
      (option) =>
        `clickncollect__clickncollect_${option.source_code}` === methodId
    );

    // If a valid option is selected, set the location details and map center
    if (selectedOption) {
      setSelectedOptionDetails(selectedOption);
      setMapCenter({
        lat: parseFloat(selectedOption.map_coordinates.latitude),
        lng: parseFloat(selectedOption.map_coordinates.longitude),
      });
    }
  };

  const handleMethodChange = async (methodKey) => {
    if (methodKey === 'homedelivery') {
      handleShippingMethodSelection('homedelivery');
      localStorage.setItem('isClickAndCollect', 'false');
    }
    setSelectedMethodOption(methodKey);
    setIsClickAndCollectSelected(methodKey === 'clickAndCollect');

    const isClickAndCollect = methodKey === 'clickAndCollect';
    setIsClickAndCollectSelected(isClickAndCollect);
    localStorage.setItem(
      'isClickAndCollect',
      isClickAndCollect ? 'true' : 'false'
    );

    // Dispatch custom event
    if (isClickAndCollect) {
      const event = new CustomEvent('isClicknCollectEvent', {
        detail: true, // Ensure detail matches the new state
      });
      window.dispatchEvent(event);
    } else {
      const event = new CustomEvent('isClicknCollectEvent', {
        detail: false, // Ensure detail matches the new state
      });
      window.dispatchEvent(event);
    }

    // if (methodKey === 'clickAndCollect') {
    //   console.log('inside method');
    //   await submitHandler({
    //     carrierCode: 'clickncollect',
    //     cartId: '',
    //     clickncollect_date: '',
    //     clickncollect_store: '',
    //     clickncollect_time: '',
    //     methodCode: '',
    //   });
    // }

    // Reset state and form values when switching to "Click & Collect"
    if (methodKey === 'clickAndCollect') {
      setSelectedLocation(''); // Clear selected location
      setPreferredDay([]); // Clear preferred days
      setSelectedPreferredDay(''); // Clear selected preferred day
      setHours([]); // Clear hours
      setSelectedHour(''); // Clear selected hour
      setSelectedOptionDetails([]);
      setShowPreferredDay(false); // Clear selected option details
      setMapCenter(null); // Clear map center
    }

    // Find the selected method from the methodList
    const methodSelected = Object.values(methodList).find(
      (method) => method.methodCode === methodKey
    );
    if (methodSelected) {
      handleShippingMethodSelection({ target: { value: methodSelected.id } });
    }

    if (methodKey !== 'clickAndCollect') {
      // setSelectedLocation(''); // Reset location if another method is selected
      handleShippingMethodSelection(methodSelected);
    }
  };

  const handlePreferredDaySelection = (event) => {
    const selectedDay = event.target.value;
    setSelectedPreferredDay(selectedDay); // Update state
    setSelectedHour('');

    const selectedDayObject = preferredDay.find(
      (day) => day.value === selectedDay
    );
    if (selectedDayObject && selectedDayObject.hours) {
      setHours(selectedDayObject.hours); // Set available hours
      setShowHourSelection(true); // Show hour selection dropdown
    }
  };

  if (selectedHour) {
    const event = new CustomEvent('isHourSelected', {
      detail: {
        selected: true,
        method: 'clickandcollect',
      },
    });
    window.dispatchEvent(event);
  } else {
    const event = new CustomEvent('isHourSelected', {
      detail: {
        selected: false,
        method: 'clickandcollect',
      }, // Ensure detail matches the new state
    });
    window.dispatchEvent(event);
  }

  const handleHourSelection = async (event) => {
    const selectedHourValue = event.target.value;
    setSelectedHour(selectedHourValue);
    // Trigger submitHandler only when hour is selected
    const carrierCode = 'clickncollect';
    let originalString = selectedLocation;
    let trimmedString = originalString.replace('clickncollect__', ''); // Removes the first occurrence of "clickncollect_"
    const methodCode = trimmedString;

    // const methodSelected = methodList[selectedLocation];
    // const {
    //   carrierCode,
    //   methodCode,
    //   id: methodId,
    //   methodTitle,
    // } = methodSelected;
    await submitHandler({
      carrierCode,
      methodCode,
      clickncollect_store: methodCode,
      clickncollect_date: selectedPreferredDay,
      clickncollect_time: selectedHourValue,
    });
    setSelectedHour(selectedHourValue);
  };

  if (!methodsAvailable) {
    return null;
  }
  const clickAndCollectMethods = _objToArray(methodList).filter((method) =>
    method.carrierTitle.toLowerCase().includes('click & collect')
  );

  const otherMethods = _objToArray(methodList).filter(
    (method) => !method.carrierTitle.toLowerCase().includes('click & collect')
  );

  return (
    <div className="pt-4 font-gotham">
      <ul className="flex flex-col flex-col-reverse">
        <div>
          {isClickAndCollectSelected && (
            <div className="">
              <div className="max-lg:hidden block desktop pt-[40px] max-lg:pt-[20px]">
                <ToggleBox show title={__('Pick from Store/Warehouse')}>
                  <div className="pt-6">
                    <div className="flex space-x-4 max-lg:flex-col max-lg:gap-y-[16px]">
                      {' '}
                      <SelectInput
                        className="px-[30px] form-select h-[48px] w-full  max-lg:text-[14px]"
                        isClicknCollect
                        defaultValue="pickupLocation"
                        value={selectedLocation}
                        // label={__('Select a pickup location')}
                        name={fields.methodTitle}
                        onChange={handleLocationSelection}
                        formikData={formikData}
                        options={availableOption}
                      />
                      {showPreferredDay && (
                        <div className="pl-[25px] max-lg:pl-unset">
                          <select
                            className="form-select px-[30px] h-[48px] w-full  max-lg:text-[14px]"
                            value={selectedPreferredDay} // Bind state value here
                            name="preferredDay"
                            onChange={handlePreferredDaySelection} // Handle change
                          >
                            <option value="" disabled>
                              Preferred day
                            </option>
                            {preferredDay.map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {showPreferredDay && selectedPreferredDay && (
                      <div className="mt-4">
                        <select
                          className="w-full max-w-[27.5rem] xs:block form-select px-[30px] h-[48px]  max-lg:text-[14px]"
                          value={selectedHour}
                          name="preferredHour"
                          onChange={handleHourSelection} // Handle hour selection
                        >
                          <option value="" disabled>
                            Select an hour
                          </option>
                          {hours.map((hour) => (
                            <option key={hour.value} value={hour.value}>
                              {hour.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {mapCenter && (
                      <div className="mt-4">
                        <MapComponent
                          mapCenter={mapCenter}
                          locationDetails={selectedOptionDetails}
                          locationSelection={selectedLocation}
                        />
                        <strong className="text-[18px] pb-[20px] pt-[20px] max-lg:pt-[16px]">
                          Our Pickup Location
                        </strong>
                        <div className="flex pt-[20px] text-[14px]">
                          <div className="pr-[50px]">
                            <strong>{selectedOptionDetails.name}</strong>
                            <p>{selectedOptionDetails.street}</p>
                            <br></br>
                            <p>{selectedOptionDetails.city}</p>
                            <p>{selectedOptionDetails.source_code}</p>
                            <br></br>
                            <p>{selectedOptionDetails.phone}</p>
                            <p>{selectedOptionDetails.email}</p>
                            {/* <p>You can review this order before its final</p> */}
                          </div>
                          <div
                            className="pl-[120px] mt-[30px]"
                            dangerouslySetInnerHTML={{
                              __html: selectedOptionDetails.pickup_timings,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </ToggleBox>
              </div>
              <div className="mobile max-lg:block hidden">
                <h1 className="border-t-[1px] border-customGray-500 pt-5 text-[14px] font-light">
                  {__('Pick from Store/Warehouse')}
                </h1>
                <div className="pt-[10px]">
                  <div className="flex space-x-4 max-lg:flex-col max-lg:gap-y-[16px]">
                    {' '}
                    <SelectInput
                      className="px-[30px] form-select h-[48px] w-full  max-lg:text-[14px]"
                      isClicknCollect
                      value={selectedLocation}
                      // label={__('Select a pickup location')}
                      name={fields.methodTitle}
                      onChange={handleLocationSelection}
                      formikData={formikData}
                      options={availableOption}
                    />
                    {showPreferredDay && (
                      <div>
                        <select
                          className="form-select px-[30px] h-[48px] w-full  max-lg:text-[14px]"
                          value={selectedPreferredDay} // Bind state value here
                          name="preferredDay"
                          onChange={handlePreferredDaySelection} // Handle change
                        >
                          <option value="" disabled>
                            Preferred day
                          </option>
                          {preferredDay.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {showPreferredDay && selectedPreferredDay && (
                    <div className="mt-4">
                      <select
                        className="w-full max-w-[27.5rem] xs:block form-select px-[30px] h-[48px]  max-lg:text-[14px]"
                        value={selectedHour}
                        name="preferredHour"
                        onChange={handleHourSelection} // Handle hour selection
                      >
                        <option value="" disabled>
                          Select an hour
                        </option>
                        {hours.map((hour) => (
                          <option key={hour.value} value={hour.value}>
                            {hour.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {mapCenter && (
                    <div className="mt-4">
                      <MapComponent
                        mapCenter={mapCenter}
                        locationDetails={selectedOptionDetails}
                        locationSelection={selectedLocation}
                      />
                      <strong className="text-[18px] pb-[20px] pt-[20px] max-lg:pt-[16px]">
                        Our Pickup Location
                      </strong>
                      <div className="flex pt-[20px] text-[14px]">
                        <div className="pr-[50px]">
                          <strong>{selectedOptionDetails.name}</strong>
                          <p>{selectedOptionDetails.street}</p>
                          <br></br>
                          <p>{selectedOptionDetails.city}</p>
                          <p>{selectedOptionDetails.source_code}</p>
                          <br></br>
                          <p>{selectedOptionDetails.phone}</p>
                          <p>{selectedOptionDetails.email}</p>
                          {/* <p>You can review this order before its final</p> */}
                        </div>
                        <div
                          className="pl-[120px] mt-[30px]"
                          dangerouslySetInnerHTML={{
                            __html: selectedOptionDetails.pickup_timings,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex gap-[20%] ${
            isClickAndCollectSelected ? 'max-lg:pb-[20px]' : ''
          } max-lg:border-b-[1px] max-lg:border-customGray-500 max-lg:pb-[20px]`}
        >
          {clicknCollectList.pickup_locations.length > 0 && (
            <RadioInput
              name="shippingMethod"
              value="clickAndCollect"
              pi
              label={__('Click & Collect')}
              checked={isClickAndCollectSelected}
              // checked={selectedMethodOption === 'clickAndCollect'}
              onChange={() => {
                // setIsClickAndCollectSelected(true);
                handleMethodChange('clickAndCollect');
                // setSelectedLocation('');
              }}
            />
          )}
          <RadioInput
            value="homedelivery"
            label={__('Home Delivery')}
            name="shippingMethod"
            // checked={selectedMethodId === methodId}
            checked={selectedMethodOption === 'homedelivery'}
            // checked={!isClickAndCollectSelected}
            // onChange={handleShippingMethodSelection}
            onChange={(e) => handleMethodChange('homedelivery')}
          />
        </div>
        {/* <div className="flex gap-x-[25px]">
          {clickAndCollectMethods.length > 0 && (
            <li className="flex mr-[30px]">
              <RadioInput
                name="shippingMethod"
                value="clickAndCollect"
                label={__(<>
                  <span className="font-gotham text-[20px] pl-[15px]">
                    Click and Collect
                  </span>
                </>
              )}
                checked={isClickAndCollectSelected}
                // checked={selectedMethodOption === 'clickAndCollect'}
                onChange={() => {
                  // setIsClickAndCollectSelected(true);
                  handleMethodChange('clickAndCollect');
                  // setSelectedLocation('');
                }}
              />
            </li>
          )}
          {otherMethods.map((method) => {
            const { id: methodId, carrierTitle, methodTitle, price } = method;
            const methodName = `${carrierTitle} (${methodTitle}): `;
            const MethodRenderer = methodRenderers[methodId];

            return (
              <li key={methodId} className="flex">
                {MethodRenderer ? (
                  <MethodRenderer
                    method={method}
                    selected={selectedMethod}
                    actions={{ change: handleShippingMethodSelection }}
                  />
                ) : (
                  <>
                    <RadioInput
                      value={methodId}
                      label={__(
                        <>
                          <span className="font-gotham text-[20px] pl-[15px]">
                            Home Delivery
                          </span>
                        </>
                      )}
                      name="shippingMethod"
                      // checked={selectedMethodId === methodId}
                      checked={selectedMethodOption === method.methodCode}
                      // onChange={handleShippingMethodSelection}
                      onChange={(e) => handleMethodChange(method.methodCode)}
                    />
                  </>
                )}
              </li>
            );
          })}
        </div> */}
      </ul>
    </div>
  );
}

ShippingMethodList.propTypes = {
  methodRenderers: object,
};

ShippingMethodList.defaultProps = {
  methodRenderers: {},
};

export default ShippingMethodList;
