import React from 'react';
import PropTypes from 'prop-types';
import CancelButton from './billingAddressForm/CancelButton';

function ModalBilling({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-[760px] w-full relative max-lg:absolute bottom-0">
        <button
          type="button"
          className="absolute top-2 right-6 text-[40px] max-lg:text-[30px]"
          onClick={onClose}
        >
          <CancelButton cross />
        </button>
        {children}
      </div>
    </div>
  );
}

ModalBilling.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ModalBilling;
