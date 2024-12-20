/* eslint-disable */
import React, { useEffect, useState } from 'react';

import Button from '../../common/Button';
import TextInput from '../../common/Form/TextInput';
import {
  useCouponCodeAppContext,
  useCouponCodeFormContext,
  useCouponCodeCartContext,
} from '../hooks';
import { __ } from '../../../i18n';

function CouponCodeForm() {
  const [codeChecked, setCodeChecked] = useState('');
  const { fields, formikData, setFieldError, setFieldTouched, setFieldValue } =
    useCouponCodeFormContext();
  const { setPageLoader, setSuccessMessage, setErrorMessage } =
    useCouponCodeAppContext();
  const { appliedCoupon, applyCouponCode, removeCouponCode } =
    useCouponCodeCartContext();
  const couponCode = formikData?.formSectionValues?.couponCode;

  const handleApplyCoupon = async (code) => {
    try {
      setPageLoader(true);

      const result = await applyCouponCode(code);

      if (result?.appliedCoupon) {
        setFieldValue(fields.appliedCode, result?.appliedCoupon.toLowerCase());
      }

      setCodeChecked(code);
      setSuccessMessage(__('Your coupon was successfully applied.', couponCode));
    } catch (error) {
      console.error(error);
      setCodeChecked(code);
      setErrorMessage(
        error?.message || __('Coupon code: %1 is invalid.', couponCode)
      );
    } finally {
      setPageLoader(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setPageLoader(true);
      await removeCouponCode();
      setFieldValue(fields.couponCode, '');
      setFieldValue(fields.appliedCode, '');
      setCodeChecked('');
      setSuccessMessage(__('Your coupon was successfully removed.', couponCode));
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.message);
    } finally {
      setPageLoader(false);
    }
  };

  const submitHandler = async () => {
    if (!couponCode) {
      await setFieldTouched(fields.couponCode);
      await setFieldError(fields.couponCode, __('This is a required field'));
      return;
    }

    if (appliedCoupon) {
      await handleRemoveCoupon();
    } else {
      await handleApplyCoupon(couponCode);
    }
  };

  useEffect(() => {
    if (appliedCoupon) {
      setCodeChecked(appliedCoupon);
    }
  }, [appliedCoupon]);

  return (
    <div>
      <div className="py-2 flex">
        <TextInput
          className="h-[60px]"
          formikData={formikData}
          name={fields.couponCode}
          disabled={!!appliedCoupon}
          placeholder={__('XXXXXX')}
        />
        <Button
          className="h-[60px] !text-[16px] me-0 !w-1/2 justify-center hover:bg-darkerGrey hover:border-darkerGrey"
          click={submitHandler}
          variant="primary"
          // disable={appliedCoupon ? false : codeChecked === couponCode}
        >
          {appliedCoupon ? __('Remove Coupon Code') : __('Apply Coupon Code')}
        </Button>
      </div>
    </div>
  );
}

export default CouponCodeForm;
