/* eslint-disable */
import React, { useState } from 'react';
import { get as _get } from 'lodash-es';
import Button from '../common/Button';

import Card from '../common/Card';
// import ToggleBox from '../common/ToggleBox';
import { __ } from '../../i18n';
import GiftCard from '../giftCard/GiftCard';
import CouponCode from '../couponCode';
// import StoreCredit from '../storeCredit/StoreCredit';
import useTotalsCartContext from './hooks/useTotalsCartContext';
import usePaymentMethodCartContext from '../paymentMethod/hooks/usePaymentMethodCartContext';
import { formatPrice } from '../../utils/price';
// import useStoreCreditFormContext from '../storeCredit/hooks';
import {
  useStoreCreditCartContext,
  useStoreCreditAppContext,
  useStoreCreditFormContext,
} from '../storeCredit/hooks';

import {
  useGiftCardCartContext,
  useGiftCardFormContext,
} from '../giftCard/hooks';

// import useTotalsFormContext from './hooks/useTotalsFormContext';

function Totals() {
  const {
    discounts,
    grandTotal,
    hasSubTotal,
    subTotalIncl,
    storeValue,
    grandTotalAmount,
    storeCurrency,
    // appliedTaxes,
    hasDiscounts,
    code,
    currentValue,
    giftCurrency,
    giftCardTotal,
    // hasAppliedTaxes,
    hasShippingRate,
    shippingMethodRate,
    shippingMethodTitle,
  } = useTotalsCartContext();
  const { selectedPaymentMethod } = usePaymentMethodCartContext();
  const { removeStoreCredit, storeCredit } = useStoreCreditCartContext();
  const { removeGiftCard, giftCard } = useGiftCardCartContext();

  // const giftCardCode = formikData?.formSectionValues?.giftCardCode;
  const { setPageLoader, setSuccessMessage, setErrorMessage } =
    useStoreCreditAppContext();

  const additionalData = _get(selectedPaymentMethod, 'additional_data', {});
  const amountValue = _get(additionalData, 'amount.value', 0);
  const selectedCodAmount = formatPrice(amountValue);
  const feeLabel = _get(additionalData, 'fee_label');
  const currency = _get(additionalData, 'amount.currency');
  let giftTotals = false;
  if (giftCardTotal) {
    if (giftCardTotal.length) {
      giftTotals = true;
    } else {
      giftTotals = false;
    }
  }

  const isStoreCreditApplied = storeCredit?.applied_balance?.value > 0;
  // const str = grandTotal;
  // const grandTotalNum = parseFloat(str.replace(/[^0-9.]/g, ''));

  const handleRemoveStoreCredit = async () => {
    try {
      setPageLoader(true);
      const result = await removeStoreCredit();
      window.localStorage.setItem('StoreCreditApplied', JSON.stringify(false));
      setSuccessMessage(__('The store credit payment has been removed from shopping cart.'));
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.message);
    } finally {
      setPageLoader(false);
    }
  };

  const handleRemoveGiftCard = async (giftCard) => {
    try {
      setPageLoader(true);
      await removeGiftCard(code);
      setSuccessMessage(__('Gift Card %1 was removed.', code));
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.message);
    } finally {
      setPageLoader(false);
    }
  };

  return (
    <Card classes="py-6">
      {/* <ToggleBox show title={__('Order Summary')}> */}
      <div className="font-gotham max-lg:text-[13px]">
        <div className="text-[19px]">
          <CouponCode />
        </div>
        <div className="text-[19px]">
          <GiftCard />
        </div>
        <h3 className="max-lg:block hidden font-semibold text-base">
          {__('Order Summary')}
        </h3>
        <div>
          <div className="pb-2 space-y-3 border-b text-lg max-lg:pb-16 max-lg:text-[13px]">
            {hasSubTotal && (
              <div className="flex justify-between items-center max-lg:text-sm ">
                <div className="max-lg:pt-4 text-[16px] max-lg:text-[13px]">
                  {__('Cart Subtotal')}
                </div>
                <div className="text-[16px] max-lg:text-[13px]">
                  {subTotalIncl}
                </div>
              </div>
            )}
            {hasDiscounts &&
              discounts.map((discount) => (
                <div
                  key={discount.label}
                  className="text-[16px] flex justify-between"
                >
                  <div className="text-[16px]">
                    {__('Discount')} ({__(discount.label)})
                  </div>
                  <div className="text-[16px]">{discount.price}</div>
                </div>
              ))}
            {giftTotals && (
              <div>
                <div className="flex justify-between items-center max-lg:text-sm">
                  <div className="text-[16px]">{__('GiftCard')}</div>
                  <Button
                    className="h-[0px] p-0 text-errorRed bg-white shadow-none underline text-[13px] font-semibold hover:text-darkerGrey"
                    click={() => handleRemoveGiftCard(giftCard.code)}
                  >
                    {__('Remove')}
                  </Button>
                  <div className="flex gap-1">
                    <div>- {giftCurrency}</div>
                    <div>{currentValue}</div>
                  </div>
                </div>
                <div className="text-[16px]">({code})</div>
              </div>
            )}

            {hasShippingRate && (
              <div className="flex justify-between items-center max-lg:text-sm">
                <div className="flex flex-col">
                  <div className="max-lg:text-[13px] text-[16px]">
                    {__('Shipping')}
                  </div>
                  <div className="flex">
                    <div className="text-[13px] text-customCement font-gotham font-book max-lg:text-[13px]">
                      {shippingMethodTitle}
                    </div>
                  </div>
                </div>

                <div className="text-[16px] max-lg:text-[13px]">
                  {shippingMethodRate}
                </div>
              </div>
            )}

            {isStoreCreditApplied && (
              <div>
                <div className="flex gap-1 justify-between items-center ">
                  <div className="flex text-base">
                    <div className="!gap-1 pr-1">{storeValue} </div>
                    <div> {__('Store Credit')}</div>
                  </div>
                  <div>
                    <Button
                      className="!h-4 p-0 text-errorRed bg-white shadow-none underline text-[13px] font-semibold hover:text-darkerGrey"
                      click={handleRemoveStoreCredit}
                    >
                      {__('Remove')}
                    </Button>
                  </div>
                  <div className=" text-base">
                    - {storeCurrency} {storeValue}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <p className=" text-[16px] text-customBlack font-gotham">
                {__(feeLabel)}
              </p>
              <div className="flex font-gotham text-customBlack">
                <div className="text-[16px]">
                  {additionalData &&
                    amountValue !== null &&
                    amountValue >= 10 && <p>{selectedCodAmount}</p>}
                </div>
              </div>
            </div>
            {/* {hasAppliedTaxes &&
              appliedTaxes.map((appliedTax) => (
                <div key={appliedTax.label} className="flex justify-between">
                  <div>
                    {__('Tax')} {__(appliedTax.label)}
                  </div>
                  <div>{appliedTax.price}</div>
                </div>
              ))} */}
          </div>

          <div className="mt-6 mb-3 max-lg:fixed max-lg:bottom-[56px] max-lg:mt-0 max-lg:mb-0 max-lg:pt-5 max-lg:left-0 max-lg:w-full max-lg:bg-white max-lg:px-5">
            <div className="flex justify-between text-xl font-bold">
              <div className="flex gap-[8px] items-center">
                <p className=" max-lg:text-base text-[16px]">{__('Total')}</p>
                <span className="text-xs text-customCement font-medium hidden max-lg:block max-lg:text-sm">
                  {__('(VAT Inclusive)')}
                </span>
              </div>
              <div className="max-lg:text-base text-[16px]">
                {grandTotal || '0'}
              </div>
            </div>
            <span className="float-right text-xs text-customCement font-medium">
              {__('(VAT Inclusive)')}
            </span>
          </div>
        </div>
      </div>
      {/* </ToggleBox> */}
    </Card>
  );
}

export default Totals;
