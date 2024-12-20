import React from 'react';

import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import CouponCodeForm from './components/CouponCodeForm';
import CouponCodeFormikManager from './components/CouponCodeFormikManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';

const CouponCodeMemorized = React.memo(({ formikData }) => (
  <CouponCodeFormikManager formikData={formikData}>
    <Card classNameProp="pl-0 pr-0 pt-0">
      <ToggleBox
        title={
          <span className="!text-[18px] font-medium max-lg:text-[16px]">
            {__('Have a Coupon code? Apply')}
          </span>
        }
        hasBorder={false}
      >
        <div className="border-b border-customGray pb-3">
          <CouponCodeForm />
        </div>
      </ToggleBox>
    </Card>
  </CouponCodeFormikManager>
));

CouponCodeMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default CouponCodeMemorized;
