import React from 'react';
import { bool, func, node, oneOf, string } from 'prop-types';

function Button({ children, click, variant, disable, size, className, noBg }) {
  return (
    <button
      className={`${className} h-[40px] bg-customOrange btn btn-${
        variant || 'third'
      } btn-size-${size || 'md'} ${
        disable ? 'opacity-50 pointer-events-none' : ''
      } ${
        noBg
          ? '!bg-transparent text-errorRed underline p-0 m-0 border-none shadow-none'
          : 'bg-customOrange'
      } `}
      type="button"
      onClick={click}
      disabled={disable}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  click: func,
  size: string,
  disable: bool,
  className: string,
  children: node.isRequired,
  variant: oneOf([
    'success',
    'warning',
    'primary',
    'secondary',
    'danger',
    'bg-amber-600',
  ]),
  noBg: bool,
};

Button.defaultProps = {
  size: 'md',
  className: '',
  variant: '',
  disable: false,
  click: () => {},
  noBg: false,
};

export default Button;
