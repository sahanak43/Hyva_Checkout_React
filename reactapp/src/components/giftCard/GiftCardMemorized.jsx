import React, { useState, useEffect, useMemo } from 'react';
import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import GiftCardForm from './components/GiftCardForm';
import GiftCardFormikManager from './components/GiftCardFormikManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';

function GiftCardMemorized({ formikData }) {
  const { formSectionValues: { giftCardCode } = {} } = formikData || {};
  const isCodeApplied = (giftCardCode && true) || false;

  const [isToggleBoxOpen, setIsToggleBoxOpen] = useState(false);

  useEffect(() => {
    if (giftCardCode) {
      setIsToggleBoxOpen(true); // Open the form when a gift card code is entered
    } else if (isToggleBoxOpen && giftCardCode === '') {
      // Keep the form open after clearing the field with backspace
      setIsToggleBoxOpen(true);
    } else {
      // Initially, keep the form closed
      setIsToggleBoxOpen(false);
    }
  }, [giftCardCode]);

  const content = useMemo(
    () => (
      <GiftCardFormikManager formikData={{ formikData }}>
        <Card classNameProp="pl-0 pr-0 pt-0">
          <ToggleBox
            show={isToggleBoxOpen || isCodeApplied}
            title={
              <span className="text-[18px] font-medium max-lg:text-[16px]">
                {__('Have a Gift Card? Apply')}
              </span>
            }
            hasBorder={false}
          >
            <div className="border-b border-customGray pb-3">
              <GiftCardForm />
            </div>
          </ToggleBox>
        </Card>
      </GiftCardFormikManager>
    ),
    [formikData, isCodeApplied, isToggleBoxOpen]
  );

  return content;
}

GiftCardMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default GiftCardMemorized;
