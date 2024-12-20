import React, { useEffect, useState } from 'react';

import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import PaymentMethodList from './components/PaymentMethodList';
import NoPaymentMethodInfoBox from './components/NoPaymentMethodInfoBox';
import PaymentMethodFormManager from './components/PaymentMethodFormManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import customRenderers from '../../paymentMethods/customRenderers';
import usePaymentMethodCartContext from './hooks/usePaymentMethodCartContext';

const PaymentMethodMemorized = React.memo(({ formikData }) => {
  const { isPaymentAvailable } = usePaymentMethodCartContext();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <PaymentMethodFormManager formikData={formikData}>
      <Card
        classes={isPaymentAvailable ? '' : 'opacity-75'}
        classNameProp="pb-0"
      >
        {isDesktop ? (
          <div className="desktop font-gotham">
            <ToggleBox show title={__('Payment Methods')}>
              {isPaymentAvailable ? (
                <PaymentMethodList methodRenderers={customRenderers} />
              ) : (
                <NoPaymentMethodInfoBox />
              )}
            </ToggleBox>
          </div>
        ) : (
          <div className="mobile border-t-[1px] border-customGray-500 pt-[20px] font-gotham">
            <h1 className="text-[16px] font-book">{__('Payment Methods')}</h1>
            {isPaymentAvailable ? (
              <PaymentMethodList methodRenderers={customRenderers} />
            ) : (
              <NoPaymentMethodInfoBox />
            )}
          </div>
        )}
      </Card>
    </PaymentMethodFormManager>
  );
});

PaymentMethodMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default PaymentMethodMemorized;
