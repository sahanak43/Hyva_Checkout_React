import { useContext } from 'react';

// import { StoreCreditFormikContext } from '../context';
import { StoreCreditFormikContext } from '../context';

export default function useStoreCreditFormContext() {
  return useContext(StoreCreditFormikContext);
}
