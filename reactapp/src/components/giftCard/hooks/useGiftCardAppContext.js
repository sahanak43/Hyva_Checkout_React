import useAppContext from '../../../hook/useAppContext';

export default function useGiftCardAppContext() {
  const { setPageLoader, setSuccessMessage, setErrorMessage } = useAppContext();

  return {
    setPageLoader,
    setSuccessMessage,
    setErrorMessage,
  };
}
