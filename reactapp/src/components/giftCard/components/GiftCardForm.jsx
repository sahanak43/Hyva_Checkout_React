/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Button from '../../common/Button';
import TextInput from '../../common/Form/TextInput';
import { __ } from '../../../i18n';
import {
  useGiftCardFormContext,
  useGiftCardAppContext,
  useGiftCardCartContext,
} from '../hooks';
import useCartContext from '../../../hook/useCartContext';
import getGiftCardBalance from '../../../api/cart/getGiftCardBalance';

function GiftCardForm() {
  const {
    fields,
    formikData: { formikData },
  } = useGiftCardFormContext();
  const {
    cart: { appliedGiftCards: giftCardTotal },
  } = useCartContext();
  // const { cart: newCart } = useCartContext();
  const { setPageLoader, setSuccessMessage, setErrorMessage } =
    useGiftCardAppContext();
  const [showBalance, setShowBalance] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [appliedGiftCardCode, setAppliedGiftCardCode] = useState(null);
  const { giftCard, applyGiftCard } = useGiftCardCartContext();
  const giftCardCode = formikData?.formSectionValues?.giftCardCode;

  useEffect(() => {
    if (giftCard) {
      // setShowBalance(true);
      setBalanceData(giftCardTotal[0]?.current_balance);
      setAppliedGiftCardCode(giftCardCode);
      setIsInputDisabled(true);
    } else {
      setIsInputDisabled(false);
    }
  }, [giftCard, giftCardTotal, giftCardCode]);

  // useEffect(() => {
  //   if (giftCardCode === '' && appliedGiftCardCode) {
  //     // If input is cleared and a gift card is applied, remove the gift card
  //     handleRemoveGift();
  //   }
  // }, [giftCardCode]);

  const handleApplyGift = async (code) => {
    try {
      setPageLoader(true);
      const result = await applyGiftCard(code);
      result.giftCard.toLowerCase();
      setSuccessMessage(__('Gift Card %1 was added.', giftCardCode));
      setAppliedGiftCardCode(code);
      setIsInputDisabled(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.message || __('Gift Code: %1 is invalid', giftCardCode)
      );
    } finally {
      setPageLoader(false);
    }
  };

  // const handleRemoveGift = async () => {
  //   try {
  //     setPageLoader(true);
  //     await removeGiftCard(appliedGiftCardCode);
  //     formikData.setFieldValue(fields.giftCardCode, '');
  //     formikData.setFieldValue(fields.appliedGiftCode, '');
  //     setSuccessMessage(
  //       __('Gift Code: %1 removed successfully.', giftCardCode)
  //     );
  //     setAppliedGiftCardCode(null);
  //     setShowBalance(false);
  //   } catch (error) {
  //     console.error(error);
  //     setErrorMessage(error?.message);
  //   } finally {
  //     setPageLoader(false);
  //   }
  // };

  const submitHandler = async () => {
    if (!giftCardCode) {
      await formikData.setFieldTouched(fields.giftCardCode);
      // Set the error message as a string
      await formikData.setFieldError(
        fields.giftCardCode,
        __('This is a required field')
      );
      return;
    }

    await handleApplyGift(giftCardCode);
    await formikData.setFieldTouched(fields.giftCardCode);
  };

  const handleSeeBalance = async () => {
    if (!giftCardCode) {
      // Set the form field as touched to trigger validation
      await formikData.setFieldTouched(fields.giftCardCode);
      await formikData.setFieldError(
        fields.giftCardCode,
        __('This is a required field')
      );
      return;
    }

    setIsLoading(true);
    setIsButtonDisabled(true);
    setBalanceData(null);

    try {
      const result = await getGiftCardBalance(null, giftCardCode);
      if (result?.balance) {
        // Set the balance data
        setBalanceData(result.balance);
        setAppliedGiftCardCode(giftCardCode);
        setShowBalance(true);
      } else {
        setErrorMessage(__('Invalid or expired gift card code.'));
      }
    } catch (error) {
      setErrorMessage(
        __(
          'The gift card code is either incorrect or expired. Verify and try again.'
        )
      );
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <>
      <div>
        <div className="pt-2  flex">
          <TextInput
            formikData={formikData}
            name={fields.giftCardCode}
            className="h-[60px]"
            placeholder={__('XXXXXX')}
            disable={isInputDisabled}
          />
          <Button
            className="h-[60px] !text-[16px] !w-1/2 me-0 justify-center hover:bg-darkerGrey hover:border-darkerGrey"
            click={submitHandler}
            variant="primary"
            disable={isInputDisabled}
          >
            {__('Apply')}
          </Button>
        </div>
      </div>

      <div className="pt-[15px]">
        <Button
          className="h-[35px] !text-[16px] !px-[16px] hover:bg-darkerGrey hover:border-darkerGrey"
          click={handleSeeBalance}
          variant={giftCard ? 'danger' : 'primary'}
          disable={isLoading || isButtonDisabled}
        >
          {isLoading ? __('See Balance') : __('See Balance')}
        </Button>
        {showBalance && balanceData && (
          <div className="pt-[15px] text-[15px]">
            <p>GiftCard: {showBalance && appliedGiftCardCode}</p>
            <div className="flex gap-1">
              <span>{__('Current Balance :')}</span>
              <span>{showBalance && balanceData?.currency}</span>
              <span>{showBalance && balanceData?.value}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GiftCardForm;
