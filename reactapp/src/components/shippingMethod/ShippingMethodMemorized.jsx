/* eslint-disable */
import React, { useEffect, useState } from 'react';


import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox/ToggleBox';
import ShippingMethodList from './components/ShippingMethodList';
import NoShippingMethodInfoBox from './components/NoShippingMethodInfoBox';
import ShippingMethodFormManager from './components/ShippingMethodFormManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import useShippingMethodCartContext from './hooks/useShippingMethodCartContext';
import customRenderers from '../../shippingMethods/customRenderers';

const ShippingMethodMemorized = React.memo(({ formikData }) => {
  const { methodsAvailable } = useShippingMethodCartContext();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  // useEffect to handle window resize and update state
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
    <ShippingMethodFormManager formikData={formikData}>
      <Card classes={methodsAvailable ? '' : 'opacity-75'} classNameProp="max-lg:pt-0 max-lg:pb-0">
      {isDesktop ? (
          // Render for desktop (width > 1024px)
          <div>
            <ToggleBox title={__('Choose Shipping Method')} show>
              <NoShippingMethodInfoBox />
              {/* <ShippingMethodList methodRenderers={customRenderers} /> */}
              <ShippingMethodList />
            </ToggleBox>
          </div>
        ) : (
          // Render for mobile (width <= 1024px)
          <div>
            <h1 className="border-t-[1px] border-customGray-500 pt-5 text-[16px] font-book font-gotham">Choose Shipping Method</h1>
            <NoShippingMethodInfoBox />
            {/* <ShippingMethodList methodRenderers={customRenderers} /> */}
            <ShippingMethodList />
          </div>
        )}
      </Card>
    </ShippingMethodFormManager>
  );
});

ShippingMethodMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default ShippingMethodMemorized;
