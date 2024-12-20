import React, { useEffect, useState } from 'react';

import Card from '../common/Card';
import ToggleBox from '../common/ToggleBox';
import LoginForm from './components/LoginForm';
import UserInfoBox from './components/UserInfoBox';
import LoginFormManager from './components/LoginFormManager';
import { __ } from '../../i18n';
import { formikDataShape } from '../../utils/propTypes';
import LoginInfoBox from './components/LoginInfoBox';
import useAppContext from '../../hook/useAppContext';

const LoginMemorized = React.memo(({ formikData }) => {
  const { isLoggedIn } = useAppContext();
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
    <LoginFormManager formikData={formikData}>
      <Card>
        {!isLoggedIn && ( // Conditionally render ToggleBox only if the user is NOT logged in
          <div className="font-gotham">
            {isDesktop ? (
              <div className="desktop">
                <ToggleBox
                  title={__('Contact Info')}
                  classname="border border-gray-300 rounded p-4 mt-4 font-gotham"
                  show
                >
                  <LoginInfoBox classname="text-lg font-semibold" />
                  <LoginForm />
                  <UserInfoBox />
                </ToggleBox>
              </div>
            ) : (
              <div className="mobile">
                <h1 className="font-book">{__('Contact Info')}</h1>
                <LoginInfoBox classname="text-lg font-semibold" />
                <LoginForm />
                <UserInfoBox />
              </div>
            )}
          </div>
        )}
      </Card>
    </LoginFormManager>
  );
});

LoginMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default LoginMemorized;
