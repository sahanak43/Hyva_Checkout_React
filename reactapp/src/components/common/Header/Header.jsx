/* eslint-disable */
import React from 'react';
import { bool, node } from 'prop-types';

function Header({ children, extra, small, hasBorder, isOpen, ...props }) {
  return (
    <header
      role="button"
      className={`flex items-center justify-between cursor-pointer select-none ${
        !hasBorder && isOpen
          ? 'border-b-[0px]'
          : 'border-b-[1px] border-customGray'
      }`}
      {...props}
    >
      {/* All the headings will be rendered here */}
      <span className="font-gotham font-book text-[24px] text-black leading-7 pb-4">
        {children}
      </span>
      {extra}
    </header>
  );
}

Header.propTypes = {
  extra: node,
  small: bool,
  children: node.isRequired,
  hasBorder: bool,
  // isOpen: bool,
};

Header.defaultProps = {
  small: false,
  extra: null,
  hasBorder: true,
  // isOpen: false,
};

export default Header;
