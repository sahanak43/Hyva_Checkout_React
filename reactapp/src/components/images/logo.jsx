import React from 'react';

import { LogoIcon, SecureCheckoutIcon } from '../assests';

function Logo() {
  return (
    <div className="flex justify-center bg-backgroundGrey max-lg:pr-[10px]">
      <div className=" container flex justify-around py-5 mb-5 bg-backgroundGrey relative max-lg:mb-0 max-lg:justify-between max-lg:align-center max-lg:ml-[5rem]">
        <div className="flex justify-center">
          <a href="/">
            <LogoIcon className="h-10 w-auto cursor-pointer max-lg:h-[25px]" />
          </a>
        </div>
        <div
          className=" absolute flex justify-center items-center "
          style={{ right: '0' }}
        >
          <SecureCheckoutIcon className="h-8 w-8 ml-2 max-lg:h-[22px] max-lg:w-[22px] max-lg:bg-[22px]" />
          <span className="text-textGrey text-9 font-medium tracking-1px max-lg:text-[10px]">
            Secure Checkout
          </span>
        </div>
      </div>
    </div>
  );
}

export default Logo;
