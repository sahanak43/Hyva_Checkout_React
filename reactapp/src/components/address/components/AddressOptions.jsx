import React from 'react';
import { arrayOf, func, node, oneOfType, shape, string } from 'prop-types';

import { __ } from '../../../i18n';
import Card from '../../common/Card';
import { canAddressOptionRemoved } from '../utility';
import RadioInput from '../../common/Form/RadioInput';
import LocalStorage from '../../../utils/localStorage';
import useAppContext from '../../../hook/useAppContext';
// import ToggleBox from '../../common/ToggleBox/ToggleBox';
import useAddressWrapper from '../hooks/useAddressWrapper';

function AddressOptions({
  title,
  options,
  actions,
  inputName,
  selectedOption,
  submitButtonLabel,
}) {
  const { customerAddressList } = useAppContext();
  const { reCalculateMostRecentAddressOptions } = useAddressWrapper();
  /**
   * Removes a local storage address
   */
  const handleRecentlyUsedAddressRemoval = (addressId) => {
    LocalStorage.removeMostRecentlyUsedAddress(addressId);
    reCalculateMostRecentAddressOptions();
  };

  return (
    <Card bg="darker" classes="card-interactive font-gotham bg-white pl-0 pr-0">
      {/* <ToggleBox title={title} show small hrLine>  */}
      <div>
        <h2 className="font-gotham font-medium text-lg leading-7">{title}</h2>
        <div className="mt-3 space-y-2 grid grid-cols-2 gap-5 max-lg:grid-cols-1">
          {options.map(({ id, address }) => (
            <Card
              bg="white"
              key={id}
              classes="border-lightGrey border-solid border"
            >
              <div className="flex items-center justify-start">
                <div className="w-8">
                  <RadioInput
                    value={id}
                    name={inputName}
                    checked={selectedOption === id}
                    onChange={actions.handleOptionChange}
                  />
                </div>
                <label
                  htmlFor={`${inputName}_${id}`}
                  className="inline-block pl-2 text-sm cursor-pointer"
                >
                  {address.join(', ')}
                </label>
              </div>
              <div className="h-8 mt-2 -mx-4 -mb-4 bg-container">
                <div className="flex items-center justify-between h-full px-3 text-xs font-semibold text-secondary-lighter">
                  <span>
                    {customerAddressList[id]
                      ? __('FROM ADDRESS BOOK')
                      : __('MOST RECENTLY USED')}
                  </span>
                  {canAddressOptionRemoved(id, customerAddressList) && (
                    <button
                      type="button"
                      onClick={() => handleRecentlyUsedAddressRemoval(id)}
                      className="pr-2 font-semibold text-black hover:text-red-500"
                    >
                      {__('REMOVE')}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-end mt-3">
          <button
            type="button"
            disabled={!selectedOption}
            onClick={actions.handleShipToOtherOption}
            className={`flex items-center px-2 py-1 btn-secondary btn ${
              !selectedOption && 'opacity-50 pointer-events-none'
            }`}
          >
            {submitButtonLabel}
          </button>
        </div>
      </div>
      {/* </ToggleBox> */}
    </Card>
  );
}

AddressOptions.propTypes = {
  title: string,
  selectedOption: string,
  inputName: string.isRequired,
  submitButtonLabel: oneOfType([string, node]),
  options: arrayOf(shape({ id: string, address: arrayOf(string) })),
  actions: shape({ handleShipToOtherOption: func, handleOptionChange: func })
    .isRequired,
};

AddressOptions.defaultProps = {
  title: '',
  options: [],
  selectedOption: '',
  submitButtonLabel: '',
};

export default AddressOptions;
