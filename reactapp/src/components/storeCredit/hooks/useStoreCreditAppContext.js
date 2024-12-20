import useAppContext from '../../../hook/useAppContext';

export default function useStoreCreditAppContext() {
  const { setPageLoader, setSuccessMessage, setErrorMessage, isLoggedIn } =
    useAppContext();

  return {
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
    isLoggedIn,
  };
}
