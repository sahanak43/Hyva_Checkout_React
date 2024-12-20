import useAppContext from '../../../hook/useAppContext';

export default function usePaymentMethodAppContext() {
  const {
    setMessage,
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
    isLoggedIn,
  } = useAppContext();

  return {
    setMessage,
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
    isLoggedIn,
  };
}
