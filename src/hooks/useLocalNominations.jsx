import { useEffect, useState } from 'react';

export function useLocalNominations(initialState = []) {
  const [nominations, setNominations] = useState(
    () => JSON.parse(window.localStorage.getItem('nominated')) || initialState,
  );

  useEffect(() => {
    const jsonNominated = JSON.stringify(nominations);
    window.localStorage.setItem('nominated', jsonNominated);
  }, [nominations]);

  return [nominations, setNominations];
}
