import useLoginFormContext from '../hooks/useLoginFormContext';

function LoginInfoBox() {
  const { editMode } = useLoginFormContext();
  if (!editMode) {
    return null;
  }
}

export default LoginInfoBox;
