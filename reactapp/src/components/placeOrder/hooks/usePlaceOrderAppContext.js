import useAppContext from '../../../hook/useAppContext';

export default function usePlaceOrderAppContext() {
  const {
    setMessage,
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
    appDispatch,
  } = useAppContext();

  return {
    setMessage,
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
    appDispatch,
  };
}
