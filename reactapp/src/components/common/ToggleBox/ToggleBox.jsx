import React, { useEffect, useState } from 'react';
import { bool, node } from 'prop-types';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

import Header from '../Header';

function ToggleBox({ children, title, show, small, hasBorder, hrLine }) {
  const [open, setOpen] = useState(show);
  const arrowContent = (
    <div className="flex items-center justify-center pb-[15px]">
      {open && <MinusIcon className={small ? 'w-5 h-5' : 'w-6 h-6'} />}
      {!open && <PlusIcon className={small ? 'w-5 h-5' : 'w-6 h-6'} />}
    </div>
  );

  useEffect(() => {
    setOpen(show);
  }, [show]);

  return (
    <div>
      <Header
        small={small}
        extra={arrowContent}
        onClick={() => setOpen(!open)}
        onKeyPress={() => setOpen(!open)}
        hasBorder={hasBorder}
        isOpen={open}
      >
        {title}
      </Header>
      {hrLine && open && <hr />}
      <div style={{ display: open ? 'block' : 'none' }}>{children}</div>
    </div>
  );
}

ToggleBox.propTypes = {
  show: bool,
  small: bool,
  hrLine: bool,
  title: node.isRequired,
  children: node.isRequired,
  hasBorder: bool,
  // className: string,
};

ToggleBox.defaultProps = {
  show: false,
  small: false,
  hasBorder: true,
  hrLine: false,
  // className: '',
};

export default ToggleBox;
