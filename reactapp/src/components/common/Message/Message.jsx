import React, { useEffect } from 'react';
import { get as _get } from 'lodash-es';

// import { _emptyFunc } from '../../../utils';
import useAppContext from '../../../hook/useAppContext';

function Message() {
  const { message, setMessage } = useAppContext();
  const msg = _get(message, 'message');
  const msgType = _get(message, 'type');

  // auto-disappear message after some time.
  useEffect(() => {
    // don't auto-hide error messages
    // if (!message || msgType === 'error') {
    //   return _emptyFunc();
    // }

    const timer = setTimeout(() => {
      setMessage(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [message, msgType, setMessage]);

  if (!message) {
    return null;
  }

  return (
    <div className="sticky z-10 my-4" style={{ top: '20px' }}>
      <div
        className={`relative max-w-[1218px] px-6 py-[15px] ml-auto mr-auto my-4 text-white border-0 rounded items-center justify-center font-[500] ${
          msgType === 'error'
            ? 'bg-gradient-to-r from-[#FF0101] to-[#FF8989]'
            : ''
        } ${
          msgType === 'success'
            ? 'bg-gradient-to-r from-[#FF7D01] to-[#FFB870]'
            : ''
        }`}
      >
        <span className="inline-block mr-8 align-middle">{msg}</span>
        <button
          type="button"
          className="absolute top-2 right-0 mt-2 mr-6 text-2xl font-semibold leading-none outline-none bg-none focus:outline-none"
          onClick={() => setMessage(false)}
        >
          <span>×</span>
        </button>
      </div>
    </div>
  );
}

export default Message;
