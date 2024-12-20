import React from 'react';
import { node, oneOf, string } from 'prop-types';

function Card({ children, bg, classes, classNameProp }) {
  return (
    <div
      className={` ${classNameProp} card w-full px-4 pt-4 pb-4.5 relative ${
        bg === 'dark' ? 'bg-container' : ''
      } ${bg === 'darker' ? 'bg-container-darker' : ''} ${
        bg === 'white' ? 'bg-white' : ''
      } ${classes}`}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: node,
  classes: string,
  bg: oneOf(['dark', 'darker', 'white', '']),
  classNameProp: string,
};

Card.defaultProps = {
  bg: '',
  classes: '',
  children: null,
  classNameProp: '',
};

export default Card;
