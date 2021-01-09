import { useEffect, useState } from 'react';

export function useLocalNominations(initialState = []) {
  const [nominated, setNominated] = useState(
    () => JSON.parse(window.localStorage.getItem('nominated')) || initialState,
  );

  useEffect(() => {
    const jsonNominated = JSON.stringify(nominated);
    window.localStorage.setItem('nominated', jsonNominated);
  }, [nominated]);

  return [nominated, setNominated];
}
