import React, { useState } from 'react';

function BillingNewAddress() {
  const [selectedOption, setSelectedOption] = useState('click_collect');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <h2 className="text-25px font-medium my-5 border-b-2 border-grey pb-5  ">
        Choose Shipping Method
      </h2>
      <div className="flex items-center space-x-4">
        <label
          htmlFor="click_collect"
          className="inline-flex items-center text-customCement cursor-pointer mt-0 mr-7.5 mb-2.5 ml-0"
        >
          <input
            type="radio"
            name="shippingMethod"
            value="click_collect"
            checked={selectedOption === 'click_collect'}
            onChange={handleOptionChange}
            className="form-radio w-30px h-30px border-customOrange bg-customOrange "
          />
          <span className="ml-2 text-xl">Click & Collect</span>
        </label>
        <label
          htmlFor="home_delivery"
          className="inline-flex items-center text-customCement cursor-pointer mt-0 mr-7.5 mb-2.5 ml-0"
        >
          <input
            type="radio"
            name="shippingMethod"
            value="home_delivery"
            checked={selectedOption === 'home_delivery'}
            onChange={handleOptionChange}
            className="form-radio w-30px h-30px border-customOrange "
          />
          <span className="ml-2 text-xl">Home Delivery</span>
        </label>
      </div>
    </div>
  );
}

export default BillingNewAddress;
