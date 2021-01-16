import { useEffect, useState } from 'react';

export function useLocalNominations(initialState = []) {
  const storageKey = 'nominations';
  const [nominations, setNominations] = useState(
    () => JSON.parse(window.localStorage.getItem(storageKey)) || initialState,
  );

  useEffect(() => {
    const jsonNominated = JSON.stringify(nominations);
    window.localStorage.setItem(storageKey, jsonNominated);
  }, [nominations]);

  return [nominations, setNominations];
}
