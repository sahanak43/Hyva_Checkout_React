/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Button from '../../common/Button';
import { __ } from '../../../i18n';
import {
  useStoreCreditAppContext,
  useStoreCreditFormContext,
  useStoreCreditCartContext,
} from '../hooks';
import useCartContext from '../../../hook/useCartContext';

function StoreCreditForm() {
  const { fields, formikData } = useStoreCreditFormContext();
  const {
    cart: { appliedStoreCredit: storeCreditCart },
  } = useCartContext();
  const currentBalance = storeCreditCart?.current_balance;
  const currentValue = currentBalance?.value;
  const currentCurrency = currentBalance?.currency;
  const { setPageLoader, setSuccessMessage, setErrorMessage, isLoggedIn } =
    useStoreCreditAppContext();
  const { applyStoreCredit, storeCredit } = useStoreCreditCartContext();
  const [isChecked, setIsChecked] = useState(false);
  //   const [showBalance, setShowBalance] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  //   const [showBalance, setShowBalance] = useState(false);
  const [isStoreCreditApplied, setIsStoreCreditApplied] = useState(false);

  const isStoreCreditShown = storeCredit?.applied_balance?.value > 0;

  const checkStoreCredit = () => {
    const isStoreCreditApply =
      window.localStorage.getItem('StoreCreditApplied') || false;
    setIsStoreCreditApplied(JSON.parse(isStoreCreditApply));
  };

  useEffect(() => {
    checkStoreCredit();
    const handleStorageChange = (event) => {};
    const Data = window.addEventListener('storage', handleStorageChange);
  }, [isStoreCreditApplied, isStoreCreditShown]);
  //   const isStoreCreditApplied = storeCredit?.applied_balance?.value > 0;

  const handleApplyStoreCredit = async () => {
    try {
      setPageLoader(true);
      const result = await applyStoreCredit(); // Assuming no need to pass code as user is logged in
      window.localStorage.setItem('StoreCreditApplied', JSON.stringify(true));
      setSuccessMessage(__('Your store credit was successfully applied.'));
      checkStoreCredit();
      setBalanceData(result.current_balance);
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.message || __('Failed to apply store credit'));
    } finally {
      setPageLoader(false);
    }
  };

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  const isStoreAvailableLoggedInUser =
    storeCreditCart?.current_balance?.value > 0;

  return (
    isLoggedIn &&
    isStoreAvailableLoggedInUser && (
      <div className="store-credit-section">
        {/* Checkbox to toggle the usage of store credit */}
        {!isStoreCreditApplied && (
          <>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="use-store-credit"
                checked={isChecked}
                onChange={handleCheckboxToggle}
                className="appearance-none border-gray-400 border-[2px] checked:border-[#f37321] checked:border-[5px] cursor-pointer focus:outline-none focus:ring-0 bg-white checked:bg-white"
              />
              <label htmlFor="use-store-credit" className="ml-2 cursor-pointer">
                {__('Store Credit')}
              </label>
            </div>

            {/* Show "Use Store Credit" button when the checkbox is checked and store credit is not applied */}
            {isChecked && (
              <>
                <div className="flex ">
                  <span className="font-normal pt-[20px] font-gotham tracking-wider">
                    {currentCurrency} {currentValue}
                  </span>
                  <p className="pt-[20px] pl-[8px] font-normal font-gotham tracking-wider">
                    {' '}
                    {__('Store credit available')}
                  </p>
                </div>
                <Button
                  className="hover:bg-darkerGrey hover:border-darkerGrey mt-2 text-sm h-[32px] tracking-wider font-normal"
                  click={handleApplyStoreCredit}
                  variant="primary"
                >
                  {__('Use Store Credit')}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    )
  );
}

export default StoreCreditForm;
